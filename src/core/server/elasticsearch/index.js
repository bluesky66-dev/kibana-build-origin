"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  ElasticsearchService: true,
  config: true,
  configSchema: true,
  ElasticsearchConfig: true,
  NodesVersionCompatibility: true,
  ElasticsearchServiceSetup: true,
  ElasticsearchServiceStart: true,
  ElasticsearchStatusMeta: true,
  InternalElasticsearchServiceSetup: true,
  InternalElasticsearchServiceStart: true,
  FakeRequest: true,
  ScopeableRequest: true,
  IClusterClient: true,
  ICustomClusterClient: true,
  ElasticsearchClientConfig: true,
  ElasticsearchClient: true,
  IScopedClusterClient: true,
  SearchResponse: true,
  CountResponse: true,
  ShardsInfo: true,
  ShardsResponse: true,
  Explanation: true,
  GetResponse: true,
  DeleteDocumentResponse: true
};
Object.defineProperty(exports, "ElasticsearchService", {
  enumerable: true,
  get: function () {
    return _elasticsearch_service.ElasticsearchService;
  }
});
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return _elasticsearch_config.config;
  }
});
Object.defineProperty(exports, "configSchema", {
  enumerable: true,
  get: function () {
    return _elasticsearch_config.configSchema;
  }
});
Object.defineProperty(exports, "ElasticsearchConfig", {
  enumerable: true,
  get: function () {
    return _elasticsearch_config.ElasticsearchConfig;
  }
});
Object.defineProperty(exports, "NodesVersionCompatibility", {
  enumerable: true,
  get: function () {
    return _ensure_es_version.NodesVersionCompatibility;
  }
});
Object.defineProperty(exports, "ElasticsearchServiceSetup", {
  enumerable: true,
  get: function () {
    return _types.ElasticsearchServiceSetup;
  }
});
Object.defineProperty(exports, "ElasticsearchServiceStart", {
  enumerable: true,
  get: function () {
    return _types.ElasticsearchServiceStart;
  }
});
Object.defineProperty(exports, "ElasticsearchStatusMeta", {
  enumerable: true,
  get: function () {
    return _types.ElasticsearchStatusMeta;
  }
});
Object.defineProperty(exports, "InternalElasticsearchServiceSetup", {
  enumerable: true,
  get: function () {
    return _types.InternalElasticsearchServiceSetup;
  }
});
Object.defineProperty(exports, "InternalElasticsearchServiceStart", {
  enumerable: true,
  get: function () {
    return _types.InternalElasticsearchServiceStart;
  }
});
Object.defineProperty(exports, "FakeRequest", {
  enumerable: true,
  get: function () {
    return _types.FakeRequest;
  }
});
Object.defineProperty(exports, "ScopeableRequest", {
  enumerable: true,
  get: function () {
    return _types.ScopeableRequest;
  }
});
Object.defineProperty(exports, "IClusterClient", {
  enumerable: true,
  get: function () {
    return _client.IClusterClient;
  }
});
Object.defineProperty(exports, "ICustomClusterClient", {
  enumerable: true,
  get: function () {
    return _client.ICustomClusterClient;
  }
});
Object.defineProperty(exports, "ElasticsearchClientConfig", {
  enumerable: true,
  get: function () {
    return _client.ElasticsearchClientConfig;
  }
});
Object.defineProperty(exports, "ElasticsearchClient", {
  enumerable: true,
  get: function () {
    return _client.ElasticsearchClient;
  }
});
Object.defineProperty(exports, "IScopedClusterClient", {
  enumerable: true,
  get: function () {
    return _client.IScopedClusterClient;
  }
});
Object.defineProperty(exports, "SearchResponse", {
  enumerable: true,
  get: function () {
    return _client.SearchResponse;
  }
});
Object.defineProperty(exports, "CountResponse", {
  enumerable: true,
  get: function () {
    return _client.CountResponse;
  }
});
Object.defineProperty(exports, "ShardsInfo", {
  enumerable: true,
  get: function () {
    return _client.ShardsInfo;
  }
});
Object.defineProperty(exports, "ShardsResponse", {
  enumerable: true,
  get: function () {
    return _client.ShardsResponse;
  }
});
Object.defineProperty(exports, "Explanation", {
  enumerable: true,
  get: function () {
    return _client.Explanation;
  }
});
Object.defineProperty(exports, "GetResponse", {
  enumerable: true,
  get: function () {
    return _client.GetResponse;
  }
});
Object.defineProperty(exports, "DeleteDocumentResponse", {
  enumerable: true,
  get: function () {
    return _client.DeleteDocumentResponse;
  }
});

var _elasticsearch_service = require("./elasticsearch_service");

var _elasticsearch_config = require("./elasticsearch_config");

var _ensure_es_version = require("./version_check/ensure_es_version");

var _types = require("./types");

var _legacy = require("./legacy");

Object.keys(_legacy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _legacy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _legacy[key];
    }
  });
});

var _client = require("./client");