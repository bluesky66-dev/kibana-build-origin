"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initServer = void 0;

var _graphqlTools = require("graphql-tools");

var _graphql = require("./graphql");

var _ecs = require("./graphql/ecs");

var _hosts = require("./graphql/hosts");

var _note = require("./graphql/note");

var _pinned_event = require("./graphql/pinned_event");

var _scalar_date = require("./graphql/scalar_date");

var _scalar_to_any = require("./graphql/scalar_to_any");

var _scalar_to_boolean_array = require("./graphql/scalar_to_boolean_array");

var _scalar_to_date_array = require("./graphql/scalar_to_date_array");

var _scalar_to_number_array = require("./graphql/scalar_to_number_array");

var _source_status = require("./graphql/source_status");

var _sources = require("./graphql/sources");

var _timeline = require("./graphql/timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initServer = libs => {
  const schema = (0, _graphqlTools.makeExecutableSchema)({
    resolvers: [(0, _hosts.createHostsResolvers)(libs), (0, _note.createNoteResolvers)(libs), (0, _pinned_event.createPinnedEventResolvers)(libs), (0, _sources.createSourcesResolvers)(libs), (0, _ecs.createScalarToStringArrayValueResolvers)(), (0, _scalar_date.createScalarDateResolvers)(), (0, _scalar_to_date_array.createScalarToDateArrayValueResolvers)(), (0, _scalar_to_any.createScalarToAnyValueResolvers)(), (0, _scalar_to_boolean_array.createScalarToBooleanArrayValueResolvers)(), (0, _scalar_to_number_array.createScalarToNumberArrayValueResolvers)(), (0, _sources.createSourcesResolvers)(libs), (0, _source_status.createSourceStatusResolvers)(libs), (0, _timeline.createTimelineResolvers)(libs)],
    typeDefs: _graphql.schemas
  });
  libs.framework.registerGraphQLEndpoint('/api/solutions/security/graphql', schema);
};

exports.initServer = initServer;