"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapRequest = wrapRequest;
exports.KibanaBackendFrameworkAdapter = void 0;

var _apolloServerCore = require("apollo-server-core");

var _configSchema = require("@kbn/config-schema");

var _server = require("../../../../../../src/plugins/data/server");

var _types = require("./types");

var _utils = require("../detection_engine/routes/utils");

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

class KibanaBackendFrameworkAdapter {
  constructor(core, plugins) {
    _defineProperty(this, "router", void 0);

    _defineProperty(this, "security", void 0);

    this.router = core.http.createRouter();
    this.security = plugins.security;
  }

  async callWithRequest(req, endpoint, // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params) {
    const {
      elasticsearch,
      uiSettings
    } = req.context.core;
    const includeFrozen = await uiSettings.client.get(_server.UI_SETTINGS.SEARCH_INCLUDE_FROZEN);
    const maxConcurrentShardRequests = endpoint === 'msearch' ? await uiSettings.client.get(_server.UI_SETTINGS.COURIER_MAX_CONCURRENT_SHARD_REQUESTS) : 0;
    return elasticsearch.legacy.client.callAsCurrentUser(endpoint, { ...params,
      ignore_throttled: !includeFrozen,
      ...(maxConcurrentShardRequests > 0 ? {
        max_concurrent_shard_requests: maxConcurrentShardRequests
      } : {})
    });
  }

  registerGraphQLEndpoint(routePath, schema) {
    this.router.post({
      path: routePath,
      validate: {
        body: _configSchema.schema.object({}, {
          unknowns: 'allow'
        })
      },
      options: {
        tags: ['access:securitySolution']
      }
    }, async (context, request, response) => {
      try {
        const user = await this.getCurrentUserInfo(request);
        const gqlResponse = await (0, _apolloServerCore.runHttpQuery)([request], {
          method: 'POST',
          options: req => ({
            context: {
              req: wrapRequest(req, context, user)
            },
            schema
          }),
          query: request.body
        });
        return response.ok({
          body: gqlResponse,
          headers: {
            'content-type': 'application/json'
          }
        });
      } catch (error) {
        return this.handleError(error, response);
      }
    });
  }

  async getCurrentUserInfo(request) {
    try {
      var _await$this$security$, _this$security;

      const user = (_await$this$security$ = await ((_this$security = this.security) === null || _this$security === void 0 ? void 0 : _this$security.authc.getCurrentUser(request))) !== null && _await$this$security$ !== void 0 ? _await$this$security$ : null;
      return user;
    } catch {
      return null;
    }
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any


  handleError(error, response) {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    if (error.name === 'HttpQueryError') {
      return siemResponse.error({
        statusCode: error.statusCode,
        headers: error.headers,
        body: error.message
      });
    }

    return siemResponse.error({
      statusCode: 500,
      body: error.message
    });
  }

  getIndexPatternsService(request) {
    return new _server.IndexPatternsFetcher(request.context.core.elasticsearch.client.asCurrentUser, true);
  }

}

exports.KibanaBackendFrameworkAdapter = KibanaBackendFrameworkAdapter;

function wrapRequest(request, context, user) {
  return {
    [_types.internalFrameworkRequest]: request,
    body: request.body,
    context,
    user
  };
}