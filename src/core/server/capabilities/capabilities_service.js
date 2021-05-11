"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CapabilitiesService = void 0;

var _merge_capabilities = require("./merge_capabilities");

var _resolve_capabilities = require("./resolve_capabilities");

var _routes = require("./routes");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const defaultCapabilities = {
  navLinks: {},
  management: {},
  catalogue: {}
};
/** @internal */

class CapabilitiesService {
  constructor(core) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "capabilitiesProviders", []);

    _defineProperty(this, "capabilitiesSwitchers", []);

    _defineProperty(this, "resolveCapabilities", void 0);

    this.logger = core.logger.get('capabilities-service');
    this.resolveCapabilities = (0, _resolve_capabilities.getCapabilitiesResolver)(() => (0, _merge_capabilities.mergeCapabilities)(defaultCapabilities, ...this.capabilitiesProviders.map(provider => provider())), () => this.capabilitiesSwitchers);
  }

  setup(setupDeps) {
    this.logger.debug('Setting up capabilities service');
    (0, _routes.registerRoutes)(setupDeps.http, this.resolveCapabilities);
    return {
      registerProvider: provider => {
        this.capabilitiesProviders.push(provider);
      },
      registerSwitcher: switcher => {
        this.capabilitiesSwitchers.push(switcher);
      }
    };
  }

  start() {
    return {
      resolveCapabilities: (request, options) => {
        var _options$useDefaultCa;

        return this.resolveCapabilities(request, [], (_options$useDefaultCa = options === null || options === void 0 ? void 0 : options.useDefaultCapabilities) !== null && _options$useDefaultCa !== void 0 ? _options$useDefaultCa : false);
      }
    };
  }

}

exports.CapabilitiesService = CapabilitiesService;