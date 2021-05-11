"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexVersionsByIndex = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Retrieves a breakdown of index versions for each
 * given signals index.
 *
 * @param esClient An {@link ElasticsearchClient}
 * @param index name(s) of the signals index(es)
 *
 * @returns a {@link IndexVersionsByIndex} object
 *
 * @throws if client returns an error
 */

const getIndexVersionsByIndex = async ({
  esClient,
  index
}) => {
  const {
    body: indexVersions
  } = await esClient.indices.getMapping({
    index
  });
  return index.reduce((agg, _index) => {
    var _indexVersions$_index, _indexVersions$_index2, _indexVersions$_index3;

    return { ...agg,
      [_index]: (_indexVersions$_index = indexVersions[_index]) === null || _indexVersions$_index === void 0 ? void 0 : (_indexVersions$_index2 = _indexVersions$_index.mappings) === null || _indexVersions$_index2 === void 0 ? void 0 : (_indexVersions$_index3 = _indexVersions$_index2._meta) === null || _indexVersions$_index3 === void 0 ? void 0 : _indexVersions$_index3.version
    };
  }, {});
};

exports.getIndexVersionsByIndex = getIndexVersionsByIndex;