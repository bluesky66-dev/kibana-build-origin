"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformSeries = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const transformSeries = hasGroupBy => series => {
  var _series$keys$join, _series$keys;

  const id = (_series$keys$join = (_series$keys = series.keys) === null || _series$keys === void 0 ? void 0 : _series$keys.join(' / ')) !== null && _series$keys$join !== void 0 ? _series$keys$join : series.id;
  return { ...series,
    id,
    rows: series.rows.map(row => {
      if (hasGroupBy) {
        return { ...row,
          groupBy: id
        };
      }

      return row;
    }),
    columns: hasGroupBy ? [...series.columns, {
      name: 'groupBy',
      type: 'string'
    }] : series.columns
  };
};

exports.transformSeries = transformSeries;