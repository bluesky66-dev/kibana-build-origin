"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientMock = ClientMock;

var _lodash = require("lodash");

var _elasticsearch = require("elasticsearch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function ClientMock() {
  this.callAsInternalUser = (endpoint, params = {}, ...rest) => {
    if (endpoint === 'indices.create') {
      return Promise.resolve({
        acknowledged: true
      });
    }

    if (endpoint === 'indices.exists') {
      return Promise.resolve(false);
    }

    if (endpoint === 'index') {
      const shardCount = 2;
      return Promise.resolve({
        _index: params.index || 'index',
        _id: params.id || (0, _lodash.uniqueId)('testDoc'),
        _seq_no: 1,
        _primary_term: 1,
        _shards: {
          total: shardCount,
          successful: shardCount,
          failed: 0
        },
        created: true
      });
    }

    if (endpoint === 'get') {
      if (params === _elasticsearch.errors.NotFound) return _elasticsearch.errors.NotFound;
      const _source = {
        jobtype: 'jobtype',
        created_by: false,
        payload: {
          id: 'sample-job-1',
          now: 'Mon Apr 25 2016 14:13:04 GMT-0700 (MST)'
        },
        priority: 10,
        timeout: 10000,
        created_at: '2016-04-25T21:13:04.738Z',
        attempts: 0,
        max_attempts: 3,
        status: 'pending',
        ...(rest[0] || {})
      };
      return Promise.resolve({
        _index: params.index || 'index',
        _id: params.id || 'AVRPRLnlp7Ur1SZXfT-T',
        _seq_no: params._seq_no || 1,
        _primary_term: params._primary_term || 1,
        found: true,
        _source: _source
      });
    }

    if (endpoint === 'search') {
      const [count = 5, source = {}] = rest;
      const hits = (0, _lodash.times)(count, () => {
        return {
          _index: params.index || 'index',
          _id: (0, _lodash.uniqueId)('documentId'),
          _seq_no: (0, _lodash.random)(1, 5),
          _primar_term: (0, _lodash.random)(1, 5),
          _score: null,
          _source: {
            created_at: new Date().toString(),
            number: (0, _lodash.random)(0, count, true),
            ...source
          }
        };
      });
      return Promise.resolve({
        took: (0, _lodash.random)(0, 10),
        timed_out: false,
        _shards: {
          total: 5,
          successful: 5,
          failed: 0
        },
        hits: {
          total: count,
          max_score: null,
          hits: hits
        }
      });
    }

    if (endpoint === 'update') {
      const shardCount = 2;
      return Promise.resolve({
        _index: params.index || 'index',
        _id: params.id || (0, _lodash.uniqueId)('testDoc'),
        _seq_no: params.if_seq_no + 1 || 2,
        _primary_term: params.if_primary_term + 1 || 2,
        _shards: {
          total: shardCount,
          successful: shardCount,
          failed: 0
        },
        created: true
      });
    }

    return Promise.resolve();
  };

  this.transport = {};
}