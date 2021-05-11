"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaFramework = void 0;

var _server = require("../../../../../../../src/plugins/data/server");

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
}

class KibanaFramework {
  constructor(core, config, plugins) {
    _defineProperty(this, "router", void 0);

    _defineProperty(this, "plugins", void 0);

    this.router = core.http.createRouter();
    this.plugins = plugins;
  }

  registerRoute(config, handler) {
    const defaultOptions = {
      tags: ['access:infra']
    };
    const routeConfig = {
      path: config.path,
      validate: config.validate,
      // Currently we have no use of custom options beyond tags, this can be extended
      // beyond defaultOptions if it's needed.
      options: defaultOptions
    };

    switch (config.method) {
      case 'get':
        this.router.get(routeConfig, handler);
        break;

      case 'post':
        this.router.post(routeConfig, handler);
        break;

      case 'delete':
        this.router.delete(routeConfig, handler);
        break;

      case 'put':
        this.router.put(routeConfig, handler);
        break;

      case 'patch':
        this.router.patch(routeConfig, handler);
        break;
    }
  }

  async callWithRequest(requestContext, endpoint, params) {
    const {
      elasticsearch,
      uiSettings
    } = requestContext.core;
    const includeFrozen = await uiSettings.client.get(_server.UI_SETTINGS.SEARCH_INCLUDE_FROZEN);

    if (endpoint === 'msearch') {
      const maxConcurrentShardRequests = await uiSettings.client.get(_server.UI_SETTINGS.COURIER_MAX_CONCURRENT_SHARD_REQUESTS);

      if (maxConcurrentShardRequests > 0) {
        params = { ...params,
          max_concurrent_shard_requests: maxConcurrentShardRequests
        };
      }
    }

    const frozenIndicesParams = ['search', 'msearch'].includes(endpoint) ? {
      ignore_throttled: !includeFrozen
    } : {};
    return elasticsearch.legacy.client.callAsCurrentUser(endpoint, { ...params,
      ...frozenIndicesParams
    });
  }

  getIndexPatternsService(requestContext) {
    return new _server.IndexPatternsFetcher(requestContext.core.elasticsearch.client.asCurrentUser, true);
  }

  getSpaceId(request) {
    const spacesPlugin = this.plugins.spaces;

    if (spacesPlugin && spacesPlugin.spacesService && typeof spacesPlugin.spacesService.getSpaceId === 'function') {
      return spacesPlugin.spacesService.getSpaceId(request);
    } else {
      return 'default';
    }
  }

  async makeTSVBRequest(requestContext, rawRequest, model, timerange, filters) {
    const {
      getVisData
    } = this.plugins.visTypeTimeseries;

    if (typeof getVisData !== 'function') {
      throw new Error('TSVB is not available');
    }

    const options = {
      timerange,
      panels: [model],
      filters
    };
    return getVisData(requestContext, rawRequest, options);
  }

}

exports.KibanaFramework = KibanaFramework;