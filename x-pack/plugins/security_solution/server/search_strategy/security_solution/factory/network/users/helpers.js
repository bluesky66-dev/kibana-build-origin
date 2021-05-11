"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUsersEdges = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getUsersEdges = response => (0, _fp.getOr)([], `aggregations.users.buckets`, response.rawResponse).map(bucket => ({
  node: {
    _id: bucket.key,
    user: {
      id: (0, _fp.getOr)([], 'id.buckets', bucket).map(id => id.key),
      name: bucket.key,
      groupId: (0, _fp.getOr)([], 'groupId.buckets', bucket).map(groupId => groupId.key),
      groupName: (0, _fp.getOr)([], 'groupName.buckets', bucket).map(groupName => groupName.key),
      count: (0, _fp.get)('doc_count', bucket)
    }
  },
  cursor: {
    value: bucket.key,
    tiebreaker: null
  }
}));

exports.getUsersEdges = getUsersEdges;