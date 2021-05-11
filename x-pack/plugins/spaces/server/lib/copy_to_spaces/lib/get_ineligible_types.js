"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIneligibleTypes = getIneligibleTypes;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This function returns any importable/exportable saved object types that are namespace-agnostic. Even if these are eligible for
 * import/export, we should not include them in the copy operation because it will result in a conflict that needs to overwrite itself to be
 * resolved.
 */

function getIneligibleTypes(typeRegistry) {
  return typeRegistry.getImportableAndExportableTypes().filter(type => typeRegistry.isNamespaceAgnostic(type.name)).map(type => type.name);
}