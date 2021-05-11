"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleExtensionsServerPlugin = void 0;

var _path = require("path");

var _js = require("./lib/spec_definitions/js");

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

const CONSOLE_XPACK_JSON_SPEC_PATH = (0, _path.join)(__dirname, 'lib/spec_definitions/json');

class ConsoleExtensionsServerPlugin {
  constructor(ctx) {
    this.ctx = ctx;

    _defineProperty(this, "log", void 0);

    this.log = this.ctx.logger.get();
  }

  setup(core, {
    console: {
      addExtensionSpecFilePath
    }
  }) {
    addExtensionSpecFilePath(CONSOLE_XPACK_JSON_SPEC_PATH);
    this.log.debug(`Added extension path to ${CONSOLE_XPACK_JSON_SPEC_PATH}...`);
  }

  start(core, {
    console: {
      addProcessorDefinition
    }
  }) {
    _js.processors.forEach(processor => addProcessorDefinition(processor));

    this.log.debug('Added processor definition extensions.');
  }

}

exports.ConsoleExtensionsServerPlugin = ConsoleExtensionsServerPlugin;