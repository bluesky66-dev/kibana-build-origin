"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createScalarToIFieldSubTypeNonNullableScalarResolvers = exports.toIFieldSubTypeNonNullableScalar = exports.filterIndexes = exports.createSourceStatusResolvers = void 0;

var _graphql = require("graphql");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createSourceStatusResolvers = libs => ({
  SourceStatus: {
    async indicesExist(_, args, {
      req
    }) {
      const indexes = filterIndexes(args.defaultIndex);

      if (indexes.length !== 0) {
        return libs.sourceStatus.hasIndices(req, indexes);
      } else {
        return false;
      }
    },

    async indexFields(_, args, {
      req
    }) {
      const indexes = filterIndexes(args.defaultIndex);

      if (indexes.length !== 0) {
        return libs.fields.getFields(req, indexes);
      } else {
        return [];
      }
    }

  }
});
/**
 * Given a set of indexes this will remove anything that is:
 *   - blank or empty strings are removed as not valid indexes
 *   - _all is removed as that is not a valid index
 * @param indexes Indexes with invalid values removed
 */


exports.createSourceStatusResolvers = createSourceStatusResolvers;

const filterIndexes = indexes => indexes.filter(index => index.trim() !== '' && index.trim() !== '_all');

exports.filterIndexes = filterIndexes;
const toIFieldSubTypeNonNullableScalar = new _graphql.GraphQLScalarType({
  name: 'IFieldSubType',
  description: 'Represents value in index pattern field item',

  serialize(value) {
    var _value$multi, _value$nested;

    if (value == null) {
      return undefined;
    }

    return {
      multi: (_value$multi = value.multi) !== null && _value$multi !== void 0 ? _value$multi : undefined,
      nested: (_value$nested = value.nested) !== null && _value$nested !== void 0 ? _value$nested : undefined
    };
  },

  parseValue(value) {
    return value;
  },

  parseLiteral(ast) {
    switch (ast.kind) {
      case _graphql.Kind.INT:
        return undefined;

      case _graphql.Kind.FLOAT:
        return undefined;

      case _graphql.Kind.STRING:
        return undefined;

      case _graphql.Kind.LIST:
        return undefined;

      case _graphql.Kind.OBJECT:
        return ast;
    }

    return undefined;
  }

});
exports.toIFieldSubTypeNonNullableScalar = toIFieldSubTypeNonNullableScalar;

const createScalarToIFieldSubTypeNonNullableScalarResolvers = () => ({
  ToIFieldSubTypeNonNullable: toIFieldSubTypeNonNullableScalar
});

exports.createScalarToIFieldSubTypeNonNullableScalarResolvers = createScalarToIFieldSubTypeNonNullableScalarResolvers;