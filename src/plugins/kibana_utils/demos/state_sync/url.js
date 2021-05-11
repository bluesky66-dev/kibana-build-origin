"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.result = void 0;

var _todomvc = require("../state_containers/todomvc");

var _state_containers = require("../../common/state_containers");

var _state_sync = require("../../public/state_sync");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const tick = () => new Promise(resolve => setTimeout(resolve));

const stateContainer = (0, _state_containers.createStateContainer)(_todomvc.defaultState, _todomvc.pureTransitions);
const {
  start,
  stop
} = (0, _state_sync.syncState)({
  stateContainer: withDefaultState(stateContainer, _todomvc.defaultState),
  storageKey: '_s',
  stateStorage: (0, _state_sync.createKbnUrlStateStorage)()
});
start();
const result = Promise.resolve().then(() => {
  // http://localhost/#?_s=!((completed:!f,id:0,text:'Learning+state+containers')"
  stateContainer.transitions.add({
    id: 2,
    text: 'test',
    completed: false
  }); // http://localhost/#?_s=!((completed:!f,id:0,text:'Learning+state+containers'),(completed:!f,id:2,text:test))"

  /* actual url updates happens async */

  return tick();
}).then(() => {
  stop();
  return window.location.href;
});
exports.result = result;

function withDefaultState( // eslint-disable-next-line @typescript-eslint/no-shadow
stateContainer, // eslint-disable-next-line @typescript-eslint/no-shadow
defaultState) {
  return { ...stateContainer,
    set: state => {
      stateContainer.set(state || defaultState);
    }
  };
}