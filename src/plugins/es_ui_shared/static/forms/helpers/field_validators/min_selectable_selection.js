"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minSelectableSelectionField = void 0;

var _array = require("../../../validators/array");

var _serializers = require("../serializers");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const {
  optionsToSelectedValue
} = _serializers.multiSelectComponent;
/**
 * Validator to validate that a EuiSelectable has a minimum number
 * of items selected.
 * @param total Minimum number of items
 */

const minSelectableSelectionField = ({
  total = 0,
  message
}) => (...args) => {
  const [{
    value
  }] = args; // We need to convert all the options from the multi selectable component, to the
  // an actual Array of selection _before_ validating the Array length.

  return (0, _array.hasMinLengthArray)(total)(optionsToSelectedValue(value)) ? undefined : {
    code: 'ERR_MIN_SELECTION',
    total,
    message: typeof message === 'function' ? message({
      length
    }) : message
  };
};

exports.minSelectableSelectionField = minSelectableSelectionField;