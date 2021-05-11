"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHostsResolvers = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../utils/build_query");

var _create_options = require("../../utils/build_query/create_options");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createHostsResolvers = libs => ({
  Source: {
    async Hosts(source, args, {
      req
    }, info) {
      const options = { ...(0, _create_options.createOptionsPaginated)(source, args, info),
        sort: args.sort,
        defaultIndex: args.defaultIndex
      };
      return libs.hosts.getHosts(req, options);
    },

    async HostOverview(source, args, {
      req
    }, info) {
      const fields = (0, _build_query.getFields)((0, _fp.getOr)([], 'fieldNodes[0]', info));
      const options = {
        defaultIndex: args.defaultIndex,
        sourceConfiguration: source.configuration,
        fields: fields.map(field => field.replace('edges.node.', '')),
        hostName: args.hostName,
        timerange: args.timerange
      };
      return libs.hosts.getHostOverview(req, options);
    },

    async HostFirstLastSeen(source, args, {
      req
    }) {
      const options = {
        sourceConfiguration: source.configuration,
        hostName: args.hostName,
        defaultIndex: args.defaultIndex,
        docValueFields: args.docValueFields
      };
      return libs.hosts.getHostFirstLastSeen(req, options);
    }

  }
});

exports.createHostsResolvers = createHostsResolvers;