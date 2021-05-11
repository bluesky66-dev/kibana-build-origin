"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDashboardDoc = isDashboardDoc;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isDoc(doc) {
  return typeof doc.id === 'string' && typeof doc.type === 'string' && doc.attributes !== null && typeof doc.attributes === 'object' && doc.references !== null && typeof doc.references === 'object';
}

function isDashboardDoc(doc) {
  if (!isDoc(doc)) {
    return false;
  }

  if (typeof doc.attributes.panelsJSON !== 'string') {
    return false;
  }

  return true;
}