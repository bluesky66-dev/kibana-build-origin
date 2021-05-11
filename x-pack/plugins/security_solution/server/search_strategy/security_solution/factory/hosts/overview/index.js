"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostOverview = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../utils/build_query");

var _queryOverview_host = require("./query.overview_host.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const hostOverview = {
  buildDsl: options => (0, _queryOverview_host.buildOverviewHostQuery)(options),
  parse: async (options, response) => {
    const aggregations = (0, _fp.get)('aggregations', response.rawResponse) || {};
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryOverview_host.buildOverviewHostQuery)(options))]
    };
    return { ...response,
      inspect,
      overviewHost: {
        auditbeatAuditd: (0, _fp.getOr)(null, 'auditd_count.doc_count', aggregations),
        auditbeatFIM: (0, _fp.getOr)(null, 'fim_count.doc_count', aggregations),
        auditbeatLogin: (0, _fp.getOr)(null, 'system_module.login_count.doc_count', aggregations),
        auditbeatPackage: (0, _fp.getOr)(null, 'system_module.package_count.doc_count', aggregations),
        auditbeatProcess: (0, _fp.getOr)(null, 'system_module.process_count.doc_count', aggregations),
        auditbeatUser: (0, _fp.getOr)(null, 'system_module.user_count.doc_count', aggregations),
        endgameDns: (0, _fp.getOr)(null, 'endgame_module.dns_event_count.doc_count', aggregations),
        endgameFile: (0, _fp.getOr)(null, 'endgame_module.file_event_count.doc_count', aggregations),
        endgameImageLoad: (0, _fp.getOr)(null, 'endgame_module.image_load_event_count.doc_count', aggregations),
        endgameNetwork: (0, _fp.getOr)(null, 'endgame_module.network_event_count.doc_count', aggregations),
        endgameProcess: (0, _fp.getOr)(null, 'endgame_module.process_event_count.doc_count', aggregations),
        endgameRegistry: (0, _fp.getOr)(null, 'endgame_module.registry_event.doc_count', aggregations),
        endgameSecurity: (0, _fp.getOr)(null, 'endgame_module.security_event_count.doc_count', aggregations),
        filebeatSystemModule: (0, _fp.getOr)(null, 'system_module.filebeat_count.doc_count', aggregations),
        winlogbeatSecurity: (0, _fp.getOr)(null, 'winlog_module.security_event_count.doc_count', aggregations),
        winlogbeatMWSysmonOperational: (0, _fp.getOr)(null, 'winlog_module.mwsysmon_operational_event_count.doc_count', aggregations)
      }
    };
  }
};
exports.hostOverview = hostOverview;