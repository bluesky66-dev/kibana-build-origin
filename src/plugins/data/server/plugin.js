"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = exports.DataServerPlugin = void 0;

var _index_patterns = require("./index_patterns");

var _search_service = require("./search/search_service");

var _query_service = require("./query/query_service");

var _scripts = require("./scripts");

var _kql_telemetry = require("./kql_telemetry");

var _autocomplete = require("./autocomplete");

var _field_formats = require("./field_formats");

var _ui_settings = require("./ui_settings");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DataServerPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "searchService", void 0);

    _defineProperty(this, "scriptsService", void 0);

    _defineProperty(this, "kqlTelemetryService", void 0);

    _defineProperty(this, "autocompleteService", void 0);

    _defineProperty(this, "indexPatterns", new _index_patterns.IndexPatternsServiceProvider());

    _defineProperty(this, "fieldFormats", new _field_formats.FieldFormatsService());

    _defineProperty(this, "queryService", new _query_service.QueryService());

    _defineProperty(this, "logger", void 0);

    this.logger = initializerContext.logger.get('data');
    this.searchService = new _search_service.SearchService(initializerContext, this.logger);
    this.scriptsService = new _scripts.ScriptsService();
    this.kqlTelemetryService = new _kql_telemetry.KqlTelemetryService(initializerContext);
    this.autocompleteService = new _autocomplete.AutocompleteService(initializerContext);
  }

  setup(core, {
    bfetch,
    expressions,
    usageCollection
  }) {
    this.scriptsService.setup(core);
    this.queryService.setup(core);
    this.autocompleteService.setup(core);
    this.kqlTelemetryService.setup(core, {
      usageCollection
    });
    this.indexPatterns.setup(core, {
      expressions
    });
    core.uiSettings.register((0, _ui_settings.getUiSettings)());
    const searchSetup = this.searchService.setup(core, {
      bfetch,
      expressions,
      usageCollection
    });
    return {
      __enhance: enhancements => {
        searchSetup.__enhance(enhancements.search);
      },
      search: searchSetup,
      fieldFormats: this.fieldFormats.setup()
    };
  }

  start(core) {
    const fieldFormats = this.fieldFormats.start();
    const indexPatterns = this.indexPatterns.start(core, {
      fieldFormats,
      logger: this.logger.get('indexPatterns')
    });
    return {
      fieldFormats,
      indexPatterns,
      search: this.searchService.start(core, {
        fieldFormats,
        indexPatterns
      })
    };
  }

  stop() {
    this.searchService.stop();
  }

}

exports.Plugin = exports.DataServerPlugin = DataServerPlugin;