"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createScalarToDateArrayValueResolvers = exports.toDateArrayScalar = void 0;

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


const toDateArrayScalar = new _graphql.GraphQLScalarType({
  name: 'DateArray',
  description: 'Represents value in detail item from the timeline who wants to more than one type',

  serialize(value) {
    if (value == null) {
      return null;
    } else if (Array.isArray(value)) {
      return convertArrayToDate(value);
    } else if ((0, _fp.isBoolean)(value) || (0, _fp.isString)(value) || (0, _fp.isObject)(value)) {
      return [convertToDate(value)];
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

      case _graphql.Kind.STRING:
        return ast.value;
    }

    return null;
  }

});
exports.toDateArrayScalar = toDateArrayScalar;

const createScalarToDateArrayValueResolvers = () => ({
  ToDateArray: toDateArrayScalar
});

exports.createScalarToDateArrayValueResolvers = createScalarToDateArrayValueResolvers;

const convertToDate = value => {
  if ((0, _fp.isNumber)(value)) {
    return new Date(value).toISOString();
  } else if ((0, _fp.isObject)(value)) {
    return 'invalid date';
  } else if ((0, _fp.isString)(value) && !isNaN(+value)) {
    return new Date(+value).toISOString();
  } else {
    return String(value);
  }
}; // eslint-disable-next-line @typescript-eslint/no-explicit-any


const convertArrayToDate = values => {
  if (Array.isArray(values)) {
    return values.filter(item => item != null).map(item => convertArrayToDate(item));
  }

  return convertToDate(values);
};