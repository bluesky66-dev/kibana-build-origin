"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexAliases = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Retrieves all index aliases for a given alias name
 *
 * @param esClient An {@link ElasticsearchClient}
 * @param alias alias name used to filter results
 *
 * @returns an array of {@link IndexAlias} objects
 */

const getIndexAliases = async ({
  esClient,
  alias
}) => {
  const response = await esClient.indices.getAlias({
    name: alias
  });
  return Object.keys(response.body).map(index => {
    var _response$body$index$;

    return {
      alias,
      index,
      isWriteIndex: ((_response$body$index$ = response.body[index].aliases[alias]) === null || _response$body$index$ === void 0 ? void 0 : _response$body$index$.is_write_index) === true
    };
  });
};

exports.getIndexAliases = getIndexAliases;