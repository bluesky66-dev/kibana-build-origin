"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileHashCache = void 0;

var _lruCache = _interopRequireDefault(require("lru-cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FileHashCache {
  constructor() {
    _defineProperty(this, "lru", new _lruCache.default(100));
  }

  get(key) {
    return this.lru.get(key);
  }

  set(key, value) {
    this.lru.set(key, value);
  }

  del(key) {
    this.lru.del(key);
  }

}

exports.FileHashCache = FileHashCache;