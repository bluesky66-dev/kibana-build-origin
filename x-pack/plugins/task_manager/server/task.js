"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskLifecycleResult = exports.TaskStatus = exports.taskDefinitionSchema = exports.isFailedRunResult = void 0;

var _configSchema = require("@kbn/config-schema");

var _intervals = require("./lib/intervals");

var _result_type = require("./lib/result_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isFailedRunResult = result => {
  var _error;

  return !!((_error = result === null || result === void 0 ? void 0 : result.error) !== null && _error !== void 0 ? _error : false);
};

exports.isFailedRunResult = isFailedRunResult;

const taskDefinitionSchema = _configSchema.schema.object({
  /**
   * A unique identifier for the type of task being defined.
   */
  type: _configSchema.schema.string(),

  /**
   * A brief, human-friendly title for this task.
   */
  title: _configSchema.schema.maybe(_configSchema.schema.string()),

  /**
   * An optional more detailed description of what this task does.
   */
  description: _configSchema.schema.maybe(_configSchema.schema.string()),

  /**
   * How long, in minutes or seconds, the system should wait for the task to complete
   * before it is considered to be timed out. (e.g. '5m', the default). If
   * the task takes longer than this, Kibana will send it a kill command and
   * the task will be re-attempted.
   */
  timeout: _configSchema.schema.string({
    defaultValue: '5m'
  }),

  /**
   * Up to how many times the task should retry when it fails to run. This will
   * default to the global variable.
   */
  maxAttempts: _configSchema.schema.maybe(_configSchema.schema.number({
    min: 1
  })),

  /**
   * The maximum number tasks of this type that can be run concurrently per Kibana instance.
   * Setting this value will force Task Manager to poll for this task type seperatly from other task types
   * which can add significant load to the ES cluster, so please use this configuration only when absolutly necesery.
   */
  maxConcurrency: _configSchema.schema.maybe(_configSchema.schema.number({
    min: 0
  }))
}, {
  validate({
    timeout
  }) {
    if (!(0, _intervals.isInterval)(timeout) || (0, _result_type.isErr)((0, _result_type.tryAsResult)(() => (0, _intervals.parseIntervalAsMillisecond)(timeout)))) {
      return `Invalid timeout "${timeout}". Timeout must be of the form "{number}{cadance}" where number is an integer. Example: 5m.`;
    }
  }

});
/**
 * Defines a task which can be scheduled and run by the Kibana
 * task manager.
 */


exports.taskDefinitionSchema = taskDefinitionSchema;
let TaskStatus;
exports.TaskStatus = TaskStatus;

(function (TaskStatus) {
  TaskStatus["Idle"] = "idle";
  TaskStatus["Claiming"] = "claiming";
  TaskStatus["Running"] = "running";
  TaskStatus["Failed"] = "failed";
  TaskStatus["Unrecognized"] = "unrecognized";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));

let TaskLifecycleResult;
exports.TaskLifecycleResult = TaskLifecycleResult;

(function (TaskLifecycleResult) {
  TaskLifecycleResult["NotFound"] = "notFound";
})(TaskLifecycleResult || (exports.TaskLifecycleResult = TaskLifecycleResult = {}));