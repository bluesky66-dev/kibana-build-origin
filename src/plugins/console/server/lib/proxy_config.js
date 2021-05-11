"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProxyConfig = void 0;

var _lodash = require("lodash");

var _url = require("url");

var _https = require("https");

var _wildcard_matcher = require("./wildcard_matcher");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ProxyConfig {
  // @ts-ignore
  constructor(config) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "matchers", void 0);

    _defineProperty(this, "timeout", void 0);

    _defineProperty(this, "sslAgent", void 0);

    _defineProperty(this, "verifySsl", void 0);

    config = { ...config
    }; // -----
    // read "match" info
    // -----

    const rawMatches = { ...config.match
    };
    this.id = (0, _url.format)({
      protocol: rawMatches.protocol,
      hostname: rawMatches.host,
      port: rawMatches.port,
      pathname: rawMatches.path
    }) || '*';
    this.matchers = {
      protocol: new _wildcard_matcher.WildcardMatcher(rawMatches.protocol),
      host: new _wildcard_matcher.WildcardMatcher(rawMatches.host),
      port: new _wildcard_matcher.WildcardMatcher(rawMatches.port),
      path: new _wildcard_matcher.WildcardMatcher(rawMatches.path, '/')
    }; // -----
    // read config vars
    // -----

    this.timeout = config.timeout;
    this.sslAgent = this._makeSslAgent(config);
  }

  _makeSslAgent(config) {
    const ssl = config.ssl || {};
    this.verifySsl = ssl.verify;
    const sslAgentOpts = {
      ca: ssl.ca,
      cert: ssl.cert,
      key: ssl.key
    };

    if ((0, _lodash.values)(sslAgentOpts).filter(Boolean).length) {
      sslAgentOpts.rejectUnauthorized = this.verifySsl == null ? true : this.verifySsl;
      return new _https.Agent(sslAgentOpts);
    }
  }

  getForParsedUri({
    protocol,
    hostname,
    port,
    pathname
  }) {
    let match = this.matchers.protocol.match(protocol.slice(0, -1));
    match = match && this.matchers.host.match(hostname);
    match = match && this.matchers.port.match(port);
    match = match && this.matchers.path.match(pathname);
    if (!match) return {};
    return {
      timeout: this.timeout,
      rejectUnauthorized: this.sslAgent ? undefined : this.verifySsl,
      agent: protocol === 'https:' ? this.sslAgent : undefined
    };
  }

}

exports.ProxyConfig = ProxyConfig;