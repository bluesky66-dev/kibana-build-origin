"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExecutorContainer = exports.pureSelectors = exports.pureTransitions = exports.defaultState = void 0;

var _state_containers = require("../../../kibana_utils/common/state_containers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultState = {
  functions: {},
  types: {},
  context: {}
};
exports.defaultState = defaultState;
const pureTransitions = {
  addFunction: state => fn => ({ ...state,
    functions: { ...state.functions,
      [fn.name]: fn
    }
  }),
  addType: state => type => ({ ...state,
    types: { ...state.types,
      [type.name]: type
    }
  }),
  extendContext: state => extraContext => ({ ...state,
    context: { ...state.context,
      ...extraContext
    }
  })
};
exports.pureTransitions = pureTransitions;
const pureSelectors = {
  getFunction: state => id => state.functions[id] || null,
  getType: state => id => state.types[id] || null,
  getContext: ({
    context
  }) => () => context
};
exports.pureSelectors = pureSelectors;

const createExecutorContainer = (state = defaultState) => {
  const container = (0, _state_containers.createStateContainer)(state, pureTransitions, pureSelectors);
  return container;
};

exports.createExecutorContainer = createExecutorContainer;