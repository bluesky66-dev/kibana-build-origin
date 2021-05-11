"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Metric = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _error_missing_required = require("../../error_missing_required");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class Metric {
  constructor(opts) {
    const props = {
      derivative: false
    };
    const requireds = {
      field: opts.field,
      label: opts.label,
      description: opts.description,
      format: opts.format,
      units: opts.units,
      timestampField: opts.timestampField
    };
    this.checkRequiredParams(requireds);

    _lodash.default.assign(this, _lodash.default.defaults(opts, props));
  }

  checkRequiredParams(requireds) {
    const undefKey = _lodash.default.findKey(requireds, _lodash.default.isUndefined);

    if (undefKey) {
      console.log(`Missing required field: [${undefKey}]`);
      throw new _error_missing_required.MissingRequiredError(undefKey);
    }
  }

  serialize() {
    // some fields exposed for debugging through HTML comment text
    const pickFields = ['app', 'field', 'metricAgg', 'label', 'title', 'description', 'units', 'format'];
    const metric = Object.create(this);
    return { ..._lodash.default.pick(metric, pickFields),
      hasCalculation: Boolean(metric.calculation),
      isDerivative: metric.derivative
    };
  }

  getFields() {
    return [this.field];
  }

  getDocType() {
    return this.docType || this.getInferredDocType();
  }

  getInferredDocType() {
    const fields = this.getFields();
    return fields && fields.length ? fields[0].split('.')[0] : null;
  }

  static calculateLatency(timeInMillis, totalEvents) {
    if (timeInMillis === null || totalEvents === null) {
      return null;
    } else if (timeInMillis < 0 || totalEvents < 0) {
      // Negative values indicate blips in the data (e.g., restarting a node) that we do not want to misrepresent
      return null;
    } else if (totalEvents === 0) {
      return 0;
    }

    return timeInMillis / totalEvents;
  }

}

exports.Metric = Metric;