"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OptionedParamType = void 0;

var _base = require("./base");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OptionedParamType extends _base.BaseParamType {
  constructor(config) {
    super(config);

    _defineProperty(this, "options", void 0);

    if (!config.write) {
      this.write = (aggConfig, output) => {
        output.params[this.name] = aggConfig.params[this.name].value;
      };
    }

    if (!config.serialize) {
      this.serialize = selected => {
        return selected.value;
      };
    }

    if (!config.deserialize) {
      this.deserialize = value => {
        return this.options.find(option => option.value === value);
      };
    }

    this.options = config.options || [];
  }

}

exports.OptionedParamType = OptionedParamType;