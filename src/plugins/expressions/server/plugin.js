"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionsServerPlugin = void 0;

var _common = require("../common");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ExpressionsServerPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "expressions", new _common.ExpressionsService());
  }

  setup(core) {
    this.expressions.executor.extendContext({
      environment: 'server'
    });
    const setup = this.expressions.setup();
    return Object.freeze(setup);
  }

  start(core) {
    const start = this.expressions.start();
    return Object.freeze(start);
  }

  stop() {
    this.expressions.stop();
  }

}

exports.ExpressionsServerPlugin = ExpressionsServerPlugin;