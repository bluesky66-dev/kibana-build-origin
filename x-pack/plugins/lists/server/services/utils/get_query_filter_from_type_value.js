"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShouldQuery = exports.getTextQuery = exports.getTermsQuery = exports.getEmptyQuery = exports.getQueryFilterFromTypeValue = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given a type, value, and listId, this will return a valid query. If the type is
 * "text" it will return a "text" match, otherwise it returns a terms query. If an
 * array or array of arrays is passed, this will flatten, remove any "null" values,
 * and then the result.
 * @param type The type of list
 * @param value The unknown value
 * @param listId The list id
 */


const getQueryFilterFromTypeValue = ({
  type,
  value,
  listId
}) => {
  const valueFlattened = value.flat(Infinity).filter(singleValue => singleValue != null && !(0, _fp.isObject)(singleValue));

  if ((0, _fp.isEmpty)(valueFlattened)) {
    return getEmptyQuery({
      listId
    });
  } else if (type === 'text') {
    return getTextQuery({
      listId,
      type,
      value
    });
  } else {
    return getTermsQuery({
      listId,
      type,
      value
    });
  }
};
/**
 * Returns an empty named query that should not match anything
 * @param listId The list id to associate with the empty query
 */


exports.getQueryFilterFromTypeValue = getQueryFilterFromTypeValue;

const getEmptyQuery = ({
  listId
}) => [{
  term: {
    list_id: listId
  }
}, {
  bool: {
    minimum_should_match: 1,
    should: [{
      match_none: {
        _name: 'empty'
      }
    }]
  }
}];
/**
 * Returns a terms query against a large value based list. If it detects that an array or item has a "null"
 * value it will filter that value out. If it has arrays within arrays it will flatten those out as well.
 * @param value The value which can be unknown
 * @param type The list type type
 * @param listId The list id
 */


exports.getEmptyQuery = getEmptyQuery;

const getTermsQuery = ({
  value,
  type,
  listId
}) => {
  const should = value.reduce((accum, item, index) => {
    if (Array.isArray(item)) {
      const itemFlattened = item.flat(Infinity).filter(singleValue => singleValue != null && !(0, _fp.isObject)(singleValue));

      if (itemFlattened.length === 0) {
        return accum;
      } else {
        return [...accum, {
          terms: {
            _name: `${index}.0`,
            [type]: itemFlattened
          }
        }];
      }
    } else {
      if (item == null || (0, _fp.isObject)(item)) {
        return accum;
      } else {
        return [...accum, {
          term: {
            [type]: {
              _name: `${index}.0`,
              value: item
            }
          }
        }];
      }
    }
  }, []);
  return getShouldQuery({
    listId,
    should
  });
};
/**
 * Returns a text query against a large value based list. If it detects that an array or item has a "null"
 * value it will filter that value out. If it has arrays within arrays it will flatten those out as well.
 * @param value The value which can be unknown
 * @param type The list type type
 * @param listId The list id
 */


exports.getTermsQuery = getTermsQuery;

const getTextQuery = ({
  value,
  type,
  listId
}) => {
  const should = value.reduce((accum, item, index) => {
    if (Array.isArray(item)) {
      const itemFlattened = item.flat(Infinity).filter(singleValue => singleValue != null && !(0, _fp.isObject)(singleValue));

      if (itemFlattened.length === 0) {
        return accum;
      } else {
        return [...accum, ...itemFlattened.map((flatItem, secondIndex) => ({
          match: {
            [type]: {
              _name: `${index}.${secondIndex}`,
              operator: 'and',
              query: flatItem
            }
          }
        }))];
      }
    } else {
      if (item == null || (0, _fp.isObject)(item)) {
        return accum;
      } else {
        return [...accum, {
          match: {
            [type]: {
              _name: `${index}.0`,
              operator: 'and',
              query: item
            }
          }
        }];
      }
    }
  }, []);
  return getShouldQuery({
    listId,
    should
  });
};
/**
 * Given an unknown should this constructs a simple bool and terms with the should
 * clause/query.
 * @param listId The list id to query against
 * @param should The unknown should to construct the query against
 */


exports.getTextQuery = getTextQuery;

const getShouldQuery = ({
  listId,
  should
}) => {
  return [{
    term: {
      list_id: listId
    }
  }, {
    bool: {
      minimum_should_match: 1,
      should
    }
  }];
};

exports.getShouldQuery = getShouldQuery;