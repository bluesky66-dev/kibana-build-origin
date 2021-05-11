"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrationStateActionMachine = migrationStateActionMachine;

var _elasticsearch = require("@elastic/elasticsearch");

var Option = _interopRequireWildcard(require("fp-ts/lib/Option"));

var _migrate_raw_docs = require("../migrations/core/migrate_raw_docs");

var _state_action_machine = require("./state_action_machine");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const logStateTransition = (logger, logMessagePrefix, oldState, newState, tookMs) => {
  if (newState.logs.length > oldState.logs.length) {
    newState.logs.slice(oldState.logs.length).forEach(log => logger[log.level](logMessagePrefix + log.message));
  }

  logger.info(logMessagePrefix + `${oldState.controlState} -> ${newState.controlState}. took: ${tookMs}ms.`);
};

const logActionResponse = (logger, logMessagePrefix, state, res) => {
  logger.debug(logMessagePrefix + `${state.controlState} RESPONSE`, res);
};

const dumpExecutionLog = (logger, logMessagePrefix, executionLog) => {
  logger.error(logMessagePrefix + 'migration failed, dumping execution log:');
  executionLog.forEach(log => {
    if (log.type === 'transition') {
      logger.info(logMessagePrefix + `${log.prevControlState} -> ${log.controlState}`, log.state);
    }

    if (log.type === 'response') {
      logger.info(logMessagePrefix + `${log.controlState} RESPONSE`, log.res);
    }
  });
};
/**
 * A specialized migrations-specific state-action machine that:
 *  - logs messages in state.logs
 *  - logs state transitions
 *  - logs action responses
 *  - resolves if the final state is DONE
 *  - rejects if the final state is FATAL
 *  - catches and logs exceptions and then rejects with a migrations specific error
 */


async function migrationStateActionMachine({
  initialState,
  logger,
  next,
  model
}) {
  const executionLog = [];
  const startTime = Date.now(); // Since saved object index names usually start with a `.` and can be
  // configured by users to include several `.`'s we can't use a logger tag to
  // indicate which messages come from which index upgrade.

  const logMessagePrefix = `[${initialState.indexPrefix}] `;
  let prevTimestamp = startTime;

  try {
    const finalState = await (0, _state_action_machine.stateActionMachine)(initialState, state => next(state), (state, res) => {
      var _newState$outdatedDoc;

      executionLog.push({
        type: 'response',
        res,
        controlState: state.controlState
      });
      logActionResponse(logger, logMessagePrefix, state, res);
      const newState = model(state, res); // Redact the state to reduce the memory consumption and so that we
      // don't log sensitive information inside documents by only keeping
      // the _id's of outdatedDocuments

      const redactedNewState = { ...newState,
        // @ts-expect-error outdatedDocuments don't exist in all states
        ...{
          outdatedDocuments: ((_newState$outdatedDoc = newState.outdatedDocuments) !== null && _newState$outdatedDoc !== void 0 ? _newState$outdatedDoc : []).map(doc => doc._id)
        }
      };
      executionLog.push({
        type: 'transition',
        state: redactedNewState,
        controlState: newState.controlState,
        prevControlState: state.controlState
      });
      const now = Date.now();
      logStateTransition(logger, logMessagePrefix, state, redactedNewState, now - prevTimestamp);
      prevTimestamp = now;
      return newState;
    });
    const elapsedMs = Date.now() - startTime;

    if (finalState.controlState === 'DONE') {
      logger.info(logMessagePrefix + `Migration completed after ${Math.round(elapsedMs)}ms`);

      if (finalState.sourceIndex != null && Option.isSome(finalState.sourceIndex)) {
        return {
          status: 'migrated',
          destIndex: finalState.targetIndex,
          sourceIndex: finalState.sourceIndex.value,
          elapsedMs
        };
      } else {
        return {
          status: 'patched',
          destIndex: finalState.targetIndex,
          elapsedMs
        };
      }
    } else if (finalState.controlState === 'FATAL') {
      dumpExecutionLog(logger, logMessagePrefix, executionLog);
      return Promise.reject(new Error(`Unable to complete saved object migrations for the [${initialState.indexPrefix}] index: ` + finalState.reason));
    } else {
      throw new Error('Invalid terminating control state');
    }
  } catch (e) {
    if (e instanceof _elasticsearch.errors.ResponseError) {
      var _e$body, _e$body$error, _e$body$error$reason, _e$body2, _e$body2$error, _e$body3, _e$body3$error, _e$body$error$reason2, _e$body4, _e$body4$error;

      logger.error(logMessagePrefix + `[${(_e$body = e.body) === null || _e$body === void 0 ? void 0 : (_e$body$error = _e$body.error) === null || _e$body$error === void 0 ? void 0 : _e$body$error.type}]: ${(_e$body$error$reason = (_e$body2 = e.body) === null || _e$body2 === void 0 ? void 0 : (_e$body2$error = _e$body2.error) === null || _e$body2$error === void 0 ? void 0 : _e$body2$error.reason) !== null && _e$body$error$reason !== void 0 ? _e$body$error$reason : e.message}`);
      dumpExecutionLog(logger, logMessagePrefix, executionLog);
      throw new Error(`Unable to complete saved object migrations for the [${initialState.indexPrefix}] index. Please check the health of your Elasticsearch cluster and try again. Error: [${(_e$body3 = e.body) === null || _e$body3 === void 0 ? void 0 : (_e$body3$error = _e$body3.error) === null || _e$body3$error === void 0 ? void 0 : _e$body3$error.type}]: ${(_e$body$error$reason2 = (_e$body4 = e.body) === null || _e$body4 === void 0 ? void 0 : (_e$body4$error = _e$body4.error) === null || _e$body4$error === void 0 ? void 0 : _e$body4$error.reason) !== null && _e$body$error$reason2 !== void 0 ? _e$body$error$reason2 : e.message}`);
    } else {
      logger.error(e);
      dumpExecutionLog(logger, logMessagePrefix, executionLog);

      if (e instanceof _migrate_raw_docs.CorruptSavedObjectError) {
        throw new Error(`${e.message} To allow migrations to proceed, please delete this document from the [${initialState.indexPrefix}_${initialState.kibanaVersion}_001] index.`);
      }

      throw new Error(`Unable to complete saved object migrations for the [${initialState.indexPrefix}] index. ${e}`);
    }
  }
}