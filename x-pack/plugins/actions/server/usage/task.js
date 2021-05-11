"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeActionsTelemetry = initializeActionsTelemetry;
exports.scheduleActionsTelemetry = scheduleActionsTelemetry;
exports.telemetryTaskRunner = telemetryTaskRunner;
exports.TASK_ID = exports.TELEMETRY_TASK_TYPE = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _actions_telemetry = require("./actions_telemetry");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TELEMETRY_TASK_TYPE = 'actions_telemetry';
exports.TELEMETRY_TASK_TYPE = TELEMETRY_TASK_TYPE;
const TASK_ID = `Actions-${TELEMETRY_TASK_TYPE}`;
exports.TASK_ID = TASK_ID;

function initializeActionsTelemetry(logger, taskManager, core, kibanaIndex) {
  registerActionsTelemetryTask(logger, taskManager, core, kibanaIndex);
}

function scheduleActionsTelemetry(logger, taskManager) {
  scheduleTasks(logger, taskManager);
}

function registerActionsTelemetryTask(logger, taskManager, core, kibanaIndex) {
  taskManager.registerTaskDefinitions({
    [TELEMETRY_TASK_TYPE]: {
      title: 'Actions usage fetch task',
      timeout: '5m',
      createTaskRunner: telemetryTaskRunner(logger, core, kibanaIndex)
    }
  });
}

async function scheduleTasks(logger, taskManager) {
  try {
    await taskManager.ensureScheduled({
      id: TASK_ID,
      taskType: TELEMETRY_TASK_TYPE,
      state: {},
      params: {}
    });
  } catch (e) {
    logger.debug(`Error scheduling task, received ${e.message}`);
  }
}

function telemetryTaskRunner(logger, core, kibanaIndex) {
  return ({
    taskInstance
  }) => {
    const {
      state
    } = taskInstance;

    const callCluster = (...args) => {
      return core.getStartServices().then(([{
        elasticsearch: {
          legacy: {
            client
          }
        }
      }]) => client.callAsInternalUser(...args));
    };

    const actionsBulkGet = (objects, options) => {
      return core.getStartServices().then(([{
        savedObjects
      }]) => savedObjects.createInternalRepository(['action']).bulkGet(objects, options));
    };

    return {
      async run() {
        return Promise.all([(0, _actions_telemetry.getTotalCount)(callCluster, kibanaIndex), (0, _actions_telemetry.getInUseTotalCount)(callCluster, actionsBulkGet, kibanaIndex)]).then(([totalAggegations, totalInUse]) => {
          return {
            state: {
              runs: (state.runs || 0) + 1,
              count_total: totalAggegations.countTotal,
              count_by_type: totalAggegations.countByType,
              count_active_total: totalInUse.countTotal,
              count_active_by_type: totalInUse.countByType
            },
            runAt: getNextMidnight()
          };
        }).catch(errMsg => {
          logger.warn(`Error executing actions telemetry task: ${errMsg}`);
          return {
            state: {},
            runAt: getNextMidnight()
          };
        });
      }

    };
  };
}

function getNextMidnight() {
  return (0, _moment.default)().add(1, 'd').startOf('d').toDate();
}