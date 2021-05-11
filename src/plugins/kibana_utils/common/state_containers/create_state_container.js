"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStateContainer = createStateContainer;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _deepFreezeStrict = _interopRequireDefault(require("deep-freeze-strict"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const $$observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';
const $$setActionType = '@@SET';
const isProduction = typeof window === 'object' ? process.env.NODE_ENV === 'production' : !process.env.NODE_ENV || process.env.NODE_ENV === 'production';
const defaultFreeze = isProduction ? value => value : value => {
  const isFreezable = value !== null && typeof value === 'object';
  if (isFreezable) return (0, _deepFreezeStrict.default)(value);
  return value;
};
/**
 * State container options
 * @public
 */

/**
 * @internal
 */
function createStateContainer(defaultState, pureTransitions = {}, // TODO: https://github.com/elastic/kibana/issues/54439
pureSelectors = {}, // TODO: https://github.com/elastic/kibana/issues/54439
options = {}) {
  const {
    freeze = defaultFreeze
  } = options;
  const data$ = new _rxjs.BehaviorSubject(freeze(defaultState));
  const state$ = data$.pipe((0, _operators.skip)(1));

  const get = () => data$.getValue();

  const container = {
    get,
    state$,
    getState: () => data$.getValue(),
    set: state => {
      container.dispatch({
        type: $$setActionType,
        args: [state]
      });
    },
    reducer: (state, action) => {
      if (action.type === $$setActionType) {
        return freeze(action.args[0]);
      }

      const pureTransition = pureTransitions[action.type];
      return pureTransition ? freeze(pureTransition(state)(...action.args)) : state;
    },
    replaceReducer: nextReducer => container.reducer = nextReducer,
    dispatch: action => data$.next(container.reducer(get(), action)),
    transitions: Object.keys(pureTransitions).reduce((acc, type) => ({ ...acc,
      [type]: (...args) => container.dispatch({
        type,
        args
      })
    }), {}),
    selectors: Object.keys(pureSelectors).reduce((acc, selector) => ({ ...acc,
      [selector]: (...args) => pureSelectors[selector](get())(...args)
    }), {}),
    addMiddleware: middleware => container.dispatch = middleware(container)(container.dispatch),
    subscribe: listener => {
      const subscription = state$.subscribe(listener);
      return () => subscription.unsubscribe();
    },
    [$$observable]: state$
  };
  return container;
}