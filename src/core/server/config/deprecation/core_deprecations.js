"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coreDeprecationProvider = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const configPathDeprecation = (settings, fromPath, log) => {
  if ((0, _lodash.has)(process.env, 'CONFIG_PATH')) {
    log(`Environment variable CONFIG_PATH is deprecated. It has been replaced with KBN_PATH_CONF pointing to a config folder`);
  }

  return settings;
};

const dataPathDeprecation = (settings, fromPath, log) => {
  if ((0, _lodash.has)(process.env, 'DATA_PATH')) {
    log(`Environment variable "DATA_PATH" will be removed.  It has been replaced with kibana.yml setting "path.data"`);
  }

  return settings;
};

const rewriteBasePathDeprecation = (settings, fromPath, log) => {
  if ((0, _lodash.has)(settings, 'server.basePath') && !(0, _lodash.has)(settings, 'server.rewriteBasePath')) {
    log('You should set server.basePath along with server.rewriteBasePath. Starting in 7.0, Kibana ' + 'will expect that all requests start with server.basePath rather than expecting you to rewrite ' + 'the requests in your reverse proxy. Set server.rewriteBasePath to false to preserve the ' + 'current behavior and silence this warning.');
  }

  return settings;
};

const rewriteCorsSettings = (settings, fromPath, log) => {
  const corsSettings = (0, _lodash.get)(settings, 'server.cors');

  if (typeof (0, _lodash.get)(settings, 'server.cors') === 'boolean') {
    log('"server.cors" is deprecated and has been replaced by "server.cors.enabled"');
    settings.server.cors = {
      enabled: corsSettings
    };
  }

  return settings;
};

const cspRulesDeprecation = (settings, fromPath, log) => {
  const NONCE_STRING = `{nonce}`; // Policies that should include the 'self' source

  const SELF_POLICIES = Object.freeze(['script-src', 'style-src']);
  const SELF_STRING = `'self'`;
  const rules = (0, _lodash.get)(settings, 'csp.rules');

  if (rules) {
    const parsed = new Map(rules.map(ruleStr => {
      const parts = ruleStr.split(/\s+/);
      return [parts[0], parts.slice(1)];
    }));
    settings.csp.rules = [...parsed].map(([policy, sourceList]) => {
      if (sourceList.find(source => source.includes(NONCE_STRING))) {
        log(`csp.rules no longer supports the {nonce} syntax. Replacing with 'self' in ${policy}`);
        sourceList = sourceList.filter(source => !source.includes(NONCE_STRING)); // Add 'self' if not present

        if (!sourceList.find(source => source.includes(SELF_STRING))) {
          sourceList.push(SELF_STRING);
        }
      }

      if (SELF_POLICIES.includes(policy) && !sourceList.find(source => source.includes(SELF_STRING))) {
        log(`csp.rules must contain the 'self' source. Automatically adding to ${policy}.`);
        sourceList.push(SELF_STRING);
      }

      return `${policy} ${sourceList.join(' ')}`.trim();
    });
  }

  return settings;
};

const mapManifestServiceUrlDeprecation = (settings, fromPath, log) => {
  if ((0, _lodash.has)(settings, 'map.manifestServiceUrl')) {
    log('You should no longer use the map.manifestServiceUrl setting in kibana.yml to configure the location ' + 'of the Elastic Maps Service settings. These settings have moved to the "map.emsTileApiUrl" and ' + '"map.emsFileApiUrl" settings instead. These settings are for development use only and should not be ' + 'modified for use in production environments.');
  }

  return settings;
};

const serverHostZeroDeprecation = (settings, fromPath, log) => {
  if ((0, _lodash.get)(settings, 'server.host') === '0') {
    log('Support for setting server.host to "0" in kibana.yml is deprecated and will be removed in Kibana version 8.0.0. ' + 'Instead use "0.0.0.0" to bind to all interfaces.');
  }

  return settings;
};

const opsLoggingEventDeprecation = (settings, fromPath, log) => {
  if ((0, _lodash.has)(settings, 'logging.events.ops')) {
    log('"logging.events.ops" has been deprecated and will be removed ' + 'in 8.0. To access ops data moving forward, please enable debug logs for the ' + '"metrics.ops" context in your logging configuration. For more details, see ' + 'https://github.com/elastic/kibana/blob/master/src/core/server/logging/README.md');
  }

  return settings;
};

const requestLoggingEventDeprecation = (settings, fromPath, log) => {
  if ((0, _lodash.has)(settings, 'logging.events.request') || (0, _lodash.has)(settings, 'logging.events.response')) {
    log('"logging.events.request" and "logging.events.response" have been deprecated and will be removed ' + 'in 8.0. To access request and/or response data moving forward, please enable debug logs for the ' + '"http.server.response" context in your logging configuration. For more details, see ' + 'https://github.com/elastic/kibana/blob/master/src/core/server/logging/README.md');
  }

  return settings;
};

const timezoneLoggingDeprecation = (settings, fromPath, log) => {
  if ((0, _lodash.has)(settings, 'logging.timezone')) {
    log('"logging.timezone" has been deprecated and will be removed ' + 'in 8.0. To set the timezone moving forward, please add a timezone date modifier to the log pattern ' + 'in your logging configuration. For more details, see ' + 'https://github.com/elastic/kibana/blob/master/src/core/server/logging/README.md');
  }

  return settings;
};

const coreDeprecationProvider = ({
  unusedFromRoot,
  renameFromRoot,
  rename
}) => [unusedFromRoot('savedObjects.indexCheckTimeout'), unusedFromRoot('server.xsrf.token'), unusedFromRoot('maps.manifestServiceUrl'), unusedFromRoot('optimize.lazy'), unusedFromRoot('optimize.lazyPort'), unusedFromRoot('optimize.lazyHost'), unusedFromRoot('optimize.lazyPrebuild'), unusedFromRoot('optimize.lazyProxyTimeout'), unusedFromRoot('optimize.enabled'), unusedFromRoot('optimize.bundleFilter'), unusedFromRoot('optimize.bundleDir'), unusedFromRoot('optimize.viewCaching'), unusedFromRoot('optimize.watch'), unusedFromRoot('optimize.watchPort'), unusedFromRoot('optimize.watchHost'), unusedFromRoot('optimize.watchPrebuild'), unusedFromRoot('optimize.watchProxyTimeout'), unusedFromRoot('optimize.useBundleCache'), unusedFromRoot('optimize.sourceMaps'), unusedFromRoot('optimize.workers'), unusedFromRoot('optimize.profile'), unusedFromRoot('optimize.validateSyntaxOfNodeModules'), renameFromRoot('xpack.xpack_main.telemetry.config', 'telemetry.config'), renameFromRoot('xpack.xpack_main.telemetry.url', 'telemetry.url'), renameFromRoot('xpack.xpack_main.telemetry.enabled', 'telemetry.enabled'), renameFromRoot('xpack.telemetry.enabled', 'telemetry.enabled'), renameFromRoot('xpack.telemetry.config', 'telemetry.config'), renameFromRoot('xpack.telemetry.banner', 'telemetry.banner'), renameFromRoot('xpack.telemetry.url', 'telemetry.url'), renameFromRoot('cpu.cgroup.path.override', 'ops.cGroupOverrides.cpuPath'), renameFromRoot('cpuacct.cgroup.path.override', 'ops.cGroupOverrides.cpuAcctPath'), renameFromRoot('server.xsrf.whitelist', 'server.xsrf.allowlist'), unusedFromRoot('elasticsearch.preserveHost'), unusedFromRoot('elasticsearch.startupTimeout'), rewriteCorsSettings, configPathDeprecation, dataPathDeprecation, rewriteBasePathDeprecation, cspRulesDeprecation, mapManifestServiceUrlDeprecation, serverHostZeroDeprecation, opsLoggingEventDeprecation, requestLoggingEventDeprecation, timezoneLoggingDeprecation];

exports.coreDeprecationProvider = coreDeprecationProvider;