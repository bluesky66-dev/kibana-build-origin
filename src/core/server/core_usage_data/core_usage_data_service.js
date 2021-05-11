"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoreUsageDataService = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _is_configured = require("./is_configured");

var _core_usage_stats = require("./core_usage_stats");

var _constants = require("./constants");

var _core_usage_stats_client = require("./core_usage_stats_client");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Because users can configure their Saved Object to any arbitrary index name,
 * we need to map customized index names back to a "standard" index name.
 *
 * e.g. If a user configures `kibana.index: .my_saved_objects` we want to the
 * collected data to be grouped under `.kibana` not ".my_saved_objects".
 *
 * This is rather brittle, but the option to configure index names might go
 * away completely anyway (see #60053).
 *
 * @param index The index name configured for this SO type
 * @param kibanaConfigIndex The default kibana index as configured by the user
 * with `kibana.index`
 */
const kibanaOrTaskManagerIndex = (index, kibanaConfigIndex) => {
  return index === kibanaConfigIndex ? '.kibana' : '.kibana_task_manager';
};
/**
 * This is incredibly hacky... The config service doesn't allow you to determine
 * whether or not a config value has been changed from the default value, and the
 * default value is defined in legacy code.
 *
 * This will be going away in 8.0, so please look away for a few months
 *
 * @param index The `kibana.index` setting from the `kibana.yml`
 */


const isCustomIndex = index => {
  return index !== '.kibana';
};

class CoreUsageDataService {
  constructor(core) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "elasticsearchConfig", void 0);

    _defineProperty(this, "configService", void 0);

    _defineProperty(this, "httpConfig", void 0);

    _defineProperty(this, "loggingConfig", void 0);

    _defineProperty(this, "soConfig", void 0);

    _defineProperty(this, "stop$", void 0);

    _defineProperty(this, "opsMetrics", void 0);

    _defineProperty(this, "kibanaConfig", void 0);

    _defineProperty(this, "coreUsageStatsClient", void 0);

    this.logger = core.logger.get('core-usage-stats-service');
    this.configService = core.configService;
    this.stop$ = new _rxjs.Subject();
  }

  async getSavedObjectIndicesUsageData(savedObjects, elasticsearch) {
    const indices = await Promise.all(Array.from(savedObjects.getTypeRegistry().getAllTypes().reduce((acc, type) => {
      var _type$indexPattern;

      const index = (_type$indexPattern = type.indexPattern) !== null && _type$indexPattern !== void 0 ? _type$indexPattern : this.kibanaConfig.index;
      return index != null ? acc.add(index) : acc;
    }, new Set()).values()).map(index => {
      // The _cat/indices API returns the _index_ and doesn't return a way
      // to map back from the index to the alias. So we have to make an API
      // call for every alias
      return elasticsearch.client.asInternalUser.cat.indices({
        index,
        format: 'JSON',
        bytes: 'b'
      }).then(({
        body
      }) => {
        const stats = body[0];
        return {
          alias: kibanaOrTaskManagerIndex(index, this.kibanaConfig.index),
          docsCount: stats['docs.count'],
          docsDeleted: stats['docs.deleted'],
          storeSizeBytes: stats['store.size'],
          primaryStoreSizeBytes: stats['pri.store.size']
        };
      });
    }));
    return {
      indices
    };
  }

  async getCoreUsageData(savedObjects, elasticsearch) {
    var _this$loggingConfig$a, _this$loggingConfig, _this$loggingConfig$l, _this$loggingConfig2;

    if (this.elasticsearchConfig == null || this.httpConfig == null || this.soConfig == null || this.opsMetrics == null) {
      throw new Error('Unable to read config values. Ensure that setup() has completed.');
    }

    if (!this.coreUsageStatsClient) {
      throw new Error('Core usage stats client is not initialized. Ensure that setup() has completed.');
    }

    const es = this.elasticsearchConfig;
    const soUsageData = await this.getSavedObjectIndicesUsageData(savedObjects, elasticsearch);
    const coreUsageStatsData = await this.coreUsageStatsClient.getUsageStats();
    const http = this.httpConfig;
    return {
      config: {
        elasticsearch: {
          apiVersion: es.apiVersion,
          sniffOnStart: es.sniffOnStart,
          sniffIntervalMs: es.sniffInterval !== false ? es.sniffInterval.asMilliseconds() : -1,
          sniffOnConnectionFault: es.sniffOnConnectionFault,
          numberOfHostsConfigured: Array.isArray(es.hosts) ? es.hosts.length : _is_configured.isConfigured.string(es.hosts) ? 1 : 0,
          customHeadersConfigured: _is_configured.isConfigured.record(es.customHeaders),
          healthCheckDelayMs: es.healthCheck.delay.asMilliseconds(),
          logQueries: es.logQueries,
          pingTimeoutMs: es.pingTimeout.asMilliseconds(),
          requestHeadersWhitelistConfigured: _is_configured.isConfigured.stringOrArray(es.requestHeadersWhitelist, ['authorization']),
          requestTimeoutMs: es.requestTimeout.asMilliseconds(),
          shardTimeoutMs: es.shardTimeout.asMilliseconds(),
          ssl: {
            alwaysPresentCertificate: es.ssl.alwaysPresentCertificate,
            certificateAuthoritiesConfigured: _is_configured.isConfigured.stringOrArray(es.ssl.certificateAuthorities),
            certificateConfigured: _is_configured.isConfigured.string(es.ssl.certificate),
            keyConfigured: _is_configured.isConfigured.string(es.ssl.key),
            verificationMode: es.ssl.verificationMode,
            truststoreConfigured: _is_configured.isConfigured.record(es.ssl.truststore),
            keystoreConfigured: _is_configured.isConfigured.record(es.ssl.keystore)
          }
        },
        http: {
          basePathConfigured: _is_configured.isConfigured.string(http.basePath),
          maxPayloadInBytes: http.maxPayload.getValueInBytes(),
          rewriteBasePath: http.rewriteBasePath,
          keepaliveTimeout: http.keepaliveTimeout,
          socketTimeout: http.socketTimeout,
          compression: {
            enabled: http.compression.enabled,
            referrerWhitelistConfigured: _is_configured.isConfigured.array(http.compression.referrerWhitelist)
          },
          xsrf: {
            disableProtection: http.xsrf.disableProtection,
            allowlistConfigured: _is_configured.isConfigured.array(http.xsrf.allowlist)
          },
          requestId: {
            allowFromAnyIp: http.requestId.allowFromAnyIp,
            ipAllowlistConfigured: _is_configured.isConfigured.array(http.requestId.ipAllowlist)
          },
          ssl: {
            certificateAuthoritiesConfigured: _is_configured.isConfigured.stringOrArray(http.ssl.certificateAuthorities),
            certificateConfigured: _is_configured.isConfigured.string(http.ssl.certificate),
            cipherSuites: http.ssl.cipherSuites,
            keyConfigured: _is_configured.isConfigured.string(http.ssl.key),
            redirectHttpFromPortConfigured: _is_configured.isConfigured.number(http.ssl.redirectHttpFromPort),
            supportedProtocols: http.ssl.supportedProtocols,
            clientAuthentication: http.ssl.clientAuthentication,
            keystoreConfigured: _is_configured.isConfigured.record(http.ssl.keystore),
            truststoreConfigured: _is_configured.isConfigured.record(http.ssl.truststore)
          }
        },
        logging: {
          appendersTypesUsed: Array.from(Array.from((_this$loggingConfig$a = (_this$loggingConfig = this.loggingConfig) === null || _this$loggingConfig === void 0 ? void 0 : _this$loggingConfig.appenders.values()) !== null && _this$loggingConfig$a !== void 0 ? _this$loggingConfig$a : []).reduce((acc, a) => acc.add(a.type), new Set()).values()),
          loggersConfiguredCount: (_this$loggingConfig$l = (_this$loggingConfig2 = this.loggingConfig) === null || _this$loggingConfig2 === void 0 ? void 0 : _this$loggingConfig2.loggers.length) !== null && _this$loggingConfig$l !== void 0 ? _this$loggingConfig$l : 0
        },
        savedObjects: {
          customIndex: isCustomIndex(this.kibanaConfig.index),
          maxImportPayloadBytes: this.soConfig.maxImportPayloadBytes.getValueInBytes(),
          maxImportExportSizeBytes: this.soConfig.maxImportExportSize.getValueInBytes()
        }
      },
      environment: {
        memory: {
          heapSizeLimit: this.opsMetrics.process.memory.heap.size_limit,
          heapTotalBytes: this.opsMetrics.process.memory.heap.total_in_bytes,
          heapUsedBytes: this.opsMetrics.process.memory.heap.used_in_bytes
        }
      },
      services: {
        savedObjects: soUsageData
      },
      ...coreUsageStatsData
    };
  }

  setup({
    http,
    metrics,
    savedObjectsStartPromise
  }) {
    metrics.getOpsMetrics$().pipe((0, _operators.takeUntil)(this.stop$)).subscribe(opsMetrics => this.opsMetrics = opsMetrics);
    this.configService.atPath('elasticsearch').pipe((0, _operators.takeUntil)(this.stop$)).subscribe(config => {
      this.elasticsearchConfig = config;
    });
    this.configService.atPath('server').pipe((0, _operators.takeUntil)(this.stop$)).subscribe(config => {
      this.httpConfig = config;
    });
    this.configService.atPath('logging').pipe((0, _operators.takeUntil)(this.stop$)).subscribe(config => {
      this.loggingConfig = config;
    });
    this.configService.atPath('savedObjects').pipe((0, _operators.takeUntil)(this.stop$)).subscribe(config => {
      this.soConfig = config;
    });
    this.configService.atPath('kibana').pipe((0, _operators.takeUntil)(this.stop$)).subscribe(config => {
      this.kibanaConfig = config;
    });
    const internalRepositoryPromise = savedObjectsStartPromise.then(savedObjects => savedObjects.createInternalRepository([_constants.CORE_USAGE_STATS_TYPE]));

    const registerType = typeRegistry => {
      typeRegistry.registerType(_core_usage_stats.coreUsageStatsType);
    };

    const getClient = () => {
      const debugLogger = message => this.logger.debug(message);

      return new _core_usage_stats_client.CoreUsageStatsClient(debugLogger, http.basePath, internalRepositoryPromise);
    };

    this.coreUsageStatsClient = getClient();
    return {
      registerType,
      getClient
    };
  }

  start({
    savedObjects,
    elasticsearch
  }) {
    return {
      getCoreUsageData: () => {
        return this.getCoreUsageData(savedObjects, elasticsearch);
      }
    };
  }

  stop() {
    this.stop$.next();
    this.stop$.complete();
  }

}

exports.CoreUsageDataService = CoreUsageDataService;