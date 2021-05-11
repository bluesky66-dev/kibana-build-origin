"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAttributesId = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const removeAttributesId = doc => {
  if (typeof doc.attributes === 'object' && doc.attributes !== null) {
    delete doc.attributes.id;
  }

  return doc;
};

exports.removeAttributesId = removeAttributesId;