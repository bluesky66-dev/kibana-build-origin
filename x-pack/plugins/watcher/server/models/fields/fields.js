"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fields = void 0;

var _boom = require("@hapi/boom");

var _lodash = require("lodash");

var _normalized_field_types = require("../../lib/normalized_field_types");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function buildFieldList(fields) {
  const result = [];
  (0, _lodash.forEach)(fields, (field, name) => {
    // If the field exists in multiple indexes, the types may be inconsistent.
    // In this case, default to the first type.
    const type = (0, _lodash.keys)(field)[0]; // Do not include fields that have a type that starts with an underscore.

    if (type[0] === '_') {
      return;
    }

    const normalizedType = _normalized_field_types.normalizedFieldTypes[type] || type;
    const aggregatable = field[type].aggregatable;
    const searchable = field[type].searchable;
    result.push({
      name,
      type,
      normalizedType,
      aggregatable,
      searchable
    });
  });
  return (0, _lodash.sortBy)(result, 'name');
}

class Fields {
  constructor(props) {
    this.fields = props.fields;
  }

  get downstreamJson() {
    const result = {
      fields: this.fields
    };
    return result;
  }

  static fromUpstreamJson(json) {
    if (!json.fields) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.fields.fieldsPropertyMissingBadRequestMessage', {
        defaultMessage: 'JSON argument must contain a {fields} property',
        values: {
          fields: 'fields'
        }
      }));
    }

    const fields = buildFieldList(json.fields);
    return new Fields({
      fields
    });
  }

}

exports.Fields = Fields;