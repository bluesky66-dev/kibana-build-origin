"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClusterClient = void 0;

var _http = require("../../http");

var _router = require("../../http/router");

var _configure_client = require("./configure_client");

var _scoped_cluster_client = require("./scoped_cluster_client");

var _default_headers = require("../default_headers");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const noop = () => undefined;
/**
 * Represents an Elasticsearch cluster API client created by the platform.
 * It allows to call API on behalf of the internal Kibana user and
 * the actual user that is derived from the request headers (via `asScoped(...)`).
 *
 * @public
 **/


/** @internal **/
class ClusterClient {
  constructor(config, logger, type, getAuthHeaders = noop) {
    this.config = config;
    this.getAuthHeaders = getAuthHeaders;

    _defineProperty(this, "asInternalUser", void 0);

    _defineProperty(this, "rootScopedClient", void 0);

    _defineProperty(this, "isClosed", false);

    this.asInternalUser = (0, _configure_client.configureClient)(config, {
      logger,
      type
    });
    this.rootScopedClient = (0, _configure_client.configureClient)(config, {
      logger,
      type,
      scoped: true
    });
  }

  asScoped(request) {
    const scopedHeaders = this.getScopedHeaders(request);
    const scopedClient = this.rootScopedClient.child({
      headers: scopedHeaders
    });
    return new _scoped_cluster_client.ScopedClusterClient(this.asInternalUser, scopedClient);
  }

  async close() {
    if (this.isClosed) {
      return;
    }

    this.isClosed = true;
    await Promise.all([this.asInternalUser.close(), this.rootScopedClient.close()]);
  }

  getScopedHeaders(request) {
    let scopedHeaders;

    if ((0, _http.isRealRequest)(request)) {
      const requestHeaders = (0, _router.ensureRawRequest)(request).headers;
      const requestIdHeaders = (0, _http.isKibanaRequest)(request) ? {
        'x-opaque-id': request.id
      } : {};
      const authHeaders = this.getAuthHeaders(request);
      scopedHeaders = (0, _router.filterHeaders)({ ...requestHeaders,
        ...requestIdHeaders,
        ...authHeaders
      }, ['x-opaque-id', ...this.config.requestHeadersWhitelist]);
    } else {
      var _request$headers;

      scopedHeaders = (0, _router.filterHeaders)((_request$headers = request === null || request === void 0 ? void 0 : request.headers) !== null && _request$headers !== void 0 ? _request$headers : {}, this.config.requestHeadersWhitelist);
    }

    return { ..._default_headers.DEFAULT_HEADERS,
      ...this.config.customHeaders,
      ...scopedHeaders
    };
  }

}

exports.ClusterClient = ClusterClient;