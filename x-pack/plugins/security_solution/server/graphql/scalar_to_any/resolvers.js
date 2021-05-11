"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createScalarToAnyValueResolvers = exports.toAnyScalar = void 0;

var _fp = require("lodash/fp");

var _graphql = require("graphql");
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


const toAnyScalar = new _graphql.GraphQLScalarType({
  name: 'Any',
  description: 'Represents any type',

  serialize(value) {
    if (value == null) {
      return null;
    }

    try {
      const maybeObj = JSON.parse(value);

      if ((0, _fp.isObject)(maybeObj)) {
        return maybeObj;
      } else {
        return value;
      }
    } catch (e) {
      return value;
    }
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
exports.toAnyScalar = toAnyScalar;

const createScalarToAnyValueResolvers = () => ({
  ToAny: toAnyScalar
});

exports.createScalarToAnyValueResolvers = createScalarToAnyValueResolvers;