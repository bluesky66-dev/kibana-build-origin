"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeProvider = void 0;

var _get_type = require("./get_type");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const identity = x => x;

const serializeProvider = types => ({
  serialize: value => (types[(0, _get_type.getType)(value)].serialize || identity)(value),
  deserialize: value => (types[(0, _get_type.getType)(value)].deserialize || identity)(value)
});

exports.serializeProvider = serializeProvider;