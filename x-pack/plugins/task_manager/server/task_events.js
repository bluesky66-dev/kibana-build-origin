"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startTaskTimer = startTaskTimer;
exports.asTaskMarkRunningEvent = asTaskMarkRunningEvent;
exports.asTaskRunEvent = asTaskRunEvent;
exports.asTaskClaimEvent = asTaskClaimEvent;
exports.asTaskRunRequestEvent = asTaskRunRequestEvent;
exports.asTaskPollingCycleEvent = asTaskPollingCycleEvent;
exports.asTaskManagerStatEvent = asTaskManagerStatEvent;
exports.isTaskMarkRunningEvent = isTaskMarkRunningEvent;
exports.isTaskRunEvent = isTaskRunEvent;
exports.isTaskClaimEvent = isTaskClaimEvent;
exports.isTaskRunRequestEvent = isTaskRunRequestEvent;
exports.isTaskPollingCycleEvent = isTaskPollingCycleEvent;
exports.isTaskManagerStatEvent = isTaskManagerStatEvent;
exports.TaskClaimErrorType = exports.TaskEventType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let TaskEventType;
exports.TaskEventType = TaskEventType;

(function (TaskEventType) {
  TaskEventType["TASK_CLAIM"] = "TASK_CLAIM";
  TaskEventType["TASK_MARK_RUNNING"] = "TASK_MARK_RUNNING";
  TaskEventType["TASK_RUN"] = "TASK_RUN";
  TaskEventType["TASK_RUN_REQUEST"] = "TASK_RUN_REQUEST";
  TaskEventType["TASK_POLLING_CYCLE"] = "TASK_POLLING_CYCLE";
  TaskEventType["TASK_MANAGER_STAT"] = "TASK_MANAGER_STAT";
})(TaskEventType || (exports.TaskEventType = TaskEventType = {}));

let TaskClaimErrorType;
exports.TaskClaimErrorType = TaskClaimErrorType;

(function (TaskClaimErrorType) {
  TaskClaimErrorType["CLAIMED_BY_ID_OUT_OF_CAPACITY"] = "CLAIMED_BY_ID_OUT_OF_CAPACITY";
  TaskClaimErrorType["CLAIMED_BY_ID_NOT_RETURNED"] = "CLAIMED_BY_ID_NOT_RETURNED";
  TaskClaimErrorType["CLAIMED_BY_ID_NOT_IN_CLAIMING_STATUS"] = "CLAIMED_BY_ID_NOT_IN_CLAIMING_STATUS";
})(TaskClaimErrorType || (exports.TaskClaimErrorType = TaskClaimErrorType = {}));

function startTaskTimer() {
  const start = Date.now();
  return () => ({
    start,
    stop: Date.now()
  });
}

function asTaskMarkRunningEvent(id, event, timing) {
  return {
    id,
    type: TaskEventType.TASK_MARK_RUNNING,
    event,
    timing
  };
}

function asTaskRunEvent(id, event, timing) {
  return {
    id,
    type: TaskEventType.TASK_RUN,
    event,
    timing
  };
}

function asTaskClaimEvent(id, event, timing) {
  return {
    id,
    type: TaskEventType.TASK_CLAIM,
    event,
    timing
  };
}

function asTaskRunRequestEvent(id, // we only emit a TaskRunRequest event when it fails
event, timing) {
  return {
    id,
    type: TaskEventType.TASK_RUN_REQUEST,
    event,
    timing
  };
}

function asTaskPollingCycleEvent(event, timing) {
  return {
    type: TaskEventType.TASK_POLLING_CYCLE,
    event,
    timing
  };
}

function asTaskManagerStatEvent(id, event) {
  return {
    id,
    type: TaskEventType.TASK_MANAGER_STAT,
    event
  };
}

function isTaskMarkRunningEvent(taskEvent) {
  return taskEvent.type === TaskEventType.TASK_MARK_RUNNING;
}

function isTaskRunEvent(taskEvent) {
  return taskEvent.type === TaskEventType.TASK_RUN;
}

function isTaskClaimEvent(taskEvent) {
  return taskEvent.type === TaskEventType.TASK_CLAIM;
}

function isTaskRunRequestEvent(taskEvent) {
  return taskEvent.type === TaskEventType.TASK_RUN_REQUEST;
}

function isTaskPollingCycleEvent(taskEvent) {
  return taskEvent.type === TaskEventType.TASK_POLLING_CYCLE;
}

function isTaskManagerStatEvent(taskEvent) {
  return taskEvent.type === TaskEventType.TASK_MANAGER_STAT;
}