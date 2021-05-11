"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOptionsPaginated = exports.createOptions = void 0;

var _fp = require("lodash/fp");

var _serialized_query = require("../serialized_query");

var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createOptions = (source, args, info, fieldReplacement = 'edges.node.') => {
  var _args$docValueFields;

  const fields = (0, _.getFields)((0, _fp.getOr)([], 'fieldNodes[0]', info));
  return {
    defaultIndex: args.defaultIndex,
    docValueFields: (_args$docValueFields = args.docValueFields) !== null && _args$docValueFields !== void 0 ? _args$docValueFields : [],
    sourceConfiguration: source.configuration,
    timerange: args.timerange,
    pagination: args.pagination,
    sortField: args.sortField,
    filterQuery: (0, _serialized_query.parseFilterQuery)(args.filterQuery || ''),
    fields: fields.filter(field => !field.includes('__typename')).map(field => field.replace(fieldReplacement, ''))
  };
};

exports.createOptions = createOptions;

const createOptionsPaginated = (source, args, info, fieldReplacement = 'edges.node.') => {
  var _args$docValueFields2;

  const fields = (0, _.getFields)((0, _fp.getOr)([], 'fieldNodes[0]', info));
  return {
    defaultIndex: args.defaultIndex,
    docValueFields: (_args$docValueFields2 = args.docValueFields) !== null && _args$docValueFields2 !== void 0 ? _args$docValueFields2 : [],
    sourceConfiguration: source.configuration,
    timerange: args.timerange,
    pagination: args.pagination,
    sortField: args.sortField,
    filterQuery: (0, _serialized_query.parseFilterQuery)(args.filterQuery || ''),
    fields: fields.filter(field => !field.includes('__typename')).map(field => field.replace(fieldReplacement, ''))
  };
};

exports.createOptionsPaginated = createOptionsPaginated;