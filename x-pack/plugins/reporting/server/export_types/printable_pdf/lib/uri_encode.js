"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uriEncode = void 0;

var _lodash = require("lodash");

var _server = require("../../../../../../../src/plugins/kibana_utils/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function toKeyValue(obj) {
  const parts = [];
  (0, _lodash.forEach)(obj, function (value, key) {
    if ((0, _lodash.isArray)(value)) {
      (0, _lodash.forEach)(value, function (arrayValue) {
        const keyStr = _server.url.encodeUriQuery(key, true);

        const valStr = arrayValue === true ? '' : '=' + _server.url.encodeUriQuery(arrayValue, true);
        parts.push(keyStr + valStr);
      });
    } else {
      const keyStr = _server.url.encodeUriQuery(key, true);

      const valStr = value === true ? '' : '=' + _server.url.encodeUriQuery(value, true);
      parts.push(keyStr + valStr);
    }
  });
  return parts.length ? parts.join('&') : '';
}

const uriEncode = {
  stringify: toKeyValue,
  string: _server.url.encodeUriQuery
};
exports.uriEncode = uriEncode;