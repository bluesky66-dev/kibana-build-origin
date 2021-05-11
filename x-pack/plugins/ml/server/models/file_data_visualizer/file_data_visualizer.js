"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileDataVisualizerProvider = fileDataVisualizerProvider;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function fileDataVisualizerProvider(mlClient) {
  async function analyzeFile(data, overrides) {
    overrides.explain = overrides.explain === undefined ? 'true' : overrides.explain;
    const {
      body
    } = await mlClient.findFileStructure({
      body: data,
      ...overrides
    });
    const {
      hasOverrides,
      reducedOverrides
    } = formatOverrides(overrides);
    return { ...(hasOverrides && {
        overrides: reducedOverrides
      }),
      results: body
    };
  }

  return {
    analyzeFile
  };
}

function formatOverrides(overrides) {
  let hasOverrides = false;
  const reducedOverrides = Object.keys(overrides).reduce((acc, overrideKey) => {
    const overrideValue = overrides[overrideKey];

    if (overrideValue !== '') {
      if (overrideKey === 'column_names') {
        acc.column_names = overrideValue.split(',');
      } else if (overrideKey === 'has_header_row') {
        acc.has_header_row = overrideValue === 'true';
      } else if (overrideKey === 'should_trim_fields') {
        acc.should_trim_fields = overrideValue === 'true';
      } else {
        acc[overrideKey] = overrideValue;
      }

      hasOverrides = true;
    }

    return acc;
  }, {});
  return {
    reducedOverrides,
    hasOverrides
  };
}