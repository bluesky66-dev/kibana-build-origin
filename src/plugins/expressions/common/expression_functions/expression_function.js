"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionFunction = void 0;

var _lodash = require("lodash");

var _expression_function_parameter = require("./expression_function_parameter");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ExpressionFunction {
  /**
   * Name of function
   */

  /**
   * Aliases that can be used instead of `name`.
   */

  /**
   * Return type of function. This SHOULD be supplied. We use it for UI
   * and autocomplete hinting. We may also use it for optimizations in
   * the future.
   */

  /**
   * Function to run function (context, args)
   */

  /**
   * A short help text.
   */

  /**
   * Specification of expression function parameters.
   */

  /**
   * Type of inputs that this function supports.
   */
  constructor(functionDefinition) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "aliases", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "fn", void 0);

    _defineProperty(this, "help", void 0);

    _defineProperty(this, "args", {});

    _defineProperty(this, "inputTypes", void 0);

    _defineProperty(this, "disabled", void 0);

    _defineProperty(this, "telemetry", void 0);

    _defineProperty(this, "extract", void 0);

    _defineProperty(this, "inject", void 0);

    _defineProperty(this, "migrations", void 0);

    _defineProperty(this, "accepts", type => {
      // If you don't tell us input types, we'll assume you don't care what you get.
      if (!this.inputTypes) return true;
      return this.inputTypes.indexOf(type) > -1;
    });

    const {
      name,
      type: _type,
      aliases,
      fn,
      help,
      args,
      inputTypes,
      context,
      disabled,
      telemetry,
      inject,
      extract,
      migrations
    } = functionDefinition;
    this.name = name;
    this.type = _type;
    this.aliases = aliases || [];

    this.fn = (input, params, handlers) => Promise.resolve(fn(input, params, handlers));

    this.help = help || '';
    this.inputTypes = inputTypes || (context === null || context === void 0 ? void 0 : context.types);
    this.disabled = disabled || false;

    this.telemetry = telemetry || ((s, c) => c);

    this.inject = inject || _lodash.identity;

    this.extract = extract || (s => ({
      state: s,
      references: []
    }));

    this.migrations = migrations || {};

    for (const [key, arg] of Object.entries(args || {})) {
      this.args[key] = new _expression_function_parameter.ExpressionFunctionParameter(key, arg);
    }
  }

}

exports.ExpressionFunction = ExpressionFunction;