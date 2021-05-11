"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

var _kibana_framework = require("./lib/kibana_framework");

var _grokdebugger = require("./routes/api/grokdebugger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  })
};
exports.config = config;

class Plugin {
  setup(coreSetup, plugins) {
    const framework = new _kibana_framework.KibanaFramework(coreSetup);
    plugins.licensing.license$.subscribe(license => {
      framework.setLicense(license);
    });
    (0, _grokdebugger.registerGrokdebuggerRoutes)(framework);
  }

  start() {}

  stop() {}

}

exports.Plugin = Plugin;