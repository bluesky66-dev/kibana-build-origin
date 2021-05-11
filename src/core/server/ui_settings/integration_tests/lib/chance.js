"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chance = void 0;

var _chance = _interopRequireDefault(require("chance"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const chance = new _chance.default();
exports.chance = chance;