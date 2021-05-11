"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createScalarDateResolvers = exports.dateScalar = void 0;

var _graphql = require("graphql");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const dateScalar = new _graphql.GraphQLScalarType({
  name: 'Date',
  description: 'Represents a Date for either an ES formatted date string or epoch string ISO8601 formatted',

  serialize(value) {
    return Number.isNaN(Date.parse(value)) ? new Date(value).toISOString() : value;
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
exports.dateScalar = dateScalar;

const createScalarDateResolvers = () => ({
  Date: dateScalar
});

exports.createScalarDateResolvers = createScalarDateResolvers;