"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchStrategyRegistry = void 0;

var _extract_index_patterns = require("../../../common/extract_index_patterns");

var _strategies = require("./strategies");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SearchStrategyRegistry {
  constructor() {
    _defineProperty(this, "strategies", []);
  }

  addStrategy(searchStrategy) {
    if (searchStrategy instanceof _strategies.AbstractSearchStrategy) {
      this.strategies.unshift(searchStrategy);
    }

    return this.strategies;
  }

  async getViableStrategy(req, indexPattern) {
    for (const searchStrategy of this.strategies) {
      const {
        isViable,
        capabilities
      } = await searchStrategy.checkForViability(req, indexPattern);

      if (isViable) {
        return {
          searchStrategy,
          capabilities
        };
      }
    }
  }

  async getViableStrategyForPanel(req, panel) {
    const indexPattern = (0, _extract_index_patterns.extractIndexPatterns)(panel, panel.default_index_pattern).join(',');
    return this.getViableStrategy(req, indexPattern);
  }

}

exports.SearchStrategyRegistry = SearchStrategyRegistry;