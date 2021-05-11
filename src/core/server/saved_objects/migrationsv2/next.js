"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.next = exports.nextActionMap = void 0;

var TaskEither = _interopRequireWildcard(require("fp-ts/lib/TaskEither"));

var Option = _interopRequireWildcard(require("fp-ts/lib/Option"));

var _pipeable = require("fp-ts/lib/pipeable");

var Actions = _interopRequireWildcard(require("./actions"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const nextActionMap = (client, transformRawDocs) => {
  return {
    INIT: state => Actions.fetchIndices(client, [state.currentAlias, state.versionAlias]),
    WAIT_FOR_YELLOW_SOURCE: state => Actions.waitForIndexStatusYellow(client, state.sourceIndex),
    SET_SOURCE_WRITE_BLOCK: state => Actions.setWriteBlock(client, state.sourceIndex.value),
    CREATE_NEW_TARGET: state => Actions.createIndex(client, state.targetIndex, state.targetIndexMappings),
    CREATE_REINDEX_TEMP: state => Actions.createIndex(client, state.tempIndex, state.tempIndexMappings),
    REINDEX_SOURCE_TO_TEMP: state => Actions.reindex(client, state.sourceIndex.value, state.tempIndex, Option.none, false, state.unusedTypesQuery),
    SET_TEMP_WRITE_BLOCK: state => Actions.setWriteBlock(client, state.tempIndex),
    REINDEX_SOURCE_TO_TEMP_WAIT_FOR_TASK: state => Actions.waitForReindexTask(client, state.reindexSourceToTargetTaskId, '60s'),
    CLONE_TEMP_TO_TARGET: state => Actions.cloneIndex(client, state.tempIndex, state.targetIndex),
    UPDATE_TARGET_MAPPINGS: state => Actions.updateAndPickupMappings(client, state.targetIndex, state.targetIndexMappings),
    UPDATE_TARGET_MAPPINGS_WAIT_FOR_TASK: state => Actions.waitForPickupUpdatedMappingsTask(client, state.updateTargetMappingsTaskId, '60s'),
    OUTDATED_DOCUMENTS_SEARCH: state => Actions.searchForOutdatedDocuments(client, state.targetIndex, state.outdatedDocumentsQuery),
    OUTDATED_DOCUMENTS_TRANSFORM: state => (0, _pipeable.pipe)(TaskEither.tryCatch(() => transformRawDocs(state.outdatedDocuments), e => {
      throw e;
    }), TaskEither.chain(docs => Actions.bulkOverwriteTransformedDocuments(client, state.targetIndex, docs))),
    MARK_VERSION_INDEX_READY: state => Actions.updateAliases(client, state.versionIndexReadyActions.value),
    MARK_VERSION_INDEX_READY_CONFLICT: state => Actions.fetchIndices(client, [state.currentAlias, state.versionAlias]),
    LEGACY_SET_WRITE_BLOCK: state => Actions.setWriteBlock(client, state.legacyIndex),
    LEGACY_CREATE_REINDEX_TARGET: state => Actions.createIndex(client, state.sourceIndex.value, state.legacyReindexTargetMappings),
    LEGACY_REINDEX: state => Actions.reindex(client, state.legacyIndex, state.sourceIndex.value, state.preMigrationScript, false, state.unusedTypesQuery),
    LEGACY_REINDEX_WAIT_FOR_TASK: state => Actions.waitForReindexTask(client, state.legacyReindexTaskId, '60s'),
    LEGACY_DELETE: state => Actions.updateAliases(client, state.legacyPreMigrationDoneActions)
  };
};

exports.nextActionMap = nextActionMap;

const next = (client, transformRawDocs) => {
  const map = nextActionMap(client, transformRawDocs);
  return state => {
    const delay = fn => {
      return () => {
        return state.retryDelay > 0 ? new Promise(resolve => setTimeout(resolve, state.retryDelay)).then(fn) : fn();
      };
    };

    if (state.controlState === 'DONE' || state.controlState === 'FATAL') {
      // Return null if we're in one of the terminating states
      return null;
    } else {
      // Otherwise return the delayed action
      // We use an explicit cast as otherwise TS infers `(state: never) => ...`
      // here because state is inferred to be the intersection of all states
      // instead of the union.
      const nextAction = map[state.controlState];
      return delay(nextAction(state));
    }
  };
};

exports.next = next;