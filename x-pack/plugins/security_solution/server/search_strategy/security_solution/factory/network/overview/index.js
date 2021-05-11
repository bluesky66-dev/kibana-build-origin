"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.networkOverview = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../utils/build_query");

var _queryOverview_network = require("./query.overview_network.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const networkOverview = {
  buildDsl: options => (0, _queryOverview_network.buildOverviewNetworkQuery)(options),
  parse: async (options, response) => {
    const aggregations = (0, _fp.get)('aggregations', response.rawResponse) || {};
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryOverview_network.buildOverviewNetworkQuery)(options))]
    };
    return { ...response,
      inspect,
      overviewNetwork: {
        auditbeatSocket: (0, _fp.getOr)(null, 'unique_socket_count.doc_count', aggregations),
        filebeatCisco: (0, _fp.getOr)(null, 'unique_filebeat_count.unique_cisco_count.doc_count', aggregations),
        filebeatNetflow: (0, _fp.getOr)(null, 'unique_filebeat_count.unique_netflow_count.doc_count', aggregations),
        filebeatPanw: (0, _fp.getOr)(null, 'unique_filebeat_count.unique_panw_count.doc_count', aggregations),
        filebeatSuricata: (0, _fp.getOr)(null, 'unique_suricata_count.doc_count', aggregations),
        filebeatZeek: (0, _fp.getOr)(null, 'unique_zeek_count.doc_count', aggregations),
        packetbeatDNS: (0, _fp.getOr)(null, 'unique_dns_count.doc_count', aggregations),
        packetbeatFlow: (0, _fp.getOr)(null, 'unique_flow_count.doc_count', aggregations),
        packetbeatTLS: (0, _fp.getOr)(null, 'unique_packetbeat_count.unique_tls_count.doc_count', aggregations)
      }
    };
  }
};
exports.networkOverview = networkOverview;