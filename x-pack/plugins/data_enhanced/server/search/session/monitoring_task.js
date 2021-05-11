"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSearchSessionsTask = registerSearchSessionsTask;
exports.unscheduleSearchSessionsTask = unscheduleSearchSessionsTask;
exports.scheduleSearchSessionsTasks = scheduleSearchSessionsTasks;
exports.SEARCH_SESSIONS_TASK_ID = exports.SEARCH_SESSIONS_TASK_TYPE = void 0;

var _operators = require("rxjs/operators");

var _rxjs = require("rxjs");

var _check_running_sessions = require("./check_running_sessions");

var _server = require("../../../../../../src/core/server");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SEARCH_SESSIONS_TASK_TYPE = 'search_sessions_monitor';
exports.SEARCH_SESSIONS_TASK_TYPE = SEARCH_SESSIONS_TASK_TYPE;
const SEARCH_SESSIONS_TASK_ID = `data_enhanced_${SEARCH_SESSIONS_TASK_TYPE}`;
exports.SEARCH_SESSIONS_TASK_ID = SEARCH_SESSIONS_TASK_ID;

function searchSessionRunner(core, {
  logger,
  config
}) {
  return ({
    taskInstance
  }) => {
    const aborted$ = new _rxjs.BehaviorSubject(false);
    return {
      async run() {
        const sessionConfig = config.search.sessions;
        const [coreStart] = await core.getStartServices();

        if (!sessionConfig.enabled) {
          logger.debug('Search sessions are disabled. Skipping task.');
          return;
        }

        if (aborted$.getValue()) return;
        const internalRepo = coreStart.savedObjects.createInternalRepository([_common.SEARCH_SESSION_TYPE]);
        const internalSavedObjectsClient = new _server.SavedObjectsClient(internalRepo);
        await (0, _check_running_sessions.checkRunningSessions)({
          savedObjectsClient: internalSavedObjectsClient,
          client: coreStart.elasticsearch.client.asInternalUser,
          logger
        }, sessionConfig).pipe((0, _operators.takeUntil)(aborted$.pipe((0, _operators.filter)(aborted => aborted)))).toPromise();
        return {
          state: {}
        };
      },

      cancel: async () => {
        aborted$.next(true);
      }
    };
  };
}

function registerSearchSessionsTask(core, deps) {
  deps.taskManager.registerTaskDefinitions({
    [SEARCH_SESSIONS_TASK_TYPE]: {
      title: 'Search Sessions Monitor',
      createTaskRunner: searchSessionRunner(core, deps),
      timeout: `${deps.config.search.sessions.monitoringTaskTimeout.asSeconds()}s`
    }
  });
}

async function unscheduleSearchSessionsTask(taskManager, logger) {
  try {
    await taskManager.removeIfExists(SEARCH_SESSIONS_TASK_ID);
    logger.debug(`Search sessions cleared`);
  } catch (e) {
    logger.error(`Error clearing task, received ${e.message}`);
  }
}

async function scheduleSearchSessionsTasks(taskManager, logger, trackingInterval) {
  await taskManager.removeIfExists(SEARCH_SESSIONS_TASK_ID);

  try {
    await taskManager.ensureScheduled({
      id: SEARCH_SESSIONS_TASK_ID,
      taskType: SEARCH_SESSIONS_TASK_TYPE,
      schedule: {
        interval: `${trackingInterval.asSeconds()}s`
      },
      state: {},
      params: {}
    });
    logger.debug(`Search sessions task, scheduled to run`);
  } catch (e) {
    logger.error(`Error scheduling task, received ${e.message}`);
  }
}