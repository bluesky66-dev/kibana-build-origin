"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpConfig = exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

var _os = require("os");

var _url = _interopRequireDefault(require("url"));

var _csp = require("../csp");

var _ssl_config = require("./ssl_config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const validBasePathRegex = /^\/.*[^\/]$/;
const uuidRegexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const hostURISchema = _configSchema.schema.uri({
  scheme: ['http', 'https']
});

const match = (regex, errorMsg) => str => regex.test(str) ? undefined : errorMsg; // before update to make sure it's in sync with validation rules in Legacy
// https://github.com/elastic/kibana/blob/master/src/legacy/server/config/schema.js


const config = {
  path: 'server',
  schema: _configSchema.schema.object({
    name: _configSchema.schema.string({
      defaultValue: () => (0, _os.hostname)()
    }),
    autoListen: _configSchema.schema.boolean({
      defaultValue: true
    }),
    publicBaseUrl: _configSchema.schema.maybe(_configSchema.schema.uri({
      scheme: ['http', 'https']
    })),
    basePath: _configSchema.schema.maybe(_configSchema.schema.string({
      validate: match(validBasePathRegex, "must start with a slash, don't end with one")
    })),
    cors: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: false
      }),
      allowCredentials: _configSchema.schema.boolean({
        defaultValue: false
      }),
      allowOrigin: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(hostURISchema, {
        minSize: 1
      }), _configSchema.schema.arrayOf(_configSchema.schema.literal('*'), {
        minSize: 1,
        maxSize: 1
      })], {
        defaultValue: ['*']
      })
    }, {
      validate(value) {
        if (value.allowCredentials === true && value.allowOrigin.includes('*')) {
          return 'Cannot specify wildcard origin "*" with "credentials: true". Please provide a list of allowed origins.';
        }
      }

    }),
    customResponseHeaders: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
      defaultValue: {}
    }),
    host: _configSchema.schema.string({
      defaultValue: 'localhost',
      hostname: true
    }),
    maxPayload: _configSchema.schema.byteSize({
      defaultValue: '1048576b'
    }),
    port: _configSchema.schema.number({
      defaultValue: 5601
    }),
    rewriteBasePath: _configSchema.schema.boolean({
      defaultValue: false
    }),
    ssl: _ssl_config.sslSchema,
    keepaliveTimeout: _configSchema.schema.number({
      defaultValue: 120000
    }),
    socketTimeout: _configSchema.schema.number({
      defaultValue: 120000
    }),
    compression: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      referrerWhitelist: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string({
        hostname: true
      }), {
        minSize: 1
      }))
    }),
    uuid: _configSchema.schema.maybe(_configSchema.schema.string({
      validate: match(uuidRegexp, 'must be a valid uuid')
    })),
    xsrf: _configSchema.schema.object({
      disableProtection: _configSchema.schema.boolean({
        defaultValue: false
      }),
      allowlist: _configSchema.schema.arrayOf(_configSchema.schema.string({
        validate: match(/^\//, 'must start with a slash')
      }), {
        defaultValue: []
      })
    }),
    requestId: _configSchema.schema.object({
      allowFromAnyIp: _configSchema.schema.boolean({
        defaultValue: false
      }),
      ipAllowlist: _configSchema.schema.arrayOf(_configSchema.schema.ip(), {
        defaultValue: []
      })
    }, {
      validate(value) {
        var _value$ipAllowlist;

        if (value.allowFromAnyIp === true && ((_value$ipAllowlist = value.ipAllowlist) === null || _value$ipAllowlist === void 0 ? void 0 : _value$ipAllowlist.length) > 0) {
          return `allowFromAnyIp must be set to 'false' if any values are specified in ipAllowlist`;
        }
      }

    })
  }, {
    validate: rawConfig => {
      if (!rawConfig.basePath && rawConfig.rewriteBasePath) {
        return 'cannot use [rewriteBasePath] when [basePath] is not specified';
      }

      if (rawConfig.publicBaseUrl) {
        var _rawConfig$basePath;

        const parsedUrl = _url.default.parse(rawConfig.publicBaseUrl);

        if (parsedUrl.query || parsedUrl.hash || parsedUrl.auth) {
          return `[publicBaseUrl] may only contain a protocol, host, port, and pathname`;
        }

        if (parsedUrl.path !== ((_rawConfig$basePath = rawConfig.basePath) !== null && _rawConfig$basePath !== void 0 ? _rawConfig$basePath : '/')) {
          return `[publicBaseUrl] must contain the [basePath]: ${parsedUrl.path} !== ${rawConfig.basePath}`;
        }
      }

      if (!rawConfig.compression.enabled && rawConfig.compression.referrerWhitelist) {
        return 'cannot use [compression.referrerWhitelist] when [compression.enabled] is set to false';
      }

      if (rawConfig.ssl.enabled && rawConfig.ssl.redirectHttpFromPort !== undefined && rawConfig.ssl.redirectHttpFromPort === rawConfig.port) {
        return 'Kibana does not accept http traffic to [port] when ssl is ' + 'enabled (only https is allowed), so [ssl.redirectHttpFromPort] ' + `cannot be configured to the same value. Both are [${rawConfig.port}].`;
      }
    }
  })
};
exports.config = config;

class HttpConfig {
  /**
   * @internal
   */
  constructor(rawHttpConfig, rawCspConfig, rawExternalUrlConfig) {
    var _rawHttpConfig$custom;

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "autoListen", void 0);

    _defineProperty(this, "host", void 0);

    _defineProperty(this, "keepaliveTimeout", void 0);

    _defineProperty(this, "socketTimeout", void 0);

    _defineProperty(this, "port", void 0);

    _defineProperty(this, "cors", void 0);

    _defineProperty(this, "customResponseHeaders", void 0);

    _defineProperty(this, "maxPayload", void 0);

    _defineProperty(this, "basePath", void 0);

    _defineProperty(this, "publicBaseUrl", void 0);

    _defineProperty(this, "rewriteBasePath", void 0);

    _defineProperty(this, "ssl", void 0);

    _defineProperty(this, "compression", void 0);

    _defineProperty(this, "csp", void 0);

    _defineProperty(this, "externalUrl", void 0);

    _defineProperty(this, "xsrf", void 0);

    _defineProperty(this, "requestId", void 0);

    this.autoListen = rawHttpConfig.autoListen; // TODO: Consider dropping support for '0' in v8.0.0. This value is passed
    // to hapi, which validates it. Prior to hapi v20, '0' was considered a
    // valid host, however the validation logic internally in hapi was
    // re-written for v20 and hapi no longer considers '0' a valid host. For
    // details, see:
    // https://github.com/elastic/kibana/issues/86716#issuecomment-749623781

    this.host = rawHttpConfig.host === '0' ? '0.0.0.0' : rawHttpConfig.host;
    this.port = rawHttpConfig.port;
    this.cors = rawHttpConfig.cors;
    this.customResponseHeaders = Object.entries((_rawHttpConfig$custom = rawHttpConfig.customResponseHeaders) !== null && _rawHttpConfig$custom !== void 0 ? _rawHttpConfig$custom : {}).reduce((headers, [key, value]) => {
      return { ...headers,
        [key]: Array.isArray(value) ? value.map(e => convertHeader(e)) : convertHeader(value)
      };
    }, {});
    this.maxPayload = rawHttpConfig.maxPayload;
    this.name = rawHttpConfig.name;
    this.basePath = rawHttpConfig.basePath;
    this.publicBaseUrl = rawHttpConfig.publicBaseUrl;
    this.keepaliveTimeout = rawHttpConfig.keepaliveTimeout;
    this.socketTimeout = rawHttpConfig.socketTimeout;
    this.rewriteBasePath = rawHttpConfig.rewriteBasePath;
    this.ssl = new _ssl_config.SslConfig(rawHttpConfig.ssl || {});
    this.compression = rawHttpConfig.compression;
    this.csp = new _csp.CspConfig(rawCspConfig);
    this.externalUrl = rawExternalUrlConfig;
    this.xsrf = rawHttpConfig.xsrf;
    this.requestId = rawHttpConfig.requestId;
  }

}

exports.HttpConfig = HttpConfig;

const convertHeader = entry => {
  return typeof entry === 'object' ? JSON.stringify(entry) : String(entry);
};