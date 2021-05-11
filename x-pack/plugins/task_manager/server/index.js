"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TaskManager", {
  enumerable: true,
  get: function () {
    return _plugin.TaskManagerPlugin;
  }
});
Object.defineProperty(exports, "TaskManagerSetupContract", {
  enumerable: true,
  get: function () {
    return _plugin.TaskManagerSetupContract;
  }
});
Object.defineProperty(exports, "TaskManagerStartContract", {
  enumerable: true,
  get: function () {
    return _plugin.TaskManagerStartContract;
  }
});
Object.defineProperty(exports, "TaskInstance", {
  enumerable: true,
  get: function () {
    return _task.TaskInstance;
  }
});
Object.defineProperty(exports, "ConcreteTaskInstance", {
  enumerable: true,
  get: function () {
    return _task.ConcreteTaskInstance;
  }
});
Object.defineProperty(exports, "TaskRunCreatorFunction", {
  enumerable: true,
  get: function () {
    return _task.TaskRunCreatorFunction;
  }
});
Object.defineProperty(exports, "TaskStatus", {
  enumerable: true,
  get: function () {
    return _task.TaskStatus;
  }
});
Object.defineProperty(exports, "RunContext", {
  enumerable: true,
  get: function () {
    return _task.RunContext;
  }
});
Object.defineProperty(exports, "isUnrecoverableError", {
  enumerable: true,
  get: function () {
    return _task_running.isUnrecoverableError;
  }
});
Object.defineProperty(exports, "throwUnrecoverableError", {
  enumerable: true,
  get: function () {
    return _task_running.throwUnrecoverableError;
  }
});
exports.config = exports.plugin = void 0;

var _lodash = require("lodash");

var _plugin = require("./plugin");

var _config = require("./config");

var _task = require("./task");

var _task_running = require("./task_running");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = initContext => new _plugin.TaskManagerPlugin(initContext);

exports.plugin = plugin;
const config = {
  schema: _config.configSchema,
  deprecations: () => [(settings, fromPath, log) => {
    const taskManager = (0, _lodash.get)(settings, fromPath);

    if (taskManager !== null && taskManager !== void 0 && taskManager.index) {
      log(`"${fromPath}.index" is deprecated. Multitenancy by changing "kibana.index" will not be supported starting in 8.0. See https://ela.st/kbn-remove-legacy-multitenancy for more details`);
    }

    if ((taskManager === null || taskManager === void 0 ? void 0 : taskManager.max_workers) > _config.MAX_WORKERS_LIMIT) {
      log(`setting "${fromPath}.max_workers" (${taskManager === null || taskManager === void 0 ? void 0 : taskManager.max_workers}) greater than ${_config.MAX_WORKERS_LIMIT} is deprecated. Values greater than ${_config.MAX_WORKERS_LIMIT} will not be supported starting in 8.0.`);
    }

    return settings;
  }]
};
exports.config = config;