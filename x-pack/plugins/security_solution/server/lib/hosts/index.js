"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Hosts: true
};
exports.Hosts = void 0;

var _elasticsearch_adapter = require("./elasticsearch_adapter");

Object.keys(_elasticsearch_adapter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _elasticsearch_adapter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _elasticsearch_adapter[key];
    }
  });
});

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class Hosts {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async getHosts(req, options) {
    return this.adapter.getHosts(req, options);
  }

  async getHostOverview(req, options) {
    return this.adapter.getHostOverview(req, options);
  }

  async getHostFirstLastSeen(req, options) {
    return this.adapter.getHostFirstLastSeen(req, options);
  }

}

exports.Hosts = Hosts;