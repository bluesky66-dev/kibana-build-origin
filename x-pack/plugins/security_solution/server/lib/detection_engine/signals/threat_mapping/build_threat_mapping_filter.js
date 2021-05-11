"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitShouldClauses = exports.buildEntriesMappingFilter = exports.createAndOrClauses = exports.createInnerAndClauses = exports.filterThreatMapping = exports.buildThreatMappingFilter = exports.MAX_CHUNK_SIZE = void 0;

var _get = _interopRequireDefault(require("lodash/fp/get"));

var _utils = require("./utils");

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


const MAX_CHUNK_SIZE = 1024;
exports.MAX_CHUNK_SIZE = MAX_CHUNK_SIZE;

const buildThreatMappingFilter = ({
  threatMapping,
  threatList,
  chunkSize
}) => {
  const computedChunkSize = chunkSize !== null && chunkSize !== void 0 ? chunkSize : MAX_CHUNK_SIZE;

  if (computedChunkSize > 1024) {
    throw new TypeError('chunk sizes cannot exceed 1024 in size');
  }

  const query = buildEntriesMappingFilter({
    threatMapping,
    threatList,
    chunkSize: computedChunkSize
  });
  const filterChunk = {
    meta: {
      alias: null,
      negate: false,
      disabled: false
    },
    query
  };
  return filterChunk;
};
/**
 * Filters out any combined "AND" entries which do not include all the threat list items.
 */


exports.buildThreatMappingFilter = buildThreatMappingFilter;

const filterThreatMapping = ({
  threatMapping,
  threatListItem
}) => threatMapping.map(threatMap => {
  const atLeastOneItemMissingInThreatList = threatMap.entries.some(entry => {
    const itemValue = (0, _get.default)(entry.value, threatListItem.fields);
    return itemValue == null || itemValue.length !== 1;
  });

  if (atLeastOneItemMissingInThreatList) {
    return { ...threatMap,
      entries: []
    };
  } else {
    return { ...threatMap,
      entries: threatMap.entries
    };
  }
}).filter(threatMap => threatMap.entries.length !== 0);

exports.filterThreatMapping = filterThreatMapping;

const createInnerAndClauses = ({
  threatMappingEntries,
  threatListItem
}) => {
  return threatMappingEntries.reduce((accum, threatMappingEntry) => {
    const value = (0, _get.default)(threatMappingEntry.value, threatListItem.fields);

    if (value != null && value.length === 1) {
      // These values could be potentially 10k+ large so mutating the array intentionally
      accum.push({
        bool: {
          should: [{
            match: {
              [threatMappingEntry.field]: {
                query: value[0],
                _name: (0, _utils.encodeThreatMatchNamedQuery)({
                  id: threatListItem._id,
                  index: threatListItem._index,
                  field: threatMappingEntry.field,
                  value: threatMappingEntry.value
                })
              }
            }
          }],
          minimum_should_match: 1
        }
      });
    }

    return accum;
  }, []);
};

exports.createInnerAndClauses = createInnerAndClauses;

const createAndOrClauses = ({
  threatMapping,
  threatListItem
}) => {
  const should = threatMapping.reduce((accum, threatMap) => {
    const innerAndClauses = createInnerAndClauses({
      threatMappingEntries: threatMap.entries,
      threatListItem
    });

    if (innerAndClauses.length !== 0) {
      // These values could be potentially 10k+ large so mutating the array intentionally
      accum.push({
        bool: {
          filter: innerAndClauses
        }
      });
    }

    return accum;
  }, []);
  return {
    bool: {
      should,
      minimum_should_match: 1
    }
  };
};

exports.createAndOrClauses = createAndOrClauses;

const buildEntriesMappingFilter = ({
  threatMapping,
  threatList,
  chunkSize
}) => {
  const combinedShould = threatList.reduce((accum, threatListSearchItem) => {
    const filteredEntries = filterThreatMapping({
      threatMapping,
      threatListItem: threatListSearchItem
    });
    const queryWithAndOrClause = createAndOrClauses({
      threatMapping: filteredEntries,
      threatListItem: threatListSearchItem
    });

    if (queryWithAndOrClause.bool.should.length !== 0) {
      // These values can be 10k+ large, so using a push here for performance
      accum.push(queryWithAndOrClause);
    }

    return accum;
  }, []);
  const should = splitShouldClauses({
    should: combinedShould,
    chunkSize
  });
  return {
    bool: {
      should,
      minimum_should_match: 1
    }
  };
};

exports.buildEntriesMappingFilter = buildEntriesMappingFilter;

const splitShouldClauses = ({
  should,
  chunkSize
}) => {
  if (should.length <= chunkSize) {
    return should;
  } else {
    return should.reduce((accum, item, index) => {
      const chunkIndex = Math.floor(index / chunkSize);
      const currentChunk = accum[chunkIndex];

      if (!currentChunk) {
        // create a new element in the array at the correct spot
        accum[chunkIndex] = {
          bool: {
            should: [],
            minimum_should_match: 1
          }
        };
      } // Add to the existing array element. Using mutatious push here since these arrays can get very large such as 10k+ and this is going to be a hot code spot.


      accum[chunkIndex].bool.should.push(item);
      return accum;
    }, []);
  }
};

exports.splitShouldClauses = splitShouldClauses;