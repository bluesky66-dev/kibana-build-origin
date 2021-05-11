"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.standaloneClusterFilter = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const standaloneClusterFilter = {
  bool: {
    should: [{
      term: {
        cluster_uuid: {
          value: ''
        }
      }
    }, {
      bool: {
        must_not: [{
          exists: {
            field: 'cluster_uuid'
          }
        }]
      }
    }]
  }
};
exports.standaloneClusterFilter = standaloneClusterFilter;