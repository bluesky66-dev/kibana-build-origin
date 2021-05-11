"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildAgentsQuery = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../common/utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildAgentsQuery = ({
  docValueFields,
  filterQuery,
  pagination: {
    querySize
  },
  sort
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery)];
  const dslQuery = {
    allowNoIndices: true,
    index: '.fleet-agents',
    ignoreUnavailable: true,
    body: { ...(!(0, _fp.isEmpty)(docValueFields) ? {
        docvalue_fields: docValueFields
      } : {}),
      query: {
        bool: {
          filter
        }
      },
      track_total_hits: true
    }
  };
  return dslQuery;
};

exports.buildAgentsQuery = buildAgentsQuery;