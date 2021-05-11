"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "checkClusterSettings", {
  enumerable: true,
  get: function () {
    return _cluster.checkClusterSettings;
  }
});
Object.defineProperty(exports, "checkNodesSettings", {
  enumerable: true,
  get: function () {
    return _nodes.checkNodesSettings;
  }
});
Object.defineProperty(exports, "setCollectionEnabled", {
  enumerable: true,
  get: function () {
    return _collection_enabled.setCollectionEnabled;
  }
});
Object.defineProperty(exports, "setCollectionInterval", {
  enumerable: true,
  get: function () {
    return _collection_interval.setCollectionInterval;
  }
});

var _cluster = require("./cluster");

var _nodes = require("./nodes");

var _collection_enabled = require("./set/collection_enabled");

var _collection_interval = require("./set/collection_interval");