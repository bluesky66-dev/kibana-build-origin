"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _timelion_function = _interopRequireDefault(require("./timelion_function"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class Chainable extends _timelion_function.default {
  constructor(name, config) {
    super(name, config);
    this.chainable = true;
    Object.freeze(this);
  }

}

exports.default = Chainable;
module.exports = exports.default;