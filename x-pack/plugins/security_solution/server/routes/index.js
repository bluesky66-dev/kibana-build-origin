"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRoutes = void 0;

var _create_rules_route = require("../lib/detection_engine/routes/rules/create_rules_route");

var _create_index_route = require("../lib/detection_engine/routes/index/create_index_route");

var _read_index_route = require("../lib/detection_engine/routes/index/read_index_route");

var _read_rules_route = require("../lib/detection_engine/routes/rules/read_rules_route");

var _find_rules_route = require("../lib/detection_engine/routes/rules/find_rules_route");

var _delete_rules_route = require("../lib/detection_engine/routes/rules/delete_rules_route");

var _update_rules_route = require("../lib/detection_engine/routes/rules/update_rules_route");

var _patch_rules_route = require("../lib/detection_engine/routes/rules/patch_rules_route");

var _create_signals_migration_route = require("../lib/detection_engine/routes/signals/create_signals_migration_route");

var _delete_signals_migration_route = require("../lib/detection_engine/routes/signals/delete_signals_migration_route");

var _finalize_signals_migration_route = require("../lib/detection_engine/routes/signals/finalize_signals_migration_route");

var _get_signals_migration_status_route = require("../lib/detection_engine/routes/signals/get_signals_migration_status_route");

var _query_signals_route = require("../lib/detection_engine/routes/signals/query_signals_route");

var _open_close_signals_route = require("../lib/detection_engine/routes/signals/open_close_signals_route");

var _delete_index_route = require("../lib/detection_engine/routes/index/delete_index_route");

var _read_tags_route = require("../lib/detection_engine/routes/tags/read_tags_route");

var _read_privileges_route = require("../lib/detection_engine/routes/privileges/read_privileges_route");

var _add_prepackaged_rules_route = require("../lib/detection_engine/routes/rules/add_prepackaged_rules_route");

var _create_rules_bulk_route = require("../lib/detection_engine/routes/rules/create_rules_bulk_route");

var _update_rules_bulk_route = require("../lib/detection_engine/routes/rules/update_rules_bulk_route");

var _patch_rules_bulk_route = require("../lib/detection_engine/routes/rules/patch_rules_bulk_route");

var _delete_rules_bulk_route = require("../lib/detection_engine/routes/rules/delete_rules_bulk_route");

var _import_rules_route = require("../lib/detection_engine/routes/rules/import_rules_route");

var _export_rules_route = require("../lib/detection_engine/routes/rules/export_rules_route");

var _find_rules_status_route = require("../lib/detection_engine/routes/rules/find_rules_status_route");

var _get_prepackaged_rules_status_route = require("../lib/detection_engine/routes/rules/get_prepackaged_rules_status_route");

var _import_timelines_route = require("../lib/timeline/routes/import_timelines_route");

var _export_timelines_route = require("../lib/timeline/routes/export_timelines_route");

var _create_timelines_route = require("../lib/timeline/routes/create_timelines_route");

var _update_timelines_route = require("../lib/timeline/routes/update_timelines_route");

var _get_draft_timelines_route = require("../lib/timeline/routes/get_draft_timelines_route");

var _clean_draft_timelines_route = require("../lib/timeline/routes/clean_draft_timelines_route");

var _install_prepacked_timelines_route = require("../lib/timeline/routes/install_prepacked_timelines_route");

var _get_timeline_route = require("../lib/timeline/routes/get_timeline_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initRoutes = (router, config, hasEncryptionKey, security, ml) => {
  // Detection Engine Rule routes that have the REST endpoints of /api/detection_engine/rules
  // All REST rule creation, deletion, updating, etc......
  (0, _create_rules_route.createRulesRoute)(router, ml);
  (0, _read_rules_route.readRulesRoute)(router);
  (0, _update_rules_route.updateRulesRoute)(router, ml);
  (0, _patch_rules_route.patchRulesRoute)(router, ml);
  (0, _delete_rules_route.deleteRulesRoute)(router);
  (0, _find_rules_route.findRulesRoute)(router);
  (0, _add_prepackaged_rules_route.addPrepackedRulesRoute)(router, config, security);
  (0, _get_prepackaged_rules_status_route.getPrepackagedRulesStatusRoute)(router, config, security);
  (0, _create_rules_bulk_route.createRulesBulkRoute)(router, ml);
  (0, _update_rules_bulk_route.updateRulesBulkRoute)(router, ml);
  (0, _patch_rules_bulk_route.patchRulesBulkRoute)(router, ml);
  (0, _delete_rules_bulk_route.deleteRulesBulkRoute)(router);
  (0, _create_timelines_route.createTimelinesRoute)(router, config, security);
  (0, _update_timelines_route.updateTimelinesRoute)(router, config, security);
  (0, _import_rules_route.importRulesRoute)(router, config, ml);
  (0, _export_rules_route.exportRulesRoute)(router, config);
  (0, _import_timelines_route.importTimelinesRoute)(router, config, security);
  (0, _export_timelines_route.exportTimelinesRoute)(router, config, security);
  (0, _get_draft_timelines_route.getDraftTimelinesRoute)(router, config, security);
  (0, _get_timeline_route.getTimelineRoute)(router, config, security);
  (0, _clean_draft_timelines_route.cleanDraftTimelinesRoute)(router, config, security);
  (0, _install_prepacked_timelines_route.installPrepackedTimelinesRoute)(router, config, security);
  (0, _find_rules_status_route.findRulesStatusesRoute)(router); // Detection Engine Signals routes that have the REST endpoints of /api/detection_engine/signals
  // POST /api/detection_engine/signals/status
  // Example usage can be found in security_solution/server/lib/detection_engine/scripts/signals

  (0, _open_close_signals_route.setSignalsStatusRoute)(router);
  (0, _query_signals_route.querySignalsRoute)(router);
  (0, _get_signals_migration_status_route.getSignalsMigrationStatusRoute)(router);
  (0, _create_signals_migration_route.createSignalsMigrationRoute)(router, security);
  (0, _finalize_signals_migration_route.finalizeSignalsMigrationRoute)(router, security);
  (0, _delete_signals_migration_route.deleteSignalsMigrationRoute)(router, security); // Detection Engine index routes that have the REST endpoints of /api/detection_engine/index
  // All REST index creation, policy management for spaces

  (0, _create_index_route.createIndexRoute)(router);
  (0, _read_index_route.readIndexRoute)(router);
  (0, _delete_index_route.deleteIndexRoute)(router); // Detection Engine tags routes that have the REST endpoints of /api/detection_engine/tags

  (0, _read_tags_route.readTagsRoute)(router); // Privileges API to get the generic user privileges

  (0, _read_privileges_route.readPrivilegesRoute)(router, hasEncryptionKey);
};

exports.initRoutes = initRoutes;