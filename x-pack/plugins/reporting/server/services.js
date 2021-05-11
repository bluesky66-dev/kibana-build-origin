"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFieldFormats = exports.getFieldFormats = void 0;

var _server = require("../../../../src/plugins/kibana_utils/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const [getFieldFormats, setFieldFormats] = (0, _server.createGetterSetter)('FieldFormats');
exports.setFieldFormats = setFieldFormats;
exports.getFieldFormats = getFieldFormats;