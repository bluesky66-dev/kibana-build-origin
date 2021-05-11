"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPGRADE_ASSISTANT_DOC_ID = exports.UPGRADE_ASSISTANT_TYPE = exports.IndexGroup = exports.ReindexWarning = exports.REINDEX_OP_TYPE = exports.ReindexStatus = exports.ReindexStep = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let ReindexStep;
exports.ReindexStep = ReindexStep;

(function (ReindexStep) {
  ReindexStep[ReindexStep["created"] = 0] = "created";
  ReindexStep[ReindexStep["indexGroupServicesStopped"] = 10] = "indexGroupServicesStopped";
  ReindexStep[ReindexStep["readonly"] = 20] = "readonly";
  ReindexStep[ReindexStep["newIndexCreated"] = 30] = "newIndexCreated";
  ReindexStep[ReindexStep["reindexStarted"] = 40] = "reindexStarted";
  ReindexStep[ReindexStep["reindexCompleted"] = 50] = "reindexCompleted";
  ReindexStep[ReindexStep["aliasCreated"] = 60] = "aliasCreated";
  ReindexStep[ReindexStep["indexGroupServicesStarted"] = 70] = "indexGroupServicesStarted";
})(ReindexStep || (exports.ReindexStep = ReindexStep = {}));

let ReindexStatus;
exports.ReindexStatus = ReindexStatus;

(function (ReindexStatus) {
  ReindexStatus[ReindexStatus["inProgress"] = 0] = "inProgress";
  ReindexStatus[ReindexStatus["completed"] = 1] = "completed";
  ReindexStatus[ReindexStatus["failed"] = 2] = "failed";
  ReindexStatus[ReindexStatus["paused"] = 3] = "paused";
  ReindexStatus[ReindexStatus["cancelled"] = 4] = "cancelled";
})(ReindexStatus || (exports.ReindexStatus = ReindexStatus = {}));

const REINDEX_OP_TYPE = 'upgrade-assistant-reindex-operation';
exports.REINDEX_OP_TYPE = REINDEX_OP_TYPE;
let ReindexWarning;
exports.ReindexWarning = ReindexWarning;

(function (ReindexWarning) {
  ReindexWarning[ReindexWarning["allField"] = 0] = "allField";
  ReindexWarning[ReindexWarning["booleanFields"] = 1] = "booleanFields";
  ReindexWarning[ReindexWarning["apmReindex"] = 2] = "apmReindex";
  ReindexWarning[ReindexWarning["customTypeName"] = 3] = "customTypeName";
})(ReindexWarning || (exports.ReindexWarning = ReindexWarning = {}));

let IndexGroup; // Telemetry types

exports.IndexGroup = IndexGroup;

(function (IndexGroup) {
  IndexGroup["ml"] = "___ML_REINDEX_LOCK___";
  IndexGroup["watcher"] = "___WATCHER_REINDEX_LOCK___";
})(IndexGroup || (exports.IndexGroup = IndexGroup = {}));

const UPGRADE_ASSISTANT_TYPE = 'upgrade-assistant-telemetry';
exports.UPGRADE_ASSISTANT_TYPE = UPGRADE_ASSISTANT_TYPE;
const UPGRADE_ASSISTANT_DOC_ID = 'upgrade-assistant-telemetry';
exports.UPGRADE_ASSISTANT_DOC_ID = UPGRADE_ASSISTANT_DOC_ID;