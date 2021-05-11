"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _react = _interopRequireDefault(require("react"));

var _context = require("../context");

var _canvas = require("./canvas");

var _supported_renderers = require("../supported_renderers");

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

/**
 * The overall Canvas Shareable Workpad app; the highest-layer component.
 */


const App = ({
  workpad,
  stage
}) => {
  const renderers = {};

  _supported_renderers.renderFunctions.forEach(fn => {
    const func = fn();
    renderers[func.name] = func;
  });

  const initialState = { ..._context.initialCanvasShareableState,
    stage,
    renderers,
    workpad
  };
  return /*#__PURE__*/_react.default.createElement(_context.CanvasShareableStateProvider, {
    initialState: initialState
  }, /*#__PURE__*/_react.default.createElement(_canvas.Canvas, null));
};

exports.App = App;