"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutocompleteService = void 0;

var _routes = require("./routes");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AutocompleteService {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;

    _defineProperty(this, "valueSuggestionsEnabled", true);

    initializerContext.config.create().subscribe(configUpdate => {
      this.valueSuggestionsEnabled = configUpdate.autocomplete.valueSuggestions.enabled;
    });
  }

  setup(core) {
    if (this.valueSuggestionsEnabled) (0, _routes.registerRoutes)(core, this.initializerContext.config.legacy.globalConfig$);
  }

  start() {}

}

exports.AutocompleteService = AutocompleteService;