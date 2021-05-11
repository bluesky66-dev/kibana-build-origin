"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.result = exports.pureSelectors = exports.pureTransitions = exports.defaultState = void 0;

var _state_containers = require("../../common/state_containers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultState = {
  todos: [{
    id: 0,
    text: 'Learning state containers',
    completed: false
  }]
};
exports.defaultState = defaultState;
const pureTransitions = {
  add: state => todo => ({
    todos: [...state.todos, todo]
  }),
  edit: state => todo => ({
    todos: state.todos.map(item => item.id === todo.id ? { ...item,
      ...todo
    } : item)
  }),
  delete: state => id => ({
    todos: state.todos.filter(item => item.id !== id)
  }),
  complete: state => id => ({
    todos: state.todos.map(item => item.id === id ? { ...item,
      completed: true
    } : item)
  }),
  completeAll: state => () => ({
    todos: state.todos.map(item => ({ ...item,
      completed: true
    }))
  }),
  clearCompleted: state => () => ({
    todos: state.todos.filter(({
      completed
    }) => !completed)
  })
};
exports.pureTransitions = pureTransitions;
const pureSelectors = {
  todos: state => () => state.todos,
  todo: state => id => {
    var _state$todos$find;

    return (_state$todos$find = state.todos.find(todo => todo.id === id)) !== null && _state$todos$find !== void 0 ? _state$todos$find : null;
  }
};
exports.pureSelectors = pureSelectors;
const container = (0, _state_containers.createStateContainer)(defaultState, pureTransitions, pureSelectors);
container.transitions.add({
  id: 1,
  text: 'Learning transitions...',
  completed: false
});
container.transitions.complete(0);
container.transitions.complete(1);
console.log(container.selectors.todos()); // eslint-disable-line

const result = container.selectors.todos();
exports.result = result;