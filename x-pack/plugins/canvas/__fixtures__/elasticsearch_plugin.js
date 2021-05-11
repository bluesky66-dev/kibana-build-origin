"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _elasticsearch = _interopRequireDefault(require("./elasticsearch"));

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


var _default = {
  getCluster: () => ({
    getClient: () => new _elasticsearch.default()
  }),
  status: {
    once: () => Promise.resolve()
  }
};
exports.default = _default;
module.exports = exports.default;