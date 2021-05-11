"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexCount = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Retrieves the count of documents in a given index
 *
 * @param esClient An {@link ElasticsearchClient}
 * @param index index whose documents will be counted
 *
 * @returns the document count
 */

const getIndexCount = async ({
  esClient,
  index
}) => {
  const response = await esClient.count({
    index
  });
  return response.body.count;
};

exports.getIndexCount = getIndexCount;