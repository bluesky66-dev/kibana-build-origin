"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reportingSchema = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const appCountsSchema = {
  'canvas workpad': {
    type: 'long'
  },
  dashboard: {
    type: 'long'
  },
  visualization: {
    type: 'long'
  }
};
const byAppCountsSchema = {
  csv: appCountsSchema,
  PNG: appCountsSchema,
  printable_pdf: appCountsSchema
};
const availableTotalSchema = {
  available: {
    type: 'boolean'
  },
  total: {
    type: 'long'
  }
};
const jobTypesSchema = {
  csv: availableTotalSchema,
  PNG: availableTotalSchema,
  printable_pdf: { ...availableTotalSchema,
    app: appCountsSchema,
    layout: {
      print: {
        type: 'long'
      },
      preserve_layout: {
        type: 'long'
      }
    }
  }
};
const rangeStatsSchema = { ...jobTypesSchema,
  _all: {
    type: 'long'
  },
  status: {
    cancelled: {
      type: 'long'
    },
    completed: {
      type: 'long'
    },
    completed_with_warnings: {
      type: 'long'
    },
    failed: {
      type: 'long'
    },
    pending: {
      type: 'long'
    },
    processing: {
      type: 'long'
    }
  },
  statuses: {
    cancelled: byAppCountsSchema,
    completed: byAppCountsSchema,
    completed_with_warnings: byAppCountsSchema,
    failed: byAppCountsSchema,
    pending: byAppCountsSchema,
    processing: byAppCountsSchema
  }
};
const reportingSchema = { ...rangeStatsSchema,
  available: {
    type: 'boolean'
  },
  browser_type: {
    type: 'keyword'
  },
  enabled: {
    type: 'boolean'
  },
  last7Days: rangeStatsSchema
};
exports.reportingSchema = reportingSchema;