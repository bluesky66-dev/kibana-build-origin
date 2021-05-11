"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchService = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _std = require("@kbn/std");

var _legacy = require("./legacy");

var _client = require("./client");

var _elasticsearch_config = require("./elasticsearch_config");

var _ensure_es_version = require("./version_check/ensure_es_version");

var _status = require("./status");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @internal */
class ElasticsearchService {
  constructor(coreContext) {
    this.coreContext = coreContext;

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "config$", void 0);

    _defineProperty(this, "stop$", new _rxjs.Subject());

    _defineProperty(this, "kibanaVersion", void 0);

    _defineProperty(this, "getAuthHeaders", void 0);

    _defineProperty(this, "createLegacyCustomClient", void 0);

    _defineProperty(this, "legacyClient", void 0);

    _defineProperty(this, "client", void 0);

    this.kibanaVersion = coreContext.env.packageInfo.version;
    this.log = coreContext.logger.get('elasticsearch-service');
    this.config$ = coreContext.configService.atPath('elasticsearch').pipe((0, _operators.map)(rawConfig => new _elasticsearch_config.ElasticsearchConfig(rawConfig)));
  }

  async setup(deps) {
    this.log.debug('Setting up elasticsearch service');
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();
    this.getAuthHeaders = deps.http.getAuthHeaders;
    this.legacyClient = this.createLegacyClusterClient('data', config);
    this.client = this.createClusterClient('data', config);
    const esNodesCompatibility$ = (0, _ensure_es_version.pollEsNodesVersion)({
      internalClient: this.client.asInternalUser,
      log: this.log,
      ignoreVersionMismatch: config.ignoreVersionMismatch,
      esVersionCheckInterval: config.healthCheckDelay.asMilliseconds(),
      kibanaVersion: this.kibanaVersion
    }).pipe((0, _operators.takeUntil)(this.stop$), (0, _operators.shareReplay)({
      refCount: true,
      bufferSize: 1
    }));

    this.createLegacyCustomClient = (type, clientConfig = {}) => {
      const finalConfig = (0, _std.merge)({}, config, clientConfig);
      return this.createLegacyClusterClient(type, finalConfig);
    };

    return {
      legacy: {
        config$: this.config$,
        client: this.legacyClient,
        createClient: this.createLegacyCustomClient
      },
      esNodesCompatibility$,
      status$: (0, _status.calculateStatus$)(esNodesCompatibility$)
    };
  }

  async start() {
    if (!this.legacyClient || !this.createLegacyCustomClient) {
      throw new Error('ElasticsearchService needs to be setup before calling start');
    }

    const config = await this.config$.pipe((0, _operators.first)()).toPromise();

    const createClient = (type, clientConfig = {}) => {
      const finalConfig = (0, _std.merge)({}, config, clientConfig);
      return this.createClusterClient(type, finalConfig);
    };

    return {
      client: this.client,
      createClient,
      legacy: {
        config$: this.config$,
        client: this.legacyClient,
        createClient: this.createLegacyCustomClient
      }
    };
  }

  async stop() {
    this.log.debug('Stopping elasticsearch service');
    this.stop$.next();

    if (this.client) {
      await this.client.close();
    }

    if (this.legacyClient) {
      this.legacyClient.close();
    }
  }

  createClusterClient(type, config) {
    return new _client.ClusterClient(config, this.coreContext.logger.get('elasticsearch'), type, this.getAuthHeaders);
  }

  createLegacyClusterClient(type, config) {
    return new _legacy.LegacyClusterClient(config, this.coreContext.logger.get('elasticsearch'), type, this.getAuthHeaders);
  }

}

exports.ElasticsearchService = ElasticsearchService;