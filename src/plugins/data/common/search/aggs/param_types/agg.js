"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AggParamType = void 0;

var _agg_config = require("../agg_config");

var _base = require("./base");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AggParamType extends _base.BaseParamType {
  constructor(config) {
    super(config);

    _defineProperty(this, "makeAgg", void 0);

    _defineProperty(this, "allowedAggs", []);

    if (config.allowedAggs) {
      this.allowedAggs = config.allowedAggs;
    }

    if (!config.write) {
      this.write = (aggConfig, output) => {
        if (aggConfig.params[this.name] && aggConfig.params[this.name].length) {
          output.params[this.name] = aggConfig.params[this.name];
        }
      };
    }

    if (!config.serialize) {
      this.serialize = agg => {
        return agg.serialize();
      };
    }

    if (!config.deserialize) {
      this.deserialize = (state, agg) => {
        if (!agg) {
          throw new Error('aggConfig was not provided to AggParamType deserialize function');
        }

        return this.makeAgg(agg, state);
      };
    }

    if (!config.toExpressionAst) {
      this.toExpressionAst = agg => {
        if (!agg || !agg.toExpressionAst) {
          throw new Error('aggConfig was not provided to AggParamType toExpressionAst function');
        }

        return agg.toExpressionAst();
      };
    }

    this.makeAgg = config.makeAgg;
    this.valueType = _agg_config.AggConfig;
  }

}

exports.AggParamType = AggParamType;