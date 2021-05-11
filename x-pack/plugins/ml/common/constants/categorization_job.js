"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VALIDATION_CHECK_DESCRIPTION = exports.CATEGORY_EXAMPLES_VALIDATION_STATUS = exports.NULL_COUNT_PERCENT_LIMIT = exports.MEDIAN_LINE_LENGTH_LIMIT = exports.VALID_TOKEN_COUNT = exports.CATEGORY_EXAMPLES_ERROR_LIMIT = exports.CATEGORY_EXAMPLES_WARNING_LIMIT = exports.CATEGORY_EXAMPLES_SAMPLE_SIZE = exports.NUMBER_OF_CATEGORY_EXAMPLES = void 0;

var _i18n = require("@kbn/i18n");

var _categories = require("../types/categories");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const NUMBER_OF_CATEGORY_EXAMPLES = 5;
exports.NUMBER_OF_CATEGORY_EXAMPLES = NUMBER_OF_CATEGORY_EXAMPLES;
const CATEGORY_EXAMPLES_SAMPLE_SIZE = 1000;
exports.CATEGORY_EXAMPLES_SAMPLE_SIZE = CATEGORY_EXAMPLES_SAMPLE_SIZE;
const CATEGORY_EXAMPLES_WARNING_LIMIT = 0.75;
exports.CATEGORY_EXAMPLES_WARNING_LIMIT = CATEGORY_EXAMPLES_WARNING_LIMIT;
const CATEGORY_EXAMPLES_ERROR_LIMIT = 0.02;
exports.CATEGORY_EXAMPLES_ERROR_LIMIT = CATEGORY_EXAMPLES_ERROR_LIMIT;
const VALID_TOKEN_COUNT = 3;
exports.VALID_TOKEN_COUNT = VALID_TOKEN_COUNT;
const MEDIAN_LINE_LENGTH_LIMIT = 400;
exports.MEDIAN_LINE_LENGTH_LIMIT = MEDIAN_LINE_LENGTH_LIMIT;
const NULL_COUNT_PERCENT_LIMIT = 0.75;
exports.NULL_COUNT_PERCENT_LIMIT = NULL_COUNT_PERCENT_LIMIT;
let CATEGORY_EXAMPLES_VALIDATION_STATUS;
exports.CATEGORY_EXAMPLES_VALIDATION_STATUS = CATEGORY_EXAMPLES_VALIDATION_STATUS;

(function (CATEGORY_EXAMPLES_VALIDATION_STATUS) {
  CATEGORY_EXAMPLES_VALIDATION_STATUS["VALID"] = "valid";
  CATEGORY_EXAMPLES_VALIDATION_STATUS["PARTIALLY_VALID"] = "partially_valid";
  CATEGORY_EXAMPLES_VALIDATION_STATUS["INVALID"] = "invalid";
})(CATEGORY_EXAMPLES_VALIDATION_STATUS || (exports.CATEGORY_EXAMPLES_VALIDATION_STATUS = CATEGORY_EXAMPLES_VALIDATION_STATUS = {}));

const VALIDATION_CHECK_DESCRIPTION = {
  [_categories.VALIDATION_RESULT.NO_EXAMPLES]: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.validNoDataFound', {
    defaultMessage: 'Examples  were successfully loaded.'
  }),
  [_categories.VALIDATION_RESULT.FAILED_TO_TOKENIZE]: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.validFailureToGetTokens', {
    defaultMessage: 'The examples loaded were tokenized successfully.'
  }),
  [_categories.VALIDATION_RESULT.TOKEN_COUNT]: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.validTokenLength', {
    defaultMessage: 'More than {tokenCount} tokens per example were found in over {percentage}% of the examples loaded.',
    values: {
      percentage: Math.floor(CATEGORY_EXAMPLES_WARNING_LIMIT * 100),
      tokenCount: VALID_TOKEN_COUNT
    }
  }),
  [_categories.VALIDATION_RESULT.MEDIAN_LINE_LENGTH]: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.validMedianLineLength', {
    defaultMessage: 'The median line length of the examples loaded was less than {medianCharCount} characters.',
    values: {
      medianCharCount: MEDIAN_LINE_LENGTH_LIMIT
    }
  }),
  [_categories.VALIDATION_RESULT.NULL_VALUES]: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.validNullValues', {
    defaultMessage: 'Less than {percentage}% of the examples loaded were null.',
    values: {
      percentage: Math.floor(100 - NULL_COUNT_PERCENT_LIMIT * 100)
    }
  }),
  [_categories.VALIDATION_RESULT.TOO_MANY_TOKENS]: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.validTooManyTokens', {
    defaultMessage: 'Less than 10000 tokens were found in total in the examples loaded.'
  }),
  [_categories.VALIDATION_RESULT.INSUFFICIENT_PRIVILEGES]: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.validUserPrivileges', {
    defaultMessage: 'The user has sufficient privileges to perform the checks.'
  })
};
exports.VALIDATION_CHECK_DESCRIPTION = VALIDATION_CHECK_DESCRIPTION;