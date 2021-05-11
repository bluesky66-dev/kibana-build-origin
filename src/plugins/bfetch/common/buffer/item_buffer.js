"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ItemBuffer = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * A simple buffer that collects items. Can be cleared or flushed; and can
 * automatically flush when specified number of items is reached.
 */
class ItemBuffer {
  constructor(params) {
    this.params = params;

    _defineProperty(this, "list", []);
  }
  /**
   * Get current buffer size.
   */


  get length() {
    return this.list.length;
  }
  /**
   * Add item to the buffer.
   */


  write(item) {
    this.list.push(item);
    const {
      flushOnMaxItems
    } = this.params;

    if (flushOnMaxItems) {
      if (this.list.length >= flushOnMaxItems) {
        this.flush();
      }
    }
  }
  /**
   * Remove all items from the buffer.
   */


  clear() {
    this.list = [];
  }
  /**
   * Call `.onflush` method and clear buffer.
   */


  flush() {
    let list;
    [list, this.list] = [this.list, []];
    this.params.onFlush(list);
  }

}

exports.ItemBuffer = ItemBuffer;