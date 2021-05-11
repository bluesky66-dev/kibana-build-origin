"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskRunnerFactory = void 0;

var _task_runner = require("./task_runner");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class TaskRunnerFactory {
  constructor() {
    _defineProperty(this, "isInitialized", false);

    _defineProperty(this, "taskRunnerContext", void 0);
  }

  initialize(taskRunnerContext) {
    if (this.isInitialized) {
      throw new Error('TaskRunnerFactory already initialized');
    }

    this.isInitialized = true;
    this.taskRunnerContext = taskRunnerContext;
  }

  create(alertType, {
    taskInstance
  }) {
    if (!this.isInitialized) {
      throw new Error('TaskRunnerFactory not initialized');
    }

    return new _task_runner.TaskRunner(alertType, taskInstance, this.taskRunnerContext);
  }

}

exports.TaskRunnerFactory = TaskRunnerFactory;