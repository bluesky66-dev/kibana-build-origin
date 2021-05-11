"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportDashboards = exportDashboards;

var _collect_references_deep = require("./collect_references_deep");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function exportDashboards(ids, savedObjectsClient, kibanaVersion) {
  const objectsToExport = ids.map(id => ({
    id,
    type: 'dashboard'
  }));
  const objects = await (0, _collect_references_deep.collectReferencesDeep)(savedObjectsClient, objectsToExport);
  return {
    version: kibanaVersion,
    objects
  };
}