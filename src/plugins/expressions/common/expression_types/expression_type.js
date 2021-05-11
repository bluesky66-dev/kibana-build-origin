"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionType = void 0;

var _get_type = require("./get_type");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ExpressionType {
  /**
   * A short help text.
   */

  /**
   * Type validation, useful for checking function output.
   */

  /**
   * Optional serialization (used when passing context around client/server).
   */
  constructor(definition) {
    this.definition = definition;

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "help", void 0);

    _defineProperty(this, "validate", void 0);

    _defineProperty(this, "create", void 0);

    _defineProperty(this, "serialize", void 0);

    _defineProperty(this, "deserialize", void 0);

    _defineProperty(this, "getToFn", typeName => !this.definition.to ? undefined : this.definition.to[typeName] || this.definition.to['*']);

    _defineProperty(this, "getFromFn", typeName => !this.definition.from ? undefined : this.definition.from[typeName] || this.definition.from['*']);

    _defineProperty(this, "castsTo", value => typeof this.getToFn(value) === 'function');

    _defineProperty(this, "castsFrom", value => typeof this.getFromFn(value) === 'function');

    _defineProperty(this, "to", (value, toTypeName, types) => {
      const typeName = (0, _get_type.getType)(value);

      if (typeName !== this.name) {
        throw new Error(`Can not cast object of type '${typeName}' using '${this.name}'`);
      } else if (!this.castsTo(toTypeName)) {
        throw new Error(`Can not cast '${typeName}' to '${toTypeName}'`);
      }

      return this.getToFn(toTypeName)(value, types);
    });

    _defineProperty(this, "from", (value, types) => {
      const typeName = (0, _get_type.getType)(value);

      if (!this.castsFrom(typeName)) {
        throw new Error(`Can not cast '${this.name}' from ${typeName}`);
      }

      return this.getFromFn(typeName)(value, types);
    });

    const {
      name,
      help,
      deserialize,
      serialize,
      validate
    } = definition;
    this.name = name;
    this.help = help || '';

    this.validate = validate || (() => {}); // Optional


    this.create = definition.create;
    this.serialize = serialize;
    this.deserialize = deserialize;
  }

}

exports.ExpressionType = ExpressionType;