"use strict";

var _react = _interopRequireDefault(require("react"));

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

/*
 * Mocking AutoSizer of the react-virtualized because it does not render children in JS DOM.
 * This seems related to not being able to properly discover height and width.
 */


jest.mock('react-virtualized', () => {
  const original = jest.requireActual('react-virtualized');
  return { ...original,
    AutoSizer: ({
      children
    }) => /*#__PURE__*/_react.default.createElement("div", null, children({
      height: 500,
      width: 500
    }))
  };
});