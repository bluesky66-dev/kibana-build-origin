"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchMigrations = void 0;

var _lodash = require("lodash");

var _common = require("../../../data/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * This migration script is related to:
 *   @link https://github.com/elastic/kibana/pull/62194
 *   @link https://github.com/elastic/kibana/pull/14644
 * This is only a problem when you import an object from 5.x into 6.x but to be sure that all saved objects migrated we should execute it twice in 6.7.2 and 7.9.3
 */
const migrateMatchAllQuery = doc => {
  const searchSourceJSON = (0, _lodash.get)(doc, 'attributes.kibanaSavedObjectMeta.searchSourceJSON');

  if (searchSourceJSON) {
    var _searchSource$query;

    let searchSource;

    try {
      searchSource = JSON.parse(searchSourceJSON);
    } catch (e) {
      // Let it go, the data is invalid and we'll leave it as is
      return doc;
    }

    if ((_searchSource$query = searchSource.query) !== null && _searchSource$query !== void 0 && _searchSource$query.match_all) {
      return { ...doc,
        attributes: { ...doc.attributes,
          kibanaSavedObjectMeta: {
            searchSourceJSON: JSON.stringify({ ...searchSource,
              query: {
                query: '',
                language: _common.DEFAULT_QUERY_LANGUAGE
              }
            })
          }
        }
      };
    }
  }

  return doc;
};

const migrateIndexPattern = doc => {
  const searchSourceJSON = (0, _lodash.get)(doc, 'attributes.kibanaSavedObjectMeta.searchSourceJSON');

  if (typeof searchSourceJSON !== 'string') {
    return doc;
  }

  let searchSource;

  try {
    searchSource = JSON.parse(searchSourceJSON);
  } catch (e) {
    // Let it go, the data is invalid and we'll leave it as is
    return doc;
  }

  if (searchSource.index && Array.isArray(doc.references)) {
    searchSource.indexRefName = 'kibanaSavedObjectMeta.searchSourceJSON.index';
    doc.references.push({
      name: searchSource.indexRefName,
      type: 'index-pattern',
      id: searchSource.index
    });
    delete searchSource.index;
  }

  if (searchSource.filter) {
    searchSource.filter.forEach((filterRow, i) => {
      if (!filterRow.meta || !filterRow.meta.index || !Array.isArray(doc.references)) {
        return;
      }

      filterRow.meta.indexRefName = `kibanaSavedObjectMeta.searchSourceJSON.filter[${i}].meta.index`;
      doc.references.push({
        name: filterRow.meta.indexRefName,
        type: 'index-pattern',
        id: filterRow.meta.index
      });
      delete filterRow.meta.index;
    });
  }

  doc.attributes.kibanaSavedObjectMeta.searchSourceJSON = JSON.stringify(searchSource);
  return doc;
};

const setNewReferences = (doc, context) => {
  doc.references = doc.references || []; // Migrate index pattern

  return migrateIndexPattern(doc, context);
};

const migrateSearchSortToNestedArray = doc => {
  const sort = (0, _lodash.get)(doc, 'attributes.sort');
  if (!sort) return doc; // Don't do anything if we already have a two dimensional array

  if (Array.isArray(sort) && sort.length > 0 && Array.isArray(sort[0])) {
    return doc;
  }

  return { ...doc,
    attributes: { ...doc.attributes,
      sort: [doc.attributes.sort]
    }
  };
};

const searchMigrations = {
  '6.7.2': (0, _lodash.flow)(migrateMatchAllQuery),
  '7.0.0': (0, _lodash.flow)(setNewReferences),
  '7.4.0': (0, _lodash.flow)(migrateSearchSortToNestedArray),
  '7.9.3': (0, _lodash.flow)(migrateMatchAllQuery)
};
exports.searchMigrations = searchMigrations;