"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildLastFirstSeenHostQuery = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildLastFirstSeenHostQuery = ({
  hostName,
  defaultIndex,
  docValueFields
}) => {
  const filter = [{
    term: {
      'host.name': hostName
    }
  }];
  const dslQuery = {
    allowNoIndices: true,
    index: defaultIndex,
    ignoreUnavailable: true,
    track_total_hits: false,
    body: { ...(!(0, _fp.isEmpty)(docValueFields) ? {
        docvalue_fields: docValueFields
      } : {}),
      aggregations: {
        firstSeen: {
          min: {
            field: '@timestamp'
          }
        },
        lastSeen: {
          max: {
            field: '@timestamp'
          }
        }
      },
      query: {
        bool: {
          filter
        }
      },
      size: 0
    }
  };
  return dslQuery;
};

exports.buildLastFirstSeenHostQuery = buildLastFirstSeenHostQuery;