"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createScalarToStringArrayValueResolvers = exports.toStringArrayNoNullableScalar = exports.toStringArrayScalar = void 0;

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


const toStringArrayScalar = new _graphql.GraphQLScalarType({
  name: 'StringArray',
  description: 'Represents value in detail item from the timeline who wants to more than one type',

  serialize(value) {
    if (value == null) {
      return null;
    } else if (Array.isArray(value)) {
      return convertArrayToString(value);
    } else if ((0, _fp.isBoolean)(value) || (0, _fp.isNumber)(value) || (0, _fp.isObject)(value)) {
      return [convertToString(value)];
    }

    return [value];
  },

  parseValue(value) {
    return value;
  },

  parseLiteral(ast) {
    switch (ast.kind) {
      case _graphql.Kind.INT:
        return parseInt(ast.value, 10);

      case _graphql.Kind.FLOAT:
        return parseFloat(ast.value);

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
exports.toStringArrayScalar = toStringArrayScalar;
const toStringArrayNoNullableScalar = new _graphql.GraphQLScalarType({
  name: 'StringArray',
  description: 'Represents value in detail item from the timeline who wants to more than one type',

  serialize(value) {
    if (value == null) {
      return undefined;
    } else if (Array.isArray(value)) {
      return convertArrayToString(value);
    } else if ((0, _fp.isBoolean)(value) || (0, _fp.isNumber)(value) || (0, _fp.isObject)(value)) {
      return [convertToString(value)];
    }

    return [value];
  },

  parseValue(value) {
    return value;
  },

  parseLiteral(ast) {
    switch (ast.kind) {
      case _graphql.Kind.INT:
        return parseInt(ast.value, 10);

      case _graphql.Kind.FLOAT:
        return parseFloat(ast.value);

      case _graphql.Kind.STRING:
        return ast.value;

      case _graphql.Kind.LIST:
        return ast.values;

      case _graphql.Kind.OBJECT:
        return ast.fields;
    }

    return undefined;
  }

});
exports.toStringArrayNoNullableScalar = toStringArrayNoNullableScalar;

const createScalarToStringArrayValueResolvers = () => ({
  ToStringArray: toStringArrayScalar,
  ToStringArrayNoNullable: toStringArrayNoNullableScalar
});

exports.createScalarToStringArrayValueResolvers = createScalarToStringArrayValueResolvers;

const convertToString = value => {
  if ((0, _fp.isObject)(value)) {
    try {
      return JSON.stringify(value);
    } catch (_) {
      return 'Invalid Object';
    }
  }

  return value.toString();
}; // eslint-disable-next-line @typescript-eslint/no-explicit-any


const convertArrayToString = values => {
  if (Array.isArray(values)) {
    return values.filter(item => item != null).map(item => convertArrayToString(item));
  }

  return convertToString(values);
};