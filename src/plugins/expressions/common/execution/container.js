"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExecutionContainer = exports.executionPureTransitions = void 0;

var _state_containers = require("../../../kibana_utils/common/state_containers");

var _executor = require("../executor");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const executionDefaultState = { ..._executor.defaultState,
  state: 'not-started',
  ast: {
    type: 'expression',
    chain: []
  }
};
const executionPureTransitions = {
  start: state => () => ({ ...state,
    state: 'pending'
  }),
  setResult: state => result => ({ ...state,
    state: 'result',
    result
  }),
  setError: state => error => ({ ...state,
    state: 'error',
    error
  })
};
exports.executionPureTransitions = executionPureTransitions;

const freeze = state => state;

const createExecutionContainer = (state = executionDefaultState) => {
  const container = (0, _state_containers.createStateContainer)(state, executionPureTransitions, {}, {
    freeze
  });
  return container;
};

exports.createExecutionContainer = createExecutionContainer;