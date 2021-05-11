"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexStatus = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getIndexStatus = async ({
  uptimeEsClient
}) => {
  const {
    body: {
      _shards: {
        total
      },
      count
    }
  } = await uptimeEsClient.count({
    terminateAfter: 1
  });
  return {
    indexExists: total > 0,
    docCount: count
  };
};

exports.getIndexStatus = getIndexStatus;