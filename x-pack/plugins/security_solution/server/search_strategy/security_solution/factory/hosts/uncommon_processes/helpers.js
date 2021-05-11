"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatUncommonProcessesData = exports.getHosts = exports.getHits = exports.uncommonProcessesFields = void 0;

var _fp = require("lodash/fp");

var _fp2 = require("@elastic/safer-lodash-set/fp");

var _build_query = require("../../../../../utils/build_query");

var _to_array = require("../../../../helpers/to_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const uncommonProcessesFields = ['_id', 'instances', 'process.args', 'process.name', 'user.id', 'user.name', 'hosts.name'];
exports.uncommonProcessesFields = uncommonProcessesFields;

const getHits = buckets => buckets.map(bucket => ({
  _id: bucket.process.hits.hits[0]._id,
  _index: bucket.process.hits.hits[0]._index,
  _type: bucket.process.hits.hits[0]._type,
  _score: bucket.process.hits.hits[0]._score,
  _source: bucket.process.hits.hits[0]._source,
  sort: bucket.process.hits.hits[0].sort,
  cursor: bucket.process.hits.hits[0].cursor,
  total: bucket.process.hits.total,
  host: getHosts(bucket.hosts.buckets)
}));

exports.getHits = getHits;

const getHosts = buckets => buckets.map(bucket => {
  const source = (0, _fp.get)('host.hits.hits[0]._source', bucket);
  return {
    id: [bucket.key],
    name: (0, _fp.get)('host.name', source)
  };
});

exports.getHosts = getHosts;

const formatUncommonProcessesData = (fields, hit, fieldMap) => fields.reduce((flattenedFields, fieldName) => {
  const instancesCount = typeof hit.total === 'number' ? hit.total : hit.total.value;
  flattenedFields.node._id = hit._id;
  flattenedFields.node.instances = instancesCount;
  flattenedFields.node.hosts = hit.host;

  if (hit.cursor) {
    flattenedFields.cursor.value = hit.cursor;
  }

  const mergedResult = (0, _build_query.mergeFieldsWithHit)(fieldName, flattenedFields, fieldMap, hit);
  let fieldPath = `node.${fieldName}`;
  let fieldValue = (0, _fp.get)(fieldPath, mergedResult);

  if (fieldPath === 'node.hosts.name') {
    fieldPath = `node.hosts.0.name`;
    fieldValue = (0, _fp.get)(fieldPath, mergedResult);
  }

  return (0, _fp2.set)(fieldPath, (0, _to_array.toObjectArrayOfStrings)(fieldValue).map(({
    str
  }) => str), mergedResult);
}, {
  node: {
    _id: '',
    instances: 0,
    process: {},
    hosts: []
  },
  cursor: {
    value: '',
    tiebreaker: null
  }
});

exports.formatUncommonProcessesData = formatUncommonProcessesData;