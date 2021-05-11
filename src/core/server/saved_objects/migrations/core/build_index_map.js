"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndexMap = createIndexMap;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * This file contains logic to convert savedObjectSchemas into a dictionary of indexes and documents
 */
function createIndexMap({
  kibanaIndexName,
  registry,
  indexMap
}) {
  const map = {};
  Object.keys(indexMap).forEach(type => {
    const typeDef = registry.getType(type);
    const script = typeDef === null || typeDef === void 0 ? void 0 : typeDef.convertToAliasScript; // Defaults to kibanaIndexName if indexPattern isn't defined

    const indexPattern = (typeDef === null || typeDef === void 0 ? void 0 : typeDef.indexPattern) || kibanaIndexName;

    if (!map.hasOwnProperty(indexPattern)) {
      map[indexPattern] = {
        typeMappings: {}
      };
    }

    map[indexPattern].typeMappings[type] = indexMap[type];

    if (script && map[indexPattern].script) {
      throw Error(`convertToAliasScript has been defined more than once for index pattern "${indexPattern}"`);
    } else if (script) {
      map[indexPattern].script = script;
    }
  });
  return map;
}