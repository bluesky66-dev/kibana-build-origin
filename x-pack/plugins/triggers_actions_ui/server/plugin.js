"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TriggersActionsPlugin = void 0;

var _data = require("./data");

var _health = require("./routes/health");

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

const BASE_ROUTE = '/api/triggers_actions_ui';

class TriggersActionsPlugin {
  constructor(ctx) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "data", void 0);

    this.logger = ctx.logger.get();
    this.data = (0, _data.getService)();
  }

  setup(core, plugins) {
    const router = core.http.createRouter();
    (0, _data.register)({
      logger: this.logger,
      data: this.data,
      router,
      baseRoute: BASE_ROUTE
    });
    (0, _health.createHealthRoute)(this.logger, router, BASE_ROUTE, plugins.alerts !== undefined);
  }

  start() {
    return {
      data: this.data
    };
  }

  async stop() {}

}

exports.TriggersActionsPlugin = TriggersActionsPlugin;