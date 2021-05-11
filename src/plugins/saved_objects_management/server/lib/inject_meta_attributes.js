"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectMetaAttributes = injectMetaAttributes;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function injectMetaAttributes(savedObject, savedObjectsManagement) {
  const result = { ...savedObject,
    meta: savedObject.meta || {}
  }; // Add extra meta information

  result.meta.icon = savedObjectsManagement.getIcon(savedObject.type);
  result.meta.title = savedObjectsManagement.getTitle(savedObject);
  result.meta.editUrl = savedObjectsManagement.getEditUrl(savedObject);
  result.meta.inAppUrl = savedObjectsManagement.getInAppUrl(savedObject);
  result.meta.namespaceType = savedObjectsManagement.getNamespaceType(savedObject);
  return result;
}