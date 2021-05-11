"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchDispatch = exports.getReducer = exports.getMiddleware = exports.getInitialState = void 0;

var _redux = require("redux");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _addons = _interopRequireDefault(require("@storybook/addons"));

var _jsondiffpatch = require("jsondiffpatch");

var _lodash = require("lodash");

var _constants = require("./constants");

var _reducers = require("../../../public/state/reducers");

var _initial_state = require("../../../public/state/initial_state");

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

/* es-lint-disable import/no-extraneous-dependencies */
// @ts-expect-error untyped local
// @ts-expect-error Untyped local


const getInitialState = () => (0, _initial_state.getInitialState)();

exports.getInitialState = getInitialState;

const getMiddleware = () => (0, _redux.applyMiddleware)(_reduxThunk.default);

exports.getMiddleware = getMiddleware;

const getReducer = () => (0, _reducers.getRootReducer)(getInitialState());

exports.getReducer = getReducer;

const patchDispatch = (store, dispatch) => action => {
  const channel = _addons.default.getChannel();

  const previousState = store.getState();
  const returnValue = dispatch(action);
  const newState = store.getState();
  const change = (0, _jsondiffpatch.diff)(previousState, newState) || {};
  channel.emit(_constants.EVENTS.ACTION, {
    previousState,
    newState,
    change,
    action: (0, _lodash.isFunction)(action) ? {
      type: '(thunk)'
    } : action
  });
  return returnValue;
};

exports.patchDispatch = patchDispatch;