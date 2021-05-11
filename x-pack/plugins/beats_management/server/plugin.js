"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BeatsManagementPlugin = void 0;

var _routes = require("./routes");

var _kibana = require("./lib/compose/kibana");

var _constants = require("../common/constants");

var _index_templates = require("./index_templates");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class BeatsManagementPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "securitySetup", void 0);

    _defineProperty(this, "beatsLibs", void 0);

    this.logger = initializerContext.logger.get();
  }

  setup(core, {
    features,
    security
  }) {
    this.securitySetup = security;
    const router = core.http.createRouter();
    (0, _routes.registerRoutes)(router);
    core.http.registerRouteHandlerContext('beatsManagement', (_, req) => {
      return this.beatsLibs;
    });
    features.registerElasticsearchFeature({
      id: 'beats_management',
      management: {
        ingest: ['beats_management']
      },
      privileges: [{
        ui: [],
        requiredClusterPrivileges: [],
        requiredRoles: ['beats_admin']
      }]
    });
    return {};
  }

  start({
    elasticsearch
  }, {
    licensing
  }) {
    const config = this.initializerContext.config.get();
    const logger = this.initializerContext.logger.get();
    const kibanaVersion = this.initializerContext.env.packageInfo.version;
    this.beatsLibs = (0, _kibana.compose)({
      elasticsearch,
      licensing,
      security: this.securitySetup,
      config,
      logger,
      kibanaVersion
    });
    this.beatsLibs.database.putTemplate(_constants.INDEX_NAMES.BEATS, _index_templates.beatsIndexTemplate).catch(e => {
      this.logger.error(`Error create beats template: ${e.message}`);
    });
    return {};
  }

}

exports.BeatsManagementPlugin = BeatsManagementPlugin;