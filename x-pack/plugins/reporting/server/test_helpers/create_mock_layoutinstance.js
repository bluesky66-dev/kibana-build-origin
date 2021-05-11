"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockLayoutInstance = void 0;

var _constants = require("../../common/constants");

var _layouts = require("../lib/layouts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createMockLayoutInstance = captureConfig => {
  const mockLayout = (0, _layouts.createLayout)(captureConfig, {
    id: _constants.LAYOUT_TYPES.PRESERVE_LAYOUT,
    dimensions: {
      height: 100,
      width: 100
    }
  });
  mockLayout.selectors = {
    renderComplete: 'renderedSelector',
    itemsCountAttribute: 'itemsSelector',
    screenshot: 'screenshotSelector',
    timefilterDurationAttribute: 'timefilterDurationSelector'
  };
  return mockLayout;
};

exports.createMockLayoutInstance = createMockLayoutInstance;