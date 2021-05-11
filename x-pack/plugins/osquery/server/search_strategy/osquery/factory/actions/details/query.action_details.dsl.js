"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildActionDetailsQuery = void 0;

var _build_query = require("../../../../../../common/utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildActionDetailsQuery = ({
  actionId,
  docValueFields,
  filterQuery
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    match_phrase: {
      action_id: actionId
    }
  }];
  const dslQuery = {
    allowNoIndices: true,
    index: '.fleet-actions',
    ignoreUnavailable: true,
    body: {
      query: {
        bool: {
          filter
        }
      },
      size: 1,
      fields: ['*']
    }
  };
  return dslQuery;
};

exports.buildActionDetailsQuery = buildActionDetailsQuery;