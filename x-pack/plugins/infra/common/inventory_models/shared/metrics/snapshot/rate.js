"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rate = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const rate = (id, field) => {
  return {
    [`${id}_max`]: {
      max: {
        field
      }
    },
    [`${id}_deriv`]: {
      derivative: {
        buckets_path: `${id}_max`,
        gap_policy: 'skip',
        unit: '1s'
      }
    },
    [id]: {
      bucket_script: {
        buckets_path: {
          value: `${id}_deriv[normalized_value]`
        },
        script: {
          source: 'params.value > 0.0 ? params.value : 0.0',
          lang: 'painless'
        },
        gap_policy: 'skip'
      }
    }
  };
};

exports.rate = rate;