"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseSheet;

var _i18n = require("@kbn/i18n");

var _parser = require("../../../common/parser");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function parseSheet(sheet) {
  return sheet.map(function (plot) {
    try {
      return (0, _parser.parseTimelionExpression)(plot).tree;
    } catch (e) {
      if (e.expected) {
        throw new Error(_i18n.i18n.translate('timelion.serverSideErrors.sheetParseErrorMessage', {
          defaultMessage: 'Expected: {expectedDescription} at character {column}',
          description: 'This would be for example: "Expected: a quote at character 5"',
          values: {
            expectedDescription: e.expected[0].description,
            column: e.column
          }
        }));
      } else {
        throw e;
      }
    }
  });
}

module.exports = exports.default;