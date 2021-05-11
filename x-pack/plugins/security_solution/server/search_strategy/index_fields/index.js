"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatIndexFields = exports.formatSecondFields = exports.formatFirstFields = exports.createFieldItem = exports.dedupeIndexName = exports.securitySolutionIndexFieldsProvider = void 0;

var _rxjs = require("rxjs");

var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));

var _server = require("../../../../../../src/plugins/data/server");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const securitySolutionIndexFieldsProvider = () => {
  // require the fields once we actually need them, rather than ahead of time, and pass
  // them to createFieldItem to reduce the amount of work done as much as possible
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const beatFields = require('../../utils/beat_schema/fields').fieldsBeat;

  return {
    search: (request, options, {
      esClient
    }) => (0, _rxjs.from)(new Promise(async resolve => {
      const indexPatternsFetcher = new _server.IndexPatternsFetcher(esClient.asCurrentUser);
      const dedupeIndices = dedupeIndexName(request.indices);
      const responsesIndexFields = await Promise.all(dedupeIndices.map(index => indexPatternsFetcher.getFieldsForWildcard({
        pattern: index
      })).map(p => p.catch(e => false)));
      let indexFields = [];

      if (!request.onlyCheckIfIndicesExist) {
        indexFields = await formatIndexFields(beatFields, responsesIndexFields.filter(rif => rif !== false), dedupeIndices);
      }

      return resolve({
        indexFields,
        indicesExist: dedupeIndices.filter((index, i) => responsesIndexFields[i] !== false),
        rawResponse: {
          timed_out: false,
          took: -1,
          _shards: {
            total: -1,
            successful: -1,
            failed: -1,
            skipped: -1
          },
          hits: {
            total: -1,
            max_score: -1,
            hits: [{
              _index: '',
              _type: '',
              _id: '',
              _score: -1,
              _source: null
            }]
          }
        }
      });
    }))
  };
};

exports.securitySolutionIndexFieldsProvider = securitySolutionIndexFieldsProvider;

const dedupeIndexName = indices => indices.reduce((acc, index) => {
  if (index.trim() !== '' && index.trim() !== '_all' && !acc.includes(index.trim())) {
    return [...acc, index];
  }

  return acc;
}, []);

exports.dedupeIndexName = dedupeIndexName;
const missingFields = [{
  name: '_id',
  type: 'string',
  searchable: true,
  aggregatable: false,
  readFromDocValues: false,
  esTypes: []
}, {
  name: '_index',
  type: 'string',
  searchable: true,
  aggregatable: true,
  readFromDocValues: false,
  esTypes: []
}];
/**
 * Creates a single field item.
 *
 * This is a mutatious HOT CODE PATH function that will have array sizes up to 4.7 megs
 * in size at a time calling this function repeatedly. This function should be as optimized as possible
 * and should avoid any and all creation of new arrays, iterating over the arrays or performing
 * any n^2 operations.
 * @param indexesAlias The index alias
 * @param index The index its self
 * @param indexesAliasIdx The index within the alias
 */

const createFieldItem = (beatFields, indexesAlias, index, indexesAliasIdx) => {
  var _beatFields$indexName;

  const alias = indexesAlias[indexesAliasIdx];
  const splitIndexName = index.name.split('.');
  const indexName = splitIndexName[splitIndexName.length - 1] === 'text' ? splitIndexName.slice(0, splitIndexName.length - 1).join('.') : index.name;
  const beatIndex = (_beatFields$indexName = beatFields[indexName]) !== null && _beatFields$indexName !== void 0 ? _beatFields$indexName : {};

  if ((0, _isEmpty.default)(beatIndex.category)) {
    beatIndex.category = splitIndexName[0];
  }

  return { ...beatIndex,
    ...index,
    indexes: [alias]
  };
};
/**
 * This is a mutatious HOT CODE PATH function that will have array sizes up to 4.7 megs
 * in size at a time when being called. This function should be as optimized as possible
 * and should avoid any and all creation of new arrays, iterating over the arrays or performing
 * any n^2 operations. The `.push`, and `forEach` operations are expected within this function
 * to speed up performance.
 *
 * This intentionally waits for the next tick on the event loop to process as the large 4.7 megs
 * has already consumed a lot of the event loop processing up to this function and we want to give
 * I/O opportunity to occur by scheduling this on the next loop.
 * @param responsesIndexFields The response index fields to loop over
 * @param indexesAlias The index aliases such as filebeat-*
 */


exports.createFieldItem = createFieldItem;

const formatFirstFields = async (beatFields, responsesIndexFields, indexesAlias) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(responsesIndexFields.reduce((accumulator, indexFields, indexesAliasIdx) => {
        missingFields.forEach(index => {
          const item = createFieldItem(beatFields, indexesAlias, index, indexesAliasIdx);
          accumulator.push(item);
        });
        indexFields.forEach(index => {
          const item = createFieldItem(beatFields, indexesAlias, index, indexesAliasIdx);
          accumulator.push(item);
        });
        return accumulator;
      }, []));
    });
  });
};
/**
 * This is a mutatious HOT CODE PATH function that will have array sizes up to 4.7 megs
 * in size at a time when being called. This function should be as optimized as possible
 * and should avoid any and all creation of new arrays, iterating over the arrays or performing
 * any n^2 operations. The `.push`, and `forEach` operations are expected within this function
 * to speed up performance. The "indexFieldNameHash" side effect hash avoids additional expensive n^2
 * look ups.
 *
 * This intentionally waits for the next tick on the event loop to process as the large 4.7 megs
 * has already consumed a lot of the event loop processing up to this function and we want to give
 * I/O opportunity to occur by scheduling this on the next loop.
 * @param fields The index fields to create the secondary fields for
 */


exports.formatFirstFields = formatFirstFields;

const formatSecondFields = async fields => {
  return new Promise(resolve => {
    setTimeout(() => {
      const indexFieldNameHash = {};
      const reduced = fields.reduce((accumulator, indexfield) => {
        const alreadyExistingIndexField = indexFieldNameHash[indexfield.name];

        if (alreadyExistingIndexField != null) {
          const existingIndexField = accumulator[alreadyExistingIndexField];

          if ((0, _isEmpty.default)(accumulator[alreadyExistingIndexField].description)) {
            accumulator[alreadyExistingIndexField].description = indexfield.description;
          }

          accumulator[alreadyExistingIndexField].indexes = Array.from(new Set([...existingIndexField.indexes, ...indexfield.indexes]));
          return accumulator;
        }

        accumulator.push(indexfield);
        indexFieldNameHash[indexfield.name] = accumulator.length - 1;
        return accumulator;
      }, []);
      resolve(reduced);
    });
  });
};
/**
 * Formats the index fields into a format the UI wants.
 *
 * NOTE: This will have array sizes up to 4.7 megs in size at a time when being called.
 * This function should be as optimized as possible and should avoid any and all creation
 * of new arrays, iterating over the arrays or performing any n^2 operations.
 * @param responsesIndexFields  The response index fields to format
 * @param indexesAlias The index alias
 */


exports.formatSecondFields = formatSecondFields;

const formatIndexFields = async (beatFields, responsesIndexFields, indexesAlias) => {
  const fields = await formatFirstFields(beatFields, responsesIndexFields, indexesAlias);
  const secondFields = await formatSecondFields(fields);
  return secondFields;
};

exports.formatIndexFields = formatIndexFields;