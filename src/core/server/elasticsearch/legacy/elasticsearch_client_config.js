"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseElasticsearchClientConfig = parseElasticsearchClientConfig;

var _lodash = require("lodash");

var _url = _interopRequireDefault(require("url"));

var _std = require("@kbn/std");

var _default_headers = require("../default_headers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
function parseElasticsearchClientConfig(config, log, type, {
  ignoreCertAndKey = false,
  auth = true
} = {}) {
  const esClientConfig = {
    keepAlive: true,
    ...(0, _std.pick)(config, ['apiVersion', 'sniffOnStart', 'sniffOnConnectionFault', 'keepAlive', 'log', 'plugins'])
  };

  if (esClientConfig.log == null) {
    esClientConfig.log = getLoggerClass(log, type);
  }

  if (config.pingTimeout != null) {
    esClientConfig.pingTimeout = getDurationAsMs(config.pingTimeout);
  }

  if (config.requestTimeout != null) {
    esClientConfig.requestTimeout = getDurationAsMs(config.requestTimeout);
  }

  if (config.sniffInterval) {
    esClientConfig.sniffInterval = getDurationAsMs(config.sniffInterval);
  }

  const needsAuth = auth !== false && config.username && config.password;

  if (needsAuth) {
    esClientConfig.httpAuth = `${config.username}:${config.password}`;
  }

  if (Array.isArray(config.hosts)) {
    esClientConfig.hosts = config.hosts.map(nodeUrl => {
      const uri = _url.default.parse(nodeUrl);

      const httpsURI = uri.protocol === 'https:';
      const httpURI = uri.protocol === 'http:';
      const host = {
        host: uri.hostname,
        port: uri.port || httpsURI && '443' || httpURI && '80',
        protocol: uri.protocol,
        path: uri.pathname,
        query: uri.query,
        headers: { ..._default_headers.DEFAULT_HEADERS,
          ...config.customHeaders
        }
      };
      return host;
    });
  }

  if (config.ssl === undefined) {
    return (0, _lodash.cloneDeep)(esClientConfig);
  }

  esClientConfig.ssl = {};
  const verificationMode = config.ssl.verificationMode;

  switch (verificationMode) {
    case 'none':
      esClientConfig.ssl.rejectUnauthorized = false;
      break;

    case 'certificate':
      esClientConfig.ssl.rejectUnauthorized = true; // by default, NodeJS is checking the server identify

      esClientConfig.ssl.checkServerIdentity = () => undefined;

      break;

    case 'full':
      esClientConfig.ssl.rejectUnauthorized = true;
      break;

    default:
      throw new Error(`Unknown ssl verificationMode: ${verificationMode}`);
  }

  esClientConfig.ssl.ca = config.ssl.certificateAuthorities; // Add client certificate and key if required by elasticsearch

  if (!ignoreCertAndKey && config.ssl.certificate && config.ssl.key) {
    esClientConfig.ssl.cert = config.ssl.certificate;
    esClientConfig.ssl.key = config.ssl.key;
    esClientConfig.ssl.passphrase = config.ssl.keyPassphrase;
  } // Elasticsearch JS client mutates config object, so all properties that are
  // usually passed by reference should be cloned to avoid any side effects.


  return (0, _lodash.cloneDeep)(esClientConfig);
}

function getDurationAsMs(duration) {
  if (typeof duration === 'number') {
    return duration;
  }

  return duration.asMilliseconds();
}

function getLoggerClass(log, type) {
  const queryLogger = log.get('query', type);
  return class ElasticsearchClientLogging {
    error(err) {
      log.error(err);
    }

    warning(message) {
      log.warn(message);
    }

    trace(method, options, query, _, statusCode) {
      queryLogger.debug(`${statusCode}\n${method} ${options.path}\n${query ? query.trim() : ''}`);
    } // elasticsearch-js expects the following functions to exist


    info() {// noop
    }

    debug() {// noop
    }

    close() {// noop
    }

  };
}