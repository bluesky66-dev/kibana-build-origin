"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStateContainerReactHelpers = exports.useContainerSelector = exports.useContainerState = void 0;

var _react = _interopRequireDefault(require("react"));

var _useObservable = _interopRequireDefault(require("react-use/lib/useObservable"));

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const {
  useContext,
  useLayoutEffect,
  useRef,
  createElement: h
} = _react.default;
/**
 * React hooks that returns the latest state of a {@link StateContainer}.
 *
 * @param container - {@link StateContainer} which state to track.
 * @returns - latest {@link StateContainer} state
 * @public
 */

const useContainerState = container => (0, _useObservable.default)(container.state$, container.get());
/**
 * React hook to apply selector to state container to extract only needed information. Will
 * re-render your component only when the section changes.
 *
 * @param container - {@link StateContainer} which state to track.
 * @param selector - Function used to pick parts of state.
 * @param comparator - {@link Comparator} function used to memoize previous result, to not
 *    re-render React component if state did not change. By default uses
 *    `fast-deep-equal` package.
 * @returns - result of a selector(state)
 * @public
 */


exports.useContainerState = useContainerState;

const useContainerSelector = (container, selector, comparator = _fastDeepEqual.default) => {
  const {
    state$,
    get
  } = container;
  const lastValueRef = useRef(get());

  const [value, setValue] = _react.default.useState(() => {
    const newValue = selector(get());
    lastValueRef.current = newValue;
    return newValue;
  });

  useLayoutEffect(() => {
    const subscription = state$.subscribe(currentState => {
      const newValue = selector(currentState);

      if (!comparator(lastValueRef.current, newValue)) {
        lastValueRef.current = newValue;
        setValue(newValue);
      }
    });
    return () => subscription.unsubscribe();
  }, [state$, comparator]);
  return value;
};
/**
 * Creates helpers for using {@link StateContainer | State Containers} with react
 * Refer to {@link https://github.com/elastic/kibana/blob/master/src/plugins/kibana_utils/docs/state_containers/react.md | guide} for details
 * @public
 */


exports.useContainerSelector = useContainerSelector;

const createStateContainerReactHelpers = () => {
  const context = /*#__PURE__*/_react.default.createContext(null);

  const useContainer = () => useContext(context);

  const useState = () => {
    const container = useContainer();
    return useContainerState(container);
  };

  const useTransitions = () => useContainer().transitions;

  const useSelector = (selector, comparator = _fastDeepEqual.default) => {
    const container = useContainer();
    return useContainerSelector(container, selector, comparator);
  };

  const connect = mapStateToProp => component => props => h(component, { ...useSelector(mapStateToProp),
    ...props
  });

  return {
    Provider: context.Provider,
    Consumer: context.Consumer,
    context,
    useContainer,
    useState,
    useTransitions,
    useSelector,
    connect
  };
};

exports.createStateContainerReactHelpers = createStateContainerReactHelpers;