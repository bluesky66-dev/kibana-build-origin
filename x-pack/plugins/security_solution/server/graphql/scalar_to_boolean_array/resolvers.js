"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createScalarToBooleanArrayValueResolvers = exports.toBooleanArrayScalar = void 0;

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


const toBooleanArrayScalar = new _graphql.GraphQLScalarType({
  name: 'BooleanArray',
  description: 'Represents value in detail item from the timeline who wants to more than one type',

  serialize(value) {
    if (value == null) {
      return null;
    } else if (Array.isArray(value)) {
      return convertArrayToBoolean(value);
    } else if ((0, _fp.isString)(value) || (0, _fp.isObject)(value) || (0, _fp.isNumber)(value)) {
      return [convertToBoolean(value)];
    }

    return [value];
  },

  parseValue(value) {
    return value;
  },

  parseLiteral(ast) {
    switch (ast.kind) {
      case _graphql.Kind.BOOLEAN:
        return ast.value;

      case _graphql.Kind.INT:
        return ast.value;

      case _graphql.Kind.FLOAT:
        return ast.value;

      case _graphql.Kind.STRING:
        return ast.value;

      case _graphql.Kind.LIST:
        return ast.values;

      case _graphql.Kind.OBJECT:
        return ast.fields;
    }

    return null;
  }

});
exports.toBooleanArrayScalar = toBooleanArrayScalar;

const createScalarToBooleanArrayValueResolvers = () => ({
  ToBooleanArray: toBooleanArrayScalar
});

exports.createScalarToBooleanArrayValueResolvers = createScalarToBooleanArrayValueResolvers;

const convertToBoolean = value => {
  if ((0, _fp.isObject)(value)) {
    return false;
  } else if ((0, _fp.isString)(value)) {
    return value.toLowerCase() === 'true' || value.toLowerCase() === 't' ? true : false;
  } else {
    return Boolean(value);
  }
}; // eslint-disable-next-line @typescript-eslint/no-explicit-any


const convertArrayToBoolean = values => {
  if (Array.isArray(values)) {
    return values.filter(item => item != null).map(item => convertArrayToBoolean(item));
  }

  return convertToBoolean(values);
};