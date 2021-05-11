"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexPatternSettings = getIndexPatternSettings;

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../common/constants");

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


function getIndexPatternSettings(indicesSettingsResp) {
  let maxResultWindow = Infinity;
  let maxInnerResultWindow = Infinity;
  Object.values(indicesSettingsResp).forEach(indexSettings => {
    const indexMaxResultWindow = _lodash.default.get(indexSettings, 'settings.index.max_result_window', _constants.DEFAULT_MAX_RESULT_WINDOW);

    maxResultWindow = Math.min(maxResultWindow, indexMaxResultWindow);

    const indexMaxInnerResultWindow = _lodash.default.get(indexSettings, 'settings.index.max_inner_result_window', _constants.DEFAULT_MAX_INNER_RESULT_WINDOW);

    maxInnerResultWindow = Math.min(indexMaxInnerResultWindow, indexMaxResultWindow);
  });
  return {
    maxResultWindow: maxResultWindow === Infinity ? _constants.DEFAULT_MAX_RESULT_WINDOW : maxResultWindow,
    maxInnerResultWindow: maxInnerResultWindow === Infinity ? _constants.DEFAULT_MAX_INNER_RESULT_WINDOW : maxInnerResultWindow
  };
}