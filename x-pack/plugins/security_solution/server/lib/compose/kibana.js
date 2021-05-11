"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = compose;

var _kibana_framework_adapter = require("../framework/kibana_framework_adapter");

var _hosts = require("../hosts");

var _index_fields = require("../index_fields");

var _source_status = require("../source_status");

var _sources = require("../sources");

var note = _interopRequireWildcard(require("../note/saved_object"));

var pinnedEvent = _interopRequireWildcard(require("../pinned_event/saved_object"));

var timeline = _interopRequireWildcard(require("../timeline/saved_object"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function compose(core, plugins, endpointContext) {
  const framework = new _kibana_framework_adapter.KibanaBackendFrameworkAdapter(core, plugins);
  const sources = new _sources.Sources(new _sources.ConfigurationSourcesAdapter());
  const sourceStatus = new _source_status.SourceStatus(new _source_status.ElasticsearchSourceStatusAdapter(framework));
  const domainLibs = {
    fields: new _index_fields.IndexFields(new _index_fields.ElasticsearchIndexFieldAdapter()),
    hosts: new _hosts.Hosts(new _hosts.ElasticsearchHostsAdapter(framework, endpointContext))
  };
  const libs = {
    framework,
    sourceStatus,
    sources,
    ...domainLibs,
    timeline,
    note,
    pinnedEvent
  };
  return libs;
}