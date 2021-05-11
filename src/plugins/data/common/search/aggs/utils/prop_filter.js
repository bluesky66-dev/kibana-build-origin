"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propFilter = propFilter;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Filters out a list by a given filter. This is currently used to implement:
 *   - fieldType filters a list of fields by their type property
 *   - aggFilter filters a list of aggs by their name property
 *
 * @returns the filter function which can be registered with angular
 */
function propFilter(prop) {
  /**
   * List filtering function which accepts an array or list of values that a property
   * must contain
   *
   * @param  {array} list - array of items to filter
   * @param  {function|array|string} filters - the values to match against the list
   *   - if a function, it is expected to take the field property as argument and returns true to keep it.
   *   - Can be also an array, a single value as a string, or a comma-separated list of items
   * @return {array} - the filtered list
   */
  return function filterByName(list, filters = []) {
    if ((0, _lodash.isFunction)(filters)) {
      return list.filter(item => filters(item[prop]));
    }

    if (!Array.isArray(filters)) {
      filters = filters.split(',');
    }

    if (filters.length === 0) {
      return list;
    }

    if (filters.includes('*')) {
      return list;
    }

    const options = filters.reduce((acc, filter) => {
      let type = 'include';
      let value = filter;

      if (filter.charAt(0) === '!') {
        type = 'exclude';
        value = filter.substr(1);
      }

      if (!acc[type]) {
        acc[type] = [];
      }

      acc[type].push(value);
      return acc;
    }, {});
    return list.filter(item => {
      const value = item[prop];
      const excluded = options.exclude && options.exclude.includes(value);

      if (excluded) {
        return false;
      }

      const included = !options.include || options.include.includes(value);

      if (included) {
        return true;
      }

      return false;
    });
  };
}