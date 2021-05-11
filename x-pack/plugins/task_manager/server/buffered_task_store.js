"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BufferedTaskStore = void 0;

var _bulk_operation_buffer = require("./lib/bulk_operation_buffer");

var _result_type = require("./lib/result_type");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
} // by default allow updates to be buffered for up to 50ms


const DEFAULT_BUFFER_MAX_DURATION = 50;

class BufferedTaskStore {
  constructor(taskStore, options) {
    this.taskStore = taskStore;

    _defineProperty(this, "bufferedUpdate", void 0);

    this.bufferedUpdate = (0, _bulk_operation_buffer.createBuffer)(docs => taskStore.bulkUpdate(docs), {
      bufferMaxDuration: DEFAULT_BUFFER_MAX_DURATION,
      ...options
    });
  }

  async update(doc) {
    return (0, _result_type.unwrapPromise)(this.bufferedUpdate(doc));
  }

  async remove(id) {
    return this.taskStore.remove(id);
  }

}

exports.BufferedTaskStore = BufferedTaskStore;