"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlobalSearchPlugin = void 0;

var _license_checker = require("../common/license_checker");

var _services = require("./services");

var _routes = require("./routes");

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

class GlobalSearchPlugin {
  constructor(context) {
    _defineProperty(this, "config", void 0);

    _defineProperty(this, "searchService", new _services.SearchService());

    _defineProperty(this, "searchServiceStart", void 0);

    _defineProperty(this, "licenseChecker", void 0);

    this.config = context.config.get();
  }

  setup(core) {
    const {
      registerResultProvider
    } = this.searchService.setup({
      basePath: core.http.basePath,
      config: this.config
    });
    (0, _routes.registerRoutes)(core.http.createRouter());
    core.http.registerRouteHandlerContext('globalSearch', (_, req) => {
      return {
        find: (term, options) => this.searchServiceStart.find(term, options, req),
        getSearchableTypes: () => this.searchServiceStart.getSearchableTypes(req)
      };
    });
    return {
      registerResultProvider
    };
  }

  start(core, {
    licensing
  }) {
    this.licenseChecker = new _license_checker.LicenseChecker(licensing.license$);
    this.searchServiceStart = this.searchService.start({
      core,
      licenseChecker: this.licenseChecker
    });
    return {
      find: this.searchServiceStart.find,
      getSearchableTypes: this.searchServiceStart.getSearchableTypes
    };
  }

  stop() {
    if (this.licenseChecker) {
      this.licenseChecker.clean();
    }
  }

}

exports.GlobalSearchPlugin = GlobalSearchPlugin;