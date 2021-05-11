"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filebeatTraefikRules = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const filebeatTraefikRules = [{
  // pre-ECS
  when: {
    exists: ['traefik.access.method']
  },
  format: [{
    constant: '[traefik][access] '
  }, {
    field: 'traefik.access.remote_ip'
  }, {
    constant: ' '
  }, {
    field: 'traefik.access.frontend_name'
  }, {
    constant: ' -> '
  }, {
    field: 'traefik.access.backend_url'
  }, {
    constant: ' "'
  }, {
    field: 'traefik.access.method'
  }, {
    constant: ' '
  }, {
    field: 'traefik.access.url'
  }, {
    constant: ' HTTP/'
  }, {
    field: 'traefik.access.http_version'
  }, {
    constant: '" '
  }, {
    field: 'traefik.access.response_code'
  }, {
    constant: ' '
  }, {
    field: 'traefik.access.body_sent.bytes'
  }]
}];
exports.filebeatTraefikRules = filebeatTraefikRules;