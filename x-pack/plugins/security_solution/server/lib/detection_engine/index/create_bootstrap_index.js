"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBootstrapIndex = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// See the reference(s) below on explanations about why -000001 was chosen and
// why the is_write_index is true as well as the bootstrapping step which is needed.
// Ref: https://www.elastic.co/guide/en/elasticsearch/reference/current/applying-policy-to-template.html

const createBootstrapIndex = async (callWithRequest, index) => {
  return callWithRequest('transport.request', {
    path: `/${index}-000001`,
    method: 'PUT',
    body: {
      aliases: {
        [index]: {
          is_write_index: true
        }
      }
    }
  });
};

exports.createBootstrapIndex = createBootstrapIndex;