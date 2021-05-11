"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationResults = void 0;

var _i18n = require("@kbn/i18n");

var _categorization_job = require("../../../../../common/constants/categorization_job");

var _categories = require("../../../../../common/types/categories");

var _string_utils = require("../../../../../common/util/string_utils");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class ValidationResults {
  constructor() {
    _defineProperty(this, "_results", []);
  }

  get results() {
    return this._results;
  }

  get overallResult() {
    if (this._results.some(c => c.valid === _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.INVALID)) {
      return _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.INVALID;
    }

    if (this._results.some(c => c.valid === _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.PARTIALLY_VALID)) {
      return _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.PARTIALLY_VALID;
    }

    return _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.VALID;
  }

  _resultExists(id) {
    return this._results.some(r => r.id === id);
  }

  createTokenCountResult(examples, sampleSize) {
    if (examples.length === 0) {
      this.createNoExamplesResult();
      return;
    }

    if (this._resultExists(_categories.VALIDATION_RESULT.INSUFFICIENT_PRIVILEGES) === true) {
      // if tokenizing has failed due to insufficient privileges, don't show
      // the message about token count
      return;
    }

    const validExamplesSize = examples.filter(e => e.tokens.length >= _categorization_job.VALID_TOKEN_COUNT).length;
    const percentValid = sampleSize === 0 ? 0 : validExamplesSize / sampleSize;
    let valid = _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.VALID;

    if (percentValid < _categorization_job.CATEGORY_EXAMPLES_ERROR_LIMIT) {
      valid = _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.INVALID;
    } else if (percentValid < _categorization_job.CATEGORY_EXAMPLES_WARNING_LIMIT) {
      valid = _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.PARTIALLY_VALID;
    }

    const message = _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.tokenLengthValidation', {
      defaultMessage: '{number} field {number, plural, zero {value} one {value} other {values}} analyzed, {percentage}% contain {validTokenCount} or more tokens.',
      values: {
        number: sampleSize,
        percentage: Math.floor(percentValid * 100),
        validTokenCount: _categorization_job.VALID_TOKEN_COUNT
      }
    });

    if (this._resultExists(_categories.VALIDATION_RESULT.TOO_MANY_TOKENS) === false && this._resultExists(_categories.VALIDATION_RESULT.FAILED_TO_TOKENIZE) === false) {
      this._results.unshift({
        id: _categories.VALIDATION_RESULT.TOKEN_COUNT,
        valid,
        message
      });
    }
  }

  createMedianMessageLengthResult(examples) {
    const median = (0, _string_utils.getMedianStringLength)(examples);

    if (median > _categorization_job.MEDIAN_LINE_LENGTH_LIMIT) {
      this._results.push({
        id: _categories.VALIDATION_RESULT.MEDIAN_LINE_LENGTH,
        valid: _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.PARTIALLY_VALID,
        message: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.medianLineLength', {
          defaultMessage: 'The median length for the field values analyzed is over {medianLimit} characters.',
          values: {
            medianLimit: _categorization_job.MEDIAN_LINE_LENGTH_LIMIT
          }
        })
      });
    }
  }

  createNoExamplesResult() {
    this._results.push({
      id: _categories.VALIDATION_RESULT.NO_EXAMPLES,
      valid: _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.INVALID,
      message: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.noDataFound', {
        defaultMessage: 'No examples for this field could be found. Please ensure the selected date range contains data.'
      })
    });
  }

  createNullValueResult(examples) {
    const nullCount = examples.filter(e => e === null).length; // if all values are null, VALIDATION_RESULT.NO_EXAMPLES will be raised
    // so we don't need to display this warning as well

    if (nullCount !== examples.length) {
      if (nullCount / examples.length >= _categorization_job.NULL_COUNT_PERCENT_LIMIT) {
        this._results.push({
          id: _categories.VALIDATION_RESULT.NULL_VALUES,
          valid: _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.PARTIALLY_VALID,
          message: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.nullValues', {
            defaultMessage: 'More than {percent}% of field values are null.',
            values: {
              percent: _categorization_job.NULL_COUNT_PERCENT_LIMIT * 100
            }
          })
        });
      }
    }
  }

  createTooManyTokensResult(error, sampleSize) {
    var _error$body$error; // expecting error message:
    // The number of tokens produced by calling _analyze has exceeded the allowed maximum of [10000].
    // This limit can be set by changing the [index.analyze.max_token_count] index level setting.


    if (error.statusCode === 403) {
      this.createPrivilegesErrorResult(error);
      return;
    }

    const message = (_error$body$error = error.body.error) === null || _error$body$error === void 0 ? void 0 : _error$body$error.reason;

    if (message) {
      const rxp = /exceeded the allowed maximum of \[(\d+?)\]/;
      const match = rxp.exec(message);

      if ((match === null || match === void 0 ? void 0 : match.length) === 2) {
        const tokenLimit = match[1];

        this._results.push({
          id: _categories.VALIDATION_RESULT.TOO_MANY_TOKENS,
          valid: _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.INVALID,
          message: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.tooManyTokens', {
            defaultMessage: 'Tokenization of field value examples has failed due to more than {tokenLimit} tokens being found in a sample of {sampleSize} values.',
            values: {
              sampleSize,
              tokenLimit
            }
          })
        });

        return;
      }

      return;
    }

    this.createFailureToTokenize(message);
  }

  createPrivilegesErrorResult(error) {
    var _error$body$error2;

    const message = (_error$body$error2 = error.body.error) === null || _error$body$error2 === void 0 ? void 0 : _error$body$error2.reason;

    if (message) {
      this._results.push({
        id: _categories.VALIDATION_RESULT.INSUFFICIENT_PRIVILEGES,
        valid: _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.PARTIALLY_VALID,
        message: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.insufficientPrivileges', {
          defaultMessage: 'Tokenization of field value examples could not be performed due to insufficient privileges. Field values cannot therefore be checked to see if they are appropriate for use in a categorization job.'
        })
      });

      this._results.push({
        id: _categories.VALIDATION_RESULT.INSUFFICIENT_PRIVILEGES,
        valid: _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.PARTIALLY_VALID,
        message
      });
    }
  }

  createFailureToTokenize(message) {
    this._results.push({
      id: _categories.VALIDATION_RESULT.FAILED_TO_TOKENIZE,
      valid: _categorization_job.CATEGORY_EXAMPLES_VALIDATION_STATUS.INVALID,
      message: _i18n.i18n.translate('xpack.ml.models.jobService.categorization.messages.failureToGetTokens', {
        defaultMessage: 'It was not possible to tokenize a sample of example field values. {message}',
        values: {
          message: message || ''
        }
      })
    });
  }

}

exports.ValidationResults = ValidationResults;