"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractReferences = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const extractReferences = state => {
  let searchSourceFields = { ...state
  };
  const references = [];

  if (searchSourceFields.index) {
    const indexId = searchSourceFields.index.id || searchSourceFields.index;
    const refName = 'kibanaSavedObjectMeta.searchSourceJSON.index';
    references.push({
      name: refName,
      type: 'index-pattern',
      id: indexId
    });
    searchSourceFields = { ...searchSourceFields,
      indexRefName: refName,
      index: undefined
    };
  }

  if (searchSourceFields.filter) {
    searchSourceFields = { ...searchSourceFields,
      filter: searchSourceFields.filter.map((filterRow, i) => {
        if (!filterRow.meta || !filterRow.meta.index) {
          return filterRow;
        }

        const refName = `kibanaSavedObjectMeta.searchSourceJSON.filter[${i}].meta.index`;
        references.push({
          name: refName,
          type: 'index-pattern',
          id: filterRow.meta.index
        });
        return { ...filterRow,
          meta: { ...filterRow.meta,
            indexRefName: refName,
            index: undefined
          }
        };
      })
    };
  }

  return [searchSourceFields, references];
};

exports.extractReferences = extractReferences;