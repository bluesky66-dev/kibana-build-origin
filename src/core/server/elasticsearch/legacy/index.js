"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  LegacyClusterClient: true,
  ILegacyClusterClient: true,
  ILegacyCustomClusterClient: true,
  ILegacyScopedClusterClient: true,
  LegacyScopedClusterClient: true,
  LegacyElasticsearchClientConfig: true,
  LegacyElasticsearchError: true,
  LegacyElasticsearchErrorHelpers: true
};
Object.defineProperty(exports, "LegacyClusterClient", {
  enumerable: true,
  get: function () {
    return _cluster_client.LegacyClusterClient;
  }
});
Object.defineProperty(exports, "ILegacyClusterClient", {
  enumerable: true,
  get: function () {
    return _cluster_client.ILegacyClusterClient;
  }
});
Object.defineProperty(exports, "ILegacyCustomClusterClient", {
  enumerable: true,
  get: function () {
    return _cluster_client.ILegacyCustomClusterClient;
  }
});
Object.defineProperty(exports, "ILegacyScopedClusterClient", {
  enumerable: true,
  get: function () {
    return _scoped_cluster_client.ILegacyScopedClusterClient;
  }
});
Object.defineProperty(exports, "LegacyScopedClusterClient", {
  enumerable: true,
  get: function () {
    return _scoped_cluster_client.LegacyScopedClusterClient;
  }
});
Object.defineProperty(exports, "LegacyElasticsearchClientConfig", {
  enumerable: true,
  get: function () {
    return _elasticsearch_client_config.LegacyElasticsearchClientConfig;
  }
});
Object.defineProperty(exports, "LegacyElasticsearchError", {
  enumerable: true,
  get: function () {
    return _errors.LegacyElasticsearchError;
  }
});
Object.defineProperty(exports, "LegacyElasticsearchErrorHelpers", {
  enumerable: true,
  get: function () {
    return _errors.LegacyElasticsearchErrorHelpers;
  }
});

var _cluster_client = require("./cluster_client");

var _scoped_cluster_client = require("./scoped_cluster_client");

var _elasticsearch_client_config = require("./elasticsearch_client_config");

var _errors = require("./errors");

var _api_types = require("./api_types");

Object.keys(_api_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _api_types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _api_types[key];
    }
  });
});