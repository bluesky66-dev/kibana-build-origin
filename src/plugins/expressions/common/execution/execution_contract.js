"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExecutionContract = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * `ExecutionContract` is a wrapper around `Execution` class. It provides the
 * same functionality but does not expose Expressions plugin internals.
 */
class ExecutionContract {
  get isPending() {
    const state = this.execution.state.get().state;
    const finished = state === 'error' || state === 'result';
    return !finished;
  }

  constructor(execution) {
    this.execution = execution;

    _defineProperty(this, "cancel", () => {
      this.execution.cancel();
    });

    _defineProperty(this, "getData", async () => {
      try {
        return await this.execution.result;
      } catch (e) {
        return {
          type: 'error',
          error: {
            name: e.name,
            message: e.message,
            stack: e.stack
          }
        };
      }
    });

    _defineProperty(this, "getExpression", () => {
      return this.execution.expression;
    });

    _defineProperty(this, "getAst", () => this.execution.state.get().ast);

    _defineProperty(this, "inspect", () => this.execution.inspectorAdapters);
  }
  /**
   * Cancel the execution of the expression. This will set abort signal
   * (available in execution context) to aborted state, letting expression
   * functions to stop their execution.
   */


}

exports.ExecutionContract = ExecutionContract;