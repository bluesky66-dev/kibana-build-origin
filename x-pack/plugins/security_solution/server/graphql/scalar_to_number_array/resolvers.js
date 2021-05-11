"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createScalarToNumberArrayValueResolvers = exports.toNumberArrayScalar = void 0;

var _graphql = require("graphql");

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 *  serialize: gets invoked when serializing the result to send it back to a client.
 *
 *  parseValue: gets invoked to parse client input that was passed through variables.
 *
 *  parseLiteral: gets invoked to parse client input that was passed inline in the query.
 */


const toNumberArrayScalar = new _graphql.GraphQLScalarType({
  name: 'NumberArray',
  description: 'Represents value in detail item from the timeline who wants to more than one type',

  serialize(value) {
    if (value == null) {
      return null;
    } else if (Array.isArray(value)) {
      return convertArrayToNumber(value);
    } else if ((0, _fp.isBoolean)(value) || (0, _fp.isString)(value) || (0, _fp.isObject)(value)) {
      return [convertToNumber(value)];
    }

    return [value];
  },

  parseValue(value) {
    return value;
  },

  parseLiteral(ast) {
    switch (ast.kind) {
      case _graphql.Kind.INT:
        return ast.value;

      case _graphql.Kind.FLOAT:
        return ast.value;

      case _graphql.Kind.STRING:
        return parseFloat(ast.value);

      case _graphql.Kind.LIST:
        return ast.values;

      case _graphql.Kind.OBJECT:
        return ast.fields;
    }

    return null;
  }

});
exports.toNumberArrayScalar = toNumberArrayScalar;

const createScalarToNumberArrayValueResolvers = () => ({
  ToNumberArray: toNumberArrayScalar
});

exports.createScalarToNumberArrayValueResolvers = createScalarToNumberArrayValueResolvers;

const convertToNumber = value => {
  if ((0, _fp.isNumber)(value)) {
    return value;
  } else if ((0, _fp.isString)(value)) {
    return parseFloat(value);
  } else {
    return NaN;
  }
}; // eslint-disable-next-line @typescript-eslint/no-explicit-any


const convertArrayToNumber = values => {
  if (Array.isArray(values)) {
    return values.filter(item => item != null).map(item => convertArrayToNumber(item));
  }

  return convertToNumber(values);
};