"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HomeServerPlugin = void 0;

var _services = require("./services");

var _capabilities_provider = require("./capabilities_provider");

var _saved_objects = require("./saved_objects");

var _routes = require("./routes");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HomeServerPlugin {
  constructor(initContext) {
    this.initContext = initContext;

    _defineProperty(this, "tutorialsRegistry", new _services.TutorialsRegistry());

    _defineProperty(this, "sampleDataRegistry", new _services.SampleDataRegistry(this.initContext));
  }

  setup(core, plugins) {
    core.capabilities.registerProvider(_capabilities_provider.capabilitiesProvider);
    core.savedObjects.registerType(_saved_objects.sampleDataTelemetry);
    const router = core.http.createRouter();
    (0, _routes.registerRoutes)(router);
    return {
      tutorials: { ...this.tutorialsRegistry.setup(core)
      },
      sampleData: { ...this.sampleDataRegistry.setup(core, plugins.usageCollection)
      }
    };
  }

  start() {
    return {
      tutorials: { ...this.tutorialsRegistry.start()
      },
      sampleData: { ...this.sampleDataRegistry.start()
      }
    };
  }

}
/** @public */


exports.HomeServerPlugin = HomeServerPlugin;