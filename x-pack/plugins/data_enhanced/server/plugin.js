"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = exports.EnhancedDataServerPlugin = void 0;

var _server = require("../../../../src/plugins/data/server");

var _common = require("../common");

var _routes = require("./routes");

var _saved_objects = require("./saved_objects");

var _search = require("./search");

var _ui_settings = require("./ui_settings");

var _collectors = require("./collectors");

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

class EnhancedDataServerPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "sessionService", void 0);

    _defineProperty(this, "config", void 0);

    this.logger = initializerContext.logger.get('data_enhanced');
    this.config = this.initializerContext.config.get();
  }

  setup(core, deps) {
    const usage = deps.usageCollection ? (0, _server.usageProvider)(core) : undefined;
    core.uiSettings.register((0, _ui_settings.getUiSettings)());
    core.savedObjects.registerType(_saved_objects.searchSessionMapping);
    deps.data.search.registerSearchStrategy(_common.ENHANCED_ES_SEARCH_STRATEGY, (0, _search.enhancedEsSearchStrategyProvider)(this.config, this.initializerContext.config.legacy.globalConfig$, this.logger, usage));
    deps.data.search.registerSearchStrategy(_common.EQL_SEARCH_STRATEGY, (0, _search.eqlSearchStrategyProvider)(this.logger));
    this.sessionService = new _search.SearchSessionService(this.logger, this.config, deps.security);

    deps.data.__enhance({
      search: {
        defaultStrategy: _common.ENHANCED_ES_SEARCH_STRATEGY,
        sessionService: this.sessionService
      }
    });

    const router = core.http.createRouter();
    (0, _routes.registerSessionRoutes)(router, this.logger);
    this.sessionService.setup(core, {
      taskManager: deps.taskManager
    });

    if (deps.usageCollection) {
      (0, _collectors.registerUsageCollector)(deps.usageCollection, this.initializerContext, this.logger);
    }
  }

  start(core, {
    taskManager
  }) {
    this.sessionService.start(core, {
      taskManager
    });
  }

  stop() {
    this.sessionService.stop();
  }

}

exports.Plugin = exports.EnhancedDataServerPlugin = EnhancedDataServerPlugin;