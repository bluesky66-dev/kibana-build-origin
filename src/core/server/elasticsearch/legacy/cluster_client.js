"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LegacyClusterClient = void 0;

var _elasticsearch = require("elasticsearch");

var _lodash = require("lodash");

var _errors = require("./errors");

var _http = require("../../http");

var _router = require("../../http/router");

var _elasticsearch_client_config = require("./elasticsearch_client_config");

var _scoped_cluster_client = require("./scoped_cluster_client");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Support Legacy platform request for the period of migration.
 *
 * @public
 */
const noop = () => undefined;
/**
 * Calls the Elasticsearch API endpoint with the specified parameters.
 * @param client Raw Elasticsearch JS client instance to use.
 * @param endpoint Name of the API endpoint to call.
 * @param clientParams Parameters that will be directly passed to the
 * Elasticsearch JS client.
 * @param options Options that affect the way we call the API and process the result.
 */


const callAPI = async (client, endpoint, clientParams = {}, options = {
  wrap401Errors: true
}) => {
  const clientPath = endpoint.split('.');
  const api = (0, _lodash.get)(client, clientPath);

  if (!api) {
    throw new Error(`called with an invalid endpoint: ${endpoint}`);
  }

  const apiContext = clientPath.length === 1 ? client : (0, _lodash.get)(client, clientPath.slice(0, -1));

  try {
    return await new Promise((resolve, reject) => {
      const request = api.call(apiContext, clientParams);

      if (options.signal) {
        options.signal.addEventListener('abort', () => {
          request.abort();
          reject(new Error('Request was aborted'));
        });
      }

      return request.then(resolve, reject);
    });
  } catch (err) {
    if (!options.wrap401Errors || err.statusCode !== 401) {
      throw err;
    }

    throw _errors.LegacyElasticsearchErrorHelpers.decorateNotAuthorizedError(err);
  }
};
/**
 * Represents an Elasticsearch cluster API client created by the platform.
 * It allows to call API on behalf of the internal Kibana user and
 * the actual user that is derived from the request headers (via `asScoped(...)`).
 *
 * See {@link LegacyClusterClient}.
 *
 * @deprecated Use {@link IClusterClient}.
 * @public
 */


/**
 * {@inheritDoc IClusterClient}
 * @deprecated Use {@link IClusterClient}.
 * @public
 */
class LegacyClusterClient {
  /**
   * Raw Elasticsearch JS client that acts on behalf of the Kibana internal user.
   */

  /**
   * Optional raw Elasticsearch JS client that is shared between all the scoped clients created
   * from this cluster client. Every API call is attributed by the wh
   */

  /**
   * Indicates whether this cluster client (and all internal raw Elasticsearch JS clients) has been closed.
   */
  constructor(config, log, type, getAuthHeaders = noop) {
    this.config = config;
    this.log = log;
    this.type = type;
    this.getAuthHeaders = getAuthHeaders;

    _defineProperty(this, "client", void 0);

    _defineProperty(this, "scopedClient", void 0);

    _defineProperty(this, "isClosed", false);

    _defineProperty(this, "callAsInternalUser", async (endpoint, clientParams = {}, options) => {
      this.assertIsNotClosed();
      return await callAPI.bind(null, this.client)(endpoint, clientParams, options);
    });

    _defineProperty(this, "callAsCurrentUser", async (endpoint, clientParams = {}, options) => {
      this.assertIsNotClosed();
      return await callAPI.bind(null, this.scopedClient)(endpoint, clientParams, options);
    });

    this.client = new _elasticsearch.Client((0, _elasticsearch_client_config.parseElasticsearchClientConfig)(config, log, type));
  }
  /**
   * Calls specified endpoint with provided clientParams on behalf of the
   * Kibana internal user.
   * See {@link LegacyAPICaller}.
   * @deprecated Use {@link IClusterClient.asInternalUser}.
   *
   * @param endpoint - String descriptor of the endpoint e.g. `cluster.getSettings` or `ping`.
   * @param clientParams - A dictionary of parameters that will be passed directly to the Elasticsearch JS client.
   * @param options - Options that affect the way we call the API and process the result.
   */


  /**
   * Closes the cluster client. After that client cannot be used and one should
   * create a new client instance to be able to interact with Elasticsearch API.
   */
  close() {
    if (this.isClosed) {
      return;
    }

    this.isClosed = true;
    this.client.close();

    if (this.scopedClient !== undefined) {
      this.scopedClient.close();
    }
  }
  /**
   * Creates an instance of {@link ILegacyScopedClusterClient} based on the configuration the
   * current cluster client that exposes additional `callAsCurrentUser` method
   * scoped to the provided req. Consumers shouldn't worry about closing
   * scoped client instances, these will be automatically closed as soon as the
   * original cluster client isn't needed anymore and closed.
   *
   * @param request - Request the `IScopedClusterClient` instance will be scoped to.
   * Supports request optionality, Legacy.Request & FakeRequest for BWC with LegacyPlatform
   */


  asScoped(request) {
    // It'd have been quite expensive to create and configure client for every incoming
    // request since it involves parsing of the config, reading of the SSL certificate and
    // key files etc. Moreover scoped client needs two Elasticsearch JS clients at the same
    // time: one to support `callAsInternalUser` and another one for `callAsCurrentUser`.
    // To reduce that overhead we create one scoped client per cluster client and share it
    // between all scoped client instances.
    if (this.scopedClient === undefined) {
      this.scopedClient = new _elasticsearch.Client((0, _elasticsearch_client_config.parseElasticsearchClientConfig)(this.config, this.log, this.type, {
        auth: false,
        ignoreCertAndKey: !this.config.ssl || !this.config.ssl.alwaysPresentCertificate
      }));
    }

    return new _scoped_cluster_client.LegacyScopedClusterClient(this.callAsInternalUser, this.callAsCurrentUser, (0, _router.filterHeaders)(this.getHeaders(request), ['x-opaque-id', ...this.config.requestHeadersWhitelist]));
  }
  /**
   * Calls specified endpoint with provided clientParams on behalf of the
   * user initiated request to the Kibana server (via HTTP request headers).
   * See {@link LegacyAPICaller}.
   *
   * @param endpoint - String descriptor of the endpoint e.g. `cluster.getSettings` or `ping`.
   * @param clientParams - A dictionary of parameters that will be passed directly to the Elasticsearch JS client.
   * @param options - Options that affect the way we call the API and process the result.
   */


  assertIsNotClosed() {
    if (this.isClosed) {
      throw new Error('Cluster client cannot be used after it has been closed.');
    }
  }

  getHeaders(request) {
    if (!(0, _http.isRealRequest)(request)) {
      return request && request.headers ? request.headers : {};
    }

    const authHeaders = this.getAuthHeaders(request);
    const requestHeaders = (0, _router.ensureRawRequest)(request).headers;
    const requestIdHeaders = (0, _http.isKibanaRequest)(request) ? {
      'x-opaque-id': request.id
    } : {};
    return { ...requestHeaders,
      ...requestIdHeaders,
      ...authHeaders
    };
  }

}

exports.LegacyClusterClient = LegacyClusterClient;