"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouteValidator = void 0;

var _configSchema = require("@kbn/config-schema");

var _stream = require("stream");

var _validator_error = require("./validator_error");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Route validator class to define the validation logic for each new route.
 *
 * @internal
 */
class RouteValidator {
  static from(opts) {
    if (opts instanceof RouteValidator) {
      return opts;
    }

    const {
      params,
      query,
      body,
      ...options
    } = opts;
    return new RouteValidator({
      params,
      query,
      body
    }, options);
  }

  constructor(config, options = {}) {
    this.config = config;
    this.options = options;
  }
  /**
   * Get validated URL params
   * @internal
   */


  getParams(data, namespace) {
    var _this$options$unsafe;

    return this.validate(this.config.params, (_this$options$unsafe = this.options.unsafe) === null || _this$options$unsafe === void 0 ? void 0 : _this$options$unsafe.params, data, namespace);
  }
  /**
   * Get validated query params
   * @internal
   */


  getQuery(data, namespace) {
    var _this$options$unsafe2;

    return this.validate(this.config.query, (_this$options$unsafe2 = this.options.unsafe) === null || _this$options$unsafe2 === void 0 ? void 0 : _this$options$unsafe2.query, data, namespace);
  }
  /**
   * Get validated body
   * @internal
   */


  getBody(data, namespace) {
    var _this$options$unsafe3;

    return this.validate(this.config.body, (_this$options$unsafe3 = this.options.unsafe) === null || _this$options$unsafe3 === void 0 ? void 0 : _this$options$unsafe3.body, data, namespace);
  }
  /**
   * Has body validation
   * @internal
   */


  hasBody() {
    return typeof this.config.body !== 'undefined';
  }

  validate(validationRule, unsafe, data, namespace) {
    if (typeof validationRule === 'undefined') {
      return {};
    }

    let precheckedData = this.preValidateSchema(data).validate(data, {}, namespace);

    if (unsafe !== true) {
      precheckedData = this.safetyPrechecks(precheckedData, namespace);
    }

    const customCheckedData = this.customValidation(validationRule, precheckedData, namespace);

    if (unsafe === true) {
      return customCheckedData;
    }

    return this.safetyPostchecks(customCheckedData, namespace);
  }

  safetyPrechecks(data, namespace) {
    // We can add any pre-validation safety logic in here
    return data;
  }

  safetyPostchecks(data, namespace) {
    // We can add any post-validation safety logic in here
    return data;
  }

  customValidation(validationRule, data, namespace) {
    if ((0, _configSchema.isConfigSchema)(validationRule)) {
      return validationRule.validate(data, {}, namespace);
    } else if (typeof validationRule === 'function') {
      return this.validateFunction(validationRule, data, namespace);
    } else {
      throw new _configSchema.ValidationError(new _validator_error.RouteValidationError(`The validation rule provided in the handler is not valid`), namespace);
    }
  }

  validateFunction(validateFn, data, namespace) {
    let result;

    try {
      result = validateFn(data, RouteValidator.ResultFactory);
    } catch (err) {
      result = {
        error: new _validator_error.RouteValidationError(err)
      };
    }

    if (result.error) {
      throw new _configSchema.ValidationError(result.error, namespace);
    }

    return result.value;
  }

  preValidateSchema(data) {
    if (Buffer.isBuffer(data)) {
      // if options.body.parse !== true
      return _configSchema.schema.buffer();
    } else if (data instanceof _stream.Stream) {
      // if options.body.output === 'stream'
      return _configSchema.schema.stream();
    } else {
      return _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.any({})));
    }
  }

}

exports.RouteValidator = RouteValidator;

_defineProperty(RouteValidator, "ResultFactory", {
  ok: value => ({
    value
  }),
  badRequest: (error, path) => ({
    error: new _validator_error.RouteValidationError(error, path)
  })
});