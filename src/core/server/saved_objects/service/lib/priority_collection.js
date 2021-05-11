"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PriorityCollection = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class PriorityCollection {
  constructor() {
    _defineProperty(this, "array", []);
  }

  add(priority, value) {
    const foundIndex = this.array.findIndex(current => {
      if (priority === current.priority) {
        throw new Error('Already have entry with this priority');
      }

      return priority < current.priority;
    });
    const spliceIndex = foundIndex === -1 ? this.array.length : foundIndex;
    this.array.splice(spliceIndex, 0, {
      priority,
      value
    });
  }

  has(predicate) {
    return this.array.some(entry => predicate(entry.value));
  }

  toPrioritizedArray() {
    return this.array.map(entry => entry.value);
  }

}

exports.PriorityCollection = PriorityCollection;