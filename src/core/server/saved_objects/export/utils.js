"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPreservedOrderComparator = exports.byIdAscComparator = exports.getObjKey = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getObjKey = obj => `${obj.type}|${obj.id}`;

exports.getObjKey = getObjKey;

const byIdAscComparator = (a, b) => a.id > b.id ? 1 : -1;
/**
 * Create a comparator that will sort objects depending on their position in the provided array.
 * Objects not present in the array will be appended at the end of the list, and sorted by id asc.
 *
 * @example
 * ```ts
 * const comparator = getPreservedOrderComparator([objA, objB, objC]);
 * const list = [newB, objB, objC, newA, objA]; // with obj.title matching their variable name
 * list.sort()
 * // list = [objA, objB, objC, newA, newB]
 * ```
 */


exports.byIdAscComparator = byIdAscComparator;

const getPreservedOrderComparator = objects => {
  const orderedKeys = objects.map(getObjKey);
  return (a, b) => {
    const indexA = orderedKeys.indexOf(getObjKey(a));
    const indexB = orderedKeys.indexOf(getObjKey(b));

    if (indexA > -1 && indexB > -1) {
      return indexA - indexB > 0 ? 1 : -1;
    }

    if (indexA > -1) {
      return -1;
    }

    if (indexB > -1) {
      return 1;
    }

    return byIdAscComparator(a, b);
  };
};

exports.getPreservedOrderComparator = getPreservedOrderComparator;