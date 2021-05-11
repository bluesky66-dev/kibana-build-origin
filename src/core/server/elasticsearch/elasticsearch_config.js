"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchConfig = exports.config = exports.configSchema = exports.DEFAULT_API_VERSION = void 0;

var _configSchema = require("@kbn/config-schema");

var _fs = require("fs");

var _utils = require("../utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const hostURISchema = _configSchema.schema.uri({
  scheme: ['http', 'https']
});

const DEFAULT_API_VERSION = '7.x';
exports.DEFAULT_API_VERSION = DEFAULT_API_VERSION;

/**
 * Validation schema for elasticsearch service config. It can be reused when plugins allow users
 * to specify a local elasticsearch config.
 * @public
 */
const configSchema = _configSchema.schema.object({
  sniffOnStart: _configSchema.schema.boolean({
    defaultValue: false
  }),
  sniffInterval: _configSchema.schema.oneOf([_configSchema.schema.duration(), _configSchema.schema.literal(false)], {
    defaultValue: false
  }),
  sniffOnConnectionFault: _configSchema.schema.boolean({
    defaultValue: false
  }),
  hosts: _configSchema.schema.oneOf([hostURISchema, _configSchema.schema.arrayOf(hostURISchema, {
    minSize: 1
  })], {
    defaultValue: 'http://localhost:9200'
  }),
  username: _configSchema.schema.maybe(_configSchema.schema.conditional(_configSchema.schema.contextRef('dist'), false, _configSchema.schema.string({
    validate: rawConfig => {
      if (rawConfig === 'elastic') {
        return 'value of "elastic" is forbidden. This is a superuser account that can obfuscate ' + 'privilege-related issues. You should use the "kibana_system" user instead.';
      }
    }
  }), _configSchema.schema.string())),
  password: _configSchema.schema.maybe(_configSchema.schema.string()),
  requestHeadersWhitelist: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())], {
    defaultValue: ['authorization']
  }),
  customHeaders: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string(), {
    defaultValue: {}
  }),
  shardTimeout: _configSchema.schema.duration({
    defaultValue: '30s'
  }),
  requestTimeout: _configSchema.schema.duration({
    defaultValue: '30s'
  }),
  pingTimeout: _configSchema.schema.duration({
    defaultValue: _configSchema.schema.siblingRef('requestTimeout')
  }),
  logQueries: _configSchema.schema.boolean({
    defaultValue: false
  }),
  ssl: _configSchema.schema.object({
    verificationMode: _configSchema.schema.oneOf([_configSchema.schema.literal('none'), _configSchema.schema.literal('certificate'), _configSchema.schema.literal('full')], {
      defaultValue: 'full'
    }),
    certificateAuthorities: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string(), {
      minSize: 1
    })])),
    certificate: _configSchema.schema.maybe(_configSchema.schema.string()),
    key: _configSchema.schema.maybe(_configSchema.schema.string()),
    keyPassphrase: _configSchema.schema.maybe(_configSchema.schema.string()),
    keystore: _configSchema.schema.object({
      path: _configSchema.schema.maybe(_configSchema.schema.string()),
      password: _configSchema.schema.maybe(_configSchema.schema.string())
    }),
    truststore: _configSchema.schema.object({
      path: _configSchema.schema.maybe(_configSchema.schema.string()),
      password: _configSchema.schema.maybe(_configSchema.schema.string())
    }),
    alwaysPresentCertificate: _configSchema.schema.boolean({
      defaultValue: false
    })
  }, {
    validate: rawConfig => {
      if (rawConfig.key && rawConfig.keystore.path) {
        return 'cannot use [key] when [keystore.path] is specified';
      }

      if (rawConfig.certificate && rawConfig.keystore.path) {
        return 'cannot use [certificate] when [keystore.path] is specified';
      }
    }
  }),
  apiVersion: _configSchema.schema.string({
    defaultValue: DEFAULT_API_VERSION
  }),
  healthCheck: _configSchema.schema.object({
    delay: _configSchema.schema.duration({
      defaultValue: 2500
    })
  }),
  ignoreVersionMismatch: _configSchema.schema.conditional(_configSchema.schema.contextRef('dev'), false, _configSchema.schema.boolean({
    validate: rawValue => {
      if (rawValue === true) {
        return '"ignoreVersionMismatch" can only be set to true in development mode';
      }
    },
    defaultValue: false
  }), _configSchema.schema.boolean({
    defaultValue: false
  }))
});

exports.configSchema = configSchema;

const deprecations = () => [(settings, fromPath, log) => {
  var _es$ssl, _es$ssl2, _es$ssl3, _es$ssl4;

  const es = settings[fromPath];

  if (!es) {
    return settings;
  }

  if (es.username === 'elastic') {
    log(`Setting [${fromPath}.username] to "elastic" is deprecated. You should use the "kibana_system" user instead.`);
  } else if (es.username === 'kibana') {
    log(`Setting [${fromPath}.username] to "kibana" is deprecated. You should use the "kibana_system" user instead.`);
  }

  if (((_es$ssl = es.ssl) === null || _es$ssl === void 0 ? void 0 : _es$ssl.key) !== undefined && ((_es$ssl2 = es.ssl) === null || _es$ssl2 === void 0 ? void 0 : _es$ssl2.certificate) === undefined) {
    log(`Setting [${fromPath}.ssl.key] without [${fromPath}.ssl.certificate] is deprecated. This has no effect, you should use both settings to enable TLS client authentication to Elasticsearch.`);
  } else if (((_es$ssl3 = es.ssl) === null || _es$ssl3 === void 0 ? void 0 : _es$ssl3.certificate) !== undefined && ((_es$ssl4 = es.ssl) === null || _es$ssl4 === void 0 ? void 0 : _es$ssl4.key) === undefined) {
    log(`Setting [${fromPath}.ssl.certificate] without [${fromPath}.ssl.key] is deprecated. This has no effect, you should use both settings to enable TLS client authentication to Elasticsearch.`);
  } else if (es.logQueries === true) {
    log(`Setting [${fromPath}.logQueries] is deprecated and no longer used. You should set the log level to "debug" for the "elasticsearch.queries" context in "logging.loggers" or use "logging.verbose: true".`);
  }

  return settings;
}];

const config = {
  path: 'elasticsearch',
  schema: configSchema,
  deprecations
};
/**
 * Wrapper of config schema.
 * @public
 */

exports.config = config;

class ElasticsearchConfig {
  /**
   * The interval between health check requests Kibana sends to the Elasticsearch.
   */

  /**
   * Whether to allow kibana to connect to a non-compatible elasticsearch node.
   */

  /**
   * Version of the Elasticsearch (6.7, 7.1 or `master`) client will be connecting to.
   */

  /**
   * Hosts that the client will connect to. If sniffing is enabled, this list will
   * be used as seeds to discover the rest of your cluster.
   */

  /**
   * List of Kibana client-side headers to send to Elasticsearch when request
   * scoped cluster client is used. If this is an empty array then *no* client-side
   * will be sent.
   */

  /**
   * Timeout after which PING HTTP request will be aborted and retried.
   */

  /**
   * Timeout after which HTTP request will be aborted and retried.
   */

  /**
   * Timeout for Elasticsearch to wait for responses from shards. Set to 0 to disable.
   */

  /**
   * Specifies whether the client should attempt to detect the rest of the cluster
   * when it is first instantiated.
   */

  /**
   * Interval to perform a sniff operation and make sure the list of nodes is complete.
   * If `false` then sniffing is disabled.
   */

  /**
   * Specifies whether the client should immediately sniff for a more current list
   * of nodes when a connection dies.
   */

  /**
   * If Elasticsearch is protected with basic authentication, this setting provides
   * the username that the Kibana server uses to perform its administrative functions.
   */

  /**
   * If Elasticsearch is protected with basic authentication, this setting provides
   * the password that the Kibana server uses to perform its administrative functions.
   */

  /**
   * Set of settings configure SSL connection between Kibana and Elasticsearch that
   * are required when `xpack.ssl.verification_mode` in Elasticsearch is set to
   * either `certificate` or `full`.
   */

  /**
   * Header names and values to send to Elasticsearch with every request. These
   * headers cannot be overwritten by client-side headers and aren't affected by
   * `requestHeadersWhitelist` configuration.
   */
  constructor(rawConfig) {
    _defineProperty(this, "healthCheckDelay", void 0);

    _defineProperty(this, "ignoreVersionMismatch", void 0);

    _defineProperty(this, "apiVersion", void 0);

    _defineProperty(this, "hosts", void 0);

    _defineProperty(this, "requestHeadersWhitelist", void 0);

    _defineProperty(this, "pingTimeout", void 0);

    _defineProperty(this, "requestTimeout", void 0);

    _defineProperty(this, "shardTimeout", void 0);

    _defineProperty(this, "sniffOnStart", void 0);

    _defineProperty(this, "sniffInterval", void 0);

    _defineProperty(this, "sniffOnConnectionFault", void 0);

    _defineProperty(this, "username", void 0);

    _defineProperty(this, "password", void 0);

    _defineProperty(this, "ssl", void 0);

    _defineProperty(this, "customHeaders", void 0);

    this.ignoreVersionMismatch = rawConfig.ignoreVersionMismatch;
    this.apiVersion = rawConfig.apiVersion;
    this.hosts = Array.isArray(rawConfig.hosts) ? rawConfig.hosts : [rawConfig.hosts];
    this.requestHeadersWhitelist = Array.isArray(rawConfig.requestHeadersWhitelist) ? rawConfig.requestHeadersWhitelist : [rawConfig.requestHeadersWhitelist];
    this.pingTimeout = rawConfig.pingTimeout;
    this.requestTimeout = rawConfig.requestTimeout;
    this.shardTimeout = rawConfig.shardTimeout;
    this.sniffOnStart = rawConfig.sniffOnStart;
    this.sniffOnConnectionFault = rawConfig.sniffOnConnectionFault;
    this.sniffInterval = rawConfig.sniffInterval;
    this.healthCheckDelay = rawConfig.healthCheck.delay;
    this.username = rawConfig.username;
    this.password = rawConfig.password;
    this.customHeaders = rawConfig.customHeaders;
    const {
      alwaysPresentCertificate,
      verificationMode
    } = rawConfig.ssl;
    const {
      key,
      keyPassphrase,
      certificate,
      certificateAuthorities
    } = readKeyAndCerts(rawConfig);
    this.ssl = {
      alwaysPresentCertificate,
      key,
      keyPassphrase,
      certificate,
      certificateAuthorities,
      verificationMode
    };
  }

}

exports.ElasticsearchConfig = ElasticsearchConfig;

const readKeyAndCerts = rawConfig => {
  var _rawConfig$ssl$keysto, _rawConfig$ssl$trusts;

  let key;
  let keyPassphrase;
  let certificate;
  let certificateAuthorities;

  const addCAs = ca => {
    if (ca && ca.length) {
      certificateAuthorities = [...(certificateAuthorities || []), ...ca];
    }
  };

  if ((_rawConfig$ssl$keysto = rawConfig.ssl.keystore) !== null && _rawConfig$ssl$keysto !== void 0 && _rawConfig$ssl$keysto.path) {
    const keystore = (0, _utils.readPkcs12Keystore)(rawConfig.ssl.keystore.path, rawConfig.ssl.keystore.password);

    if (!keystore.key) {
      throw new Error(`Did not find key in Elasticsearch keystore.`);
    } else if (!keystore.cert) {
      throw new Error(`Did not find certificate in Elasticsearch keystore.`);
    }

    key = keystore.key;
    certificate = keystore.cert;
    addCAs(keystore.ca);
  } else {
    if (rawConfig.ssl.key) {
      key = readFile(rawConfig.ssl.key);
      keyPassphrase = rawConfig.ssl.keyPassphrase;
    }

    if (rawConfig.ssl.certificate) {
      certificate = readFile(rawConfig.ssl.certificate);
    }
  }

  if ((_rawConfig$ssl$trusts = rawConfig.ssl.truststore) !== null && _rawConfig$ssl$trusts !== void 0 && _rawConfig$ssl$trusts.path) {
    const ca = (0, _utils.readPkcs12Truststore)(rawConfig.ssl.truststore.path, rawConfig.ssl.truststore.password);
    addCAs(ca);
  }

  const ca = rawConfig.ssl.certificateAuthorities;

  if (ca) {
    const parsed = [];
    const paths = Array.isArray(ca) ? ca : [ca];

    if (paths.length > 0) {
      for (const path of paths) {
        parsed.push(readFile(path));
      }

      addCAs(parsed);
    }
  }

  return {
    key,
    keyPassphrase,
    certificate,
    certificateAuthorities
  };
};

const readFile = file => {
  return (0, _fs.readFileSync)(file, 'utf8');
};