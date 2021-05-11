"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrations730 = void 0;

var _util = require("util");

var _is_dashboard_doc = require("./is_dashboard_doc");

var _move_filters_to_query = require("./move_filters_to_query");

var _common = require("../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const migrations730 = (doc, {
  log
}) => {
  if (!(0, _is_dashboard_doc.isDashboardDoc)(doc)) {
    // NOTE: we should probably throw an error here... but for now following suit and in the
    // case of errors, just returning the same document.
    return doc;
  }

  try {
    const searchSource = JSON.parse(doc.attributes.kibanaSavedObjectMeta.searchSourceJSON);
    doc.attributes.kibanaSavedObjectMeta.searchSourceJSON = JSON.stringify((0, _move_filters_to_query.moveFiltersToQuery)(searchSource));
  } catch (e) {
    log.warning(`Exception @ migrations730 while trying to migrate dashboard query filters!\n` + `${e.stack}\n` + `dashboard: ${(0, _util.inspect)(doc, false, null)}`);
    return doc;
  }

  let uiState = {}; // Ignore errors, at some point uiStateJSON stopped being used, so it may not exist.

  if (doc.attributes.uiStateJSON && doc.attributes.uiStateJSON !== '') {
    uiState = JSON.parse(doc.attributes.uiStateJSON);
  }

  try {
    const panels = JSON.parse(doc.attributes.panelsJSON);
    doc.attributes.panelsJSON = JSON.stringify((0, _common.migratePanelsTo730)(panels, '7.3.0', doc.attributes.useMargins === undefined ? true : doc.attributes.useMargins, uiState));
    delete doc.attributes.uiStateJSON;
  } catch (e) {
    log.warning(`Exception @ migrations730 while trying to migrate dashboard panels!\n` + `Error: ${e.stack}\n` + `dashboard: ${(0, _util.inspect)(doc, false, null)}`);
    return doc;
  }

  return doc;
};

exports.migrations730 = migrations730;