"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInnerAndClauses = exports.buildNestedClause = exports.getBaseNestedClause = exports.buildExistsClause = exports.buildMatchAnyClause = exports.getBaseMatchAnyClause = exports.buildMatchClause = exports.buildExclusionClause = exports.buildExceptionFilter = exports.createOrClauses = exports.buildExceptionItemFilter = exports.chunkExceptions = void 0;

var _fp = require("lodash/fp");

var _common = require("../../../lists/common");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const chunkExceptions = (exceptions, chunkSize) => {
  return (0, _fp.chunk)(chunkSize, exceptions);
};

exports.chunkExceptions = chunkExceptions;

const buildExceptionItemFilter = exceptionItem => {
  const {
    entries
  } = exceptionItem;

  if (entries.length === 1) {
    return createInnerAndClauses(entries[0]);
  } else {
    return {
      bool: {
        filter: entries.map(entry => createInnerAndClauses(entry))
      }
    };
  }
};

exports.buildExceptionItemFilter = buildExceptionItemFilter;

const createOrClauses = exceptionItems => {
  return exceptionItems.map(exceptionItem => buildExceptionItemFilter(exceptionItem));
};

exports.createOrClauses = createOrClauses;

const buildExceptionFilter = ({
  lists,
  excludeExceptions,
  chunkSize
}) => {
  // Remove exception items with large value lists. These are evaluated
  // elsewhere for the moment being.
  const exceptionsWithoutLargeValueLists = lists.filter(item => !(0, _utils.hasLargeValueList)(item.entries));
  const exceptionFilter = {
    meta: {
      alias: null,
      negate: excludeExceptions,
      disabled: false
    },
    query: {
      bool: {
        should: undefined
      }
    }
  };

  if (exceptionsWithoutLargeValueLists.length === 0) {
    return undefined;
  } else if (exceptionsWithoutLargeValueLists.length <= chunkSize) {
    const clause = createOrClauses(exceptionsWithoutLargeValueLists);
    exceptionFilter.query.bool.should = clause;
    return exceptionFilter;
  } else {
    const chunks = chunkExceptions(exceptionsWithoutLargeValueLists, chunkSize);
    const filters = chunks.map(exceptionsChunk => {
      const orClauses = createOrClauses(exceptionsChunk);
      return {
        meta: {
          alias: null,
          negate: false,
          disabled: false
        },
        query: {
          bool: {
            should: orClauses
          }
        }
      };
    });
    const clauses = filters.map(({
      query
    }) => query);
    return {
      meta: {
        alias: null,
        negate: excludeExceptions,
        disabled: false
      },
      query: {
        bool: {
          should: clauses
        }
      }
    };
  }
};

exports.buildExceptionFilter = buildExceptionFilter;

const buildExclusionClause = booleanFilter => {
  return {
    bool: {
      must_not: booleanFilter
    }
  };
};

exports.buildExclusionClause = buildExclusionClause;

const buildMatchClause = entry => {
  const {
    field,
    operator,
    value
  } = entry;
  const matchClause = {
    bool: {
      should: [{
        match_phrase: {
          [field]: value
        }
      }],
      minimum_should_match: 1
    }
  };

  if (operator === 'excluded') {
    return buildExclusionClause(matchClause);
  } else {
    return matchClause;
  }
};

exports.buildMatchClause = buildMatchClause;

const getBaseMatchAnyClause = entry => {
  const {
    field,
    value
  } = entry;

  if (value.length === 1) {
    return {
      bool: {
        should: [{
          match_phrase: {
            [field]: value[0]
          }
        }],
        minimum_should_match: 1
      }
    };
  }

  return {
    bool: {
      should: value.map(val => {
        return {
          bool: {
            should: [{
              match_phrase: {
                [field]: val
              }
            }],
            minimum_should_match: 1
          }
        };
      }),
      minimum_should_match: 1
    }
  };
};

exports.getBaseMatchAnyClause = getBaseMatchAnyClause;

const buildMatchAnyClause = entry => {
  const {
    operator
  } = entry;
  const matchAnyClause = getBaseMatchAnyClause(entry);

  if (operator === 'excluded') {
    return buildExclusionClause(matchAnyClause);
  } else {
    return matchAnyClause;
  }
};

exports.buildMatchAnyClause = buildMatchAnyClause;

const buildExistsClause = entry => {
  const {
    field,
    operator
  } = entry;
  const existsClause = {
    bool: {
      should: [{
        exists: {
          field
        }
      }],
      minimum_should_match: 1
    }
  };

  if (operator === 'excluded') {
    return buildExclusionClause(existsClause);
  } else {
    return existsClause;
  }
};

exports.buildExistsClause = buildExistsClause;

const isBooleanFilter = clause => {
  const keys = Object.keys(clause);
  return keys.includes('bool') != null;
};

const getBaseNestedClause = (entries, parentField) => {
  if (entries.length === 1) {
    const [singleNestedEntry] = entries;
    const innerClause = createInnerAndClauses(singleNestedEntry, parentField);
    return isBooleanFilter(innerClause) ? innerClause : {
      bool: {}
    };
  }

  return {
    bool: {
      filter: entries.map(nestedEntry => createInnerAndClauses(nestedEntry, parentField))
    }
  };
};

exports.getBaseNestedClause = getBaseNestedClause;

const buildNestedClause = entry => {
  const {
    field,
    entries
  } = entry;
  const baseNestedClause = getBaseNestedClause(entries, field);
  return {
    nested: {
      path: field,
      query: baseNestedClause,
      score_mode: 'none'
    }
  };
};

exports.buildNestedClause = buildNestedClause;

const createInnerAndClauses = (entry, parent) => {
  if (_common.entriesExists.is(entry)) {
    const field = parent != null ? `${parent}.${entry.field}` : entry.field;
    return buildExistsClause({ ...entry,
      field
    });
  } else if (_common.entriesMatch.is(entry)) {
    const field = parent != null ? `${parent}.${entry.field}` : entry.field;
    return buildMatchClause({ ...entry,
      field
    });
  } else if (_common.entriesMatchAny.is(entry)) {
    const field = parent != null ? `${parent}.${entry.field}` : entry.field;
    return buildMatchAnyClause({ ...entry,
      field
    });
  } else if (_common.entriesNested.is(entry)) {
    return buildNestedClause(entry);
  } else {
    throw new TypeError(`Unexpected exception entry: ${entry}`);
  }
};

exports.createInnerAndClauses = createInnerAndClauses;