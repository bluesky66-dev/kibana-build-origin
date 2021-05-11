"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getId = getId;

var _v = _interopRequireDefault(require("uuid/v4"));

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


function getId(type) {
  return `${type}-${(0, _v.default)()}`;
}