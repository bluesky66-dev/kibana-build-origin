"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHits = exports.formatAuthenticationData = exports.authenticationsFields = void 0;

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


const authenticationsFields = ['_id', 'failures', 'successes', 'user.name', 'lastSuccess.timestamp', 'lastSuccess.source.ip', 'lastSuccess.host.id', 'lastSuccess.host.name', 'lastFailure.timestamp', 'lastFailure.source.ip', 'lastFailure.host.id', 'lastFailure.host.name'];
exports.authenticationsFields = authenticationsFields;

const formatAuthenticationData = (fields = authenticationsFields, hit, fieldMap) => fields.reduce((flattenedFields, fieldName) => {
  if (hit.cursor) {
    flattenedFields.cursor.value = hit.cursor;
  }

  flattenedFields.node = { ...flattenedFields.node,
    ...{
      _id: hit._id,
      user: {
        name: [hit.user]
      },
      failures: hit.failures,
      successes: hit.successes
    }
  };
  const mergedResult = (0, _build_query.mergeFieldsWithHit)(fieldName, flattenedFields, fieldMap, hit);
  const fieldPath = `node.${fieldName}`;
  const fieldValue = (0, _fp.get)(fieldPath, mergedResult);

  if (!(0, _fp.isEmpty)(fieldValue)) {
    return (0, _fp2.set)(fieldPath, (0, _to_array.toObjectArrayOfStrings)(fieldValue).map(({
      str
    }) => str), mergedResult);
  } else {
    return mergedResult;
  }
}, {
  node: {
    failures: 0,
    successes: 0,
    _id: '',
    user: {
      name: ['']
    }
  },
  cursor: {
    value: '',
    tiebreaker: null
  }
});

exports.formatAuthenticationData = formatAuthenticationData;

const getHits = response => (0, _fp.getOr)([], 'aggregations.group_by_users.buckets', response.rawResponse).map(bucket => ({
  _id: (0, _fp.getOr)(`${bucket.key}+${bucket.doc_count}`, 'failures.lastFailure.hits.hits[0].id', bucket),
  _source: {
    lastSuccess: (0, _fp.getOr)(null, 'successes.lastSuccess.hits.hits[0]._source', bucket),
    lastFailure: (0, _fp.getOr)(null, 'failures.lastFailure.hits.hits[0]._source', bucket)
  },
  user: bucket.key,
  failures: bucket.failures.doc_count,
  successes: bucket.successes.doc_count
}));

exports.getHits = getHits;