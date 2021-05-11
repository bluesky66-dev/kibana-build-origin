"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "internalMonitoringCheckRoute", {
  enumerable: true,
  get: function () {
    return _internal_monitoring.internalMonitoringCheckRoute;
  }
});
Object.defineProperty(exports, "clusterSettingsCheckRoute", {
  enumerable: true,
  get: function () {
    return _cluster.clusterSettingsCheckRoute;
  }
});
Object.defineProperty(exports, "nodesSettingsCheckRoute", {
  enumerable: true,
  get: function () {
    return _nodes.nodesSettingsCheckRoute;
  }
});
Object.defineProperty(exports, "setCollectionEnabledRoute", {
  enumerable: true,
  get: function () {
    return _collection_enabled.setCollectionEnabledRoute;
  }
});
Object.defineProperty(exports, "setCollectionIntervalRoute", {
  enumerable: true,
  get: function () {
    return _collection_interval.setCollectionIntervalRoute;
  }
});

var _internal_monitoring = require("./check/internal_monitoring");

var _cluster = require("./check/cluster");

var _nodes = require("./check/nodes");

var _collection_enabled = require("./set/collection_enabled");

var _collection_interval = require("./set/collection_interval");