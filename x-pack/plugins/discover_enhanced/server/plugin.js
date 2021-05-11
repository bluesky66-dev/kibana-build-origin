"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiscoverEnhancedPlugin = void 0;

var _operators = require("rxjs/operators");

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

class DiscoverEnhancedPlugin {
  constructor(context) {
    this.context = context;

    _defineProperty(this, "config$", void 0);

    this.config$ = context.config.create();
  }

  setup(core, {
    usageCollection
  }) {
    if (!!usageCollection) {
      const collector = usageCollection.makeUsageCollector({
        type: 'discoverEnhanced',
        schema: {
          exploreDataInChartActionEnabled: {
            type: 'boolean'
          }
        },
        isReady: () => true,
        fetch: async () => {
          const config = await this.config$.pipe((0, _operators.take)(1)).toPromise();
          return {
            exploreDataInChartActionEnabled: config.actions.exploreDataInChart.enabled
          };
        }
      });
      usageCollection.registerCollector(collector);
    }
  }

  start(core) {}

}

exports.DiscoverEnhancedPlugin = DiscoverEnhancedPlugin;