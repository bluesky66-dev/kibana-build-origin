"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BannersPlugin = void 0;

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

class BannersPlugin {
  constructor(context) {
    _defineProperty(this, "config", void 0);

    this.config = convertConfig(context.config.get());
  }

  setup({
    uiSettings,
    getStartServices,
    http
  }) {
    const router = http.createRouter();
    (0, _routes.registerRoutes)(router, this.config);
    return {};
  }

  start() {
    return {};
  }

}

exports.BannersPlugin = BannersPlugin;

const convertConfig = raw => raw;