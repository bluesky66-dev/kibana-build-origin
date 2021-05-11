"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esIndicesStateCheck = void 0;

var _get_index_state = require("../../common/get_index_state");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const esIndicesStateCheck = async (asCurrentUser, indices) => {
  const {
    body: response
  } = await asCurrentUser.indices.resolveIndex({
    name: '*',
    expand_wildcards: 'all'
  });
  const result = {};
  indices.forEach(index => {
    result[index] = (0, _get_index_state.getIndexState)(index, response);
  });
  return result;
};

exports.esIndicesStateCheck = esIndicesStateCheck;