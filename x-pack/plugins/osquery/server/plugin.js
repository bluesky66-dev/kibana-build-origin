"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OsqueryPlugin = void 0;

var _create_config = require("./create_config");

var _routes = require("./routes");

var _osquery = require("./search_strategy/osquery");

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

class OsqueryPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;

    _defineProperty(this, "logger", void 0);

    this.logger = this.initializerContext.logger.get();
  }

  setup(core, plugins) {
    this.logger.debug('osquery: Setup');
    const config = (0, _create_config.createConfig)(this.initializerContext);

    if (!config.enabled) {
      return {};
    }

    const router = core.http.createRouter(); // Register server side APIs

    (0, _routes.defineRoutes)(router);
    core.getStartServices().then(([_, depsStart]) => {
      const osquerySearchStrategy = (0, _osquery.osquerySearchStrategyProvider)(depsStart.data);
      plugins.data.search.registerSearchStrategy('osquerySearchStrategy', osquerySearchStrategy);
    });
    return {};
  }

  start(core) {
    this.logger.debug('osquery: Started');
    return {};
  }

  stop() {}

}

exports.OsqueryPlugin = OsqueryPlugin;