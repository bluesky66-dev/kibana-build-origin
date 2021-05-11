"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripEmptyFields = exports.multiSelectComponent = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Output transforms are functions that will be called
 * with the form field value whenever we access the form data object. (with `form.getFormData()`)
 *
 * This allows us to have a different object/array as field `value`
 * from the desired outputed form data.
 *
 * Example:
 * ```ts
 * myField.value = [{ label: 'index_1', isSelected: true }, { label: 'index_2', isSelected: false }]
 * const serializer = (value) => (
 *   value.filter(v => v.selected).map(v => v.label)
 * );
 *
 * // When serializing the form data, the following array will be returned
 * form.getFormData() -> { myField: ['index_1'] }
 * ````
 */
const multiSelectComponent = {
  /**
   * Return an array of labels of all the options that are selected
   *
   * @param value The Eui Selectable options array
   */
  optionsToSelectedValue(options) {
    return options.filter(option => option.checked === 'on').map(option => option.label);
  }

};
exports.multiSelectComponent = multiSelectComponent;

/**
 * Strip empty fields from a data object.
 * Empty fields can either be an empty string (one or several blank spaces) or an empty object (no keys)
 *
 * @param object Object to remove the empty fields from.
 * @param types An array of types to strip. Types can be "string" or "object". Defaults to ["string", "object"]
 * @param options An optional configuration object. By default recursive it turned on.
 */
const stripEmptyFields = (object, options) => {
  if (object === undefined) {
    return {};
  }

  const {
    types = ['string', 'object'],
    recursive = false
  } = options || {};
  return Object.entries(object).reduce((acc, [key, value]) => {
    const type = typeof value;
    const shouldStrip = types.includes(type);

    if (shouldStrip && type === 'string' && value.trim() === '') {
      return acc;
    } else if (type === 'object' && !Array.isArray(value) && value !== null) {
      if (Object.keys(value).length === 0 && shouldStrip) {
        return acc;
      } else if (recursive) {
        value = stripEmptyFields({ ...value
        }, options);
      }
    }

    acc[key] = value;
    return acc;
  }, {});
};

exports.stripEmptyFields = stripEmptyFields;