"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useXJsonMode = void 0;

var _react = require("react");

var _json_xjson_translation_tools = require("./json_xjson_translation_tools");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const useXJsonMode = json => {
  const [xJson, setXJson] = (0, _react.useState)(() => json === null ? '' : (0, _json_xjson_translation_tools.expandLiteralStrings)(typeof json === 'string' ? json : JSON.stringify(json, null, 2)));
  return {
    xJson,
    setXJson,
    convertToJson: _json_xjson_translation_tools.collapseLiteralStrings
  };
};

exports.useXJsonMode = useXJsonMode;