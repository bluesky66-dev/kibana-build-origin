"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDateSchema = void 0;

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

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


const toDateSchema = (0, _graphqlTag.default)`
  scalar ToDateArray
`;
exports.toDateSchema = toDateSchema;