"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrations = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migrations = {
  '7.12.0': doc => {
    const {
      ids,
      ...rest
    } = doc.attributes;
    return { ...doc,
      references: doc.references || [],
      attributes: { ...rest,
        artifacts: (ids || []).map(artifactId => ({
          artifactId,
          policyId: undefined
        }))
      }
    };
  }
};
exports.migrations = migrations;