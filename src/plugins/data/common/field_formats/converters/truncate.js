"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TruncateFormat = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _types = require("../../kbn_field_types/types");

var _field_format = require("../field_format");

var _types2 = require("../types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const omission = '...';

class TruncateFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "textConvert", val => {
      const length = this.param('fieldLength');

      if (length > 0) {
        return (0, _lodash.truncate)(val, {
          length: length + omission.length,
          omission
        });
      }

      return val;
    });
  }

}

exports.TruncateFormat = TruncateFormat;

_defineProperty(TruncateFormat, "id", _types2.FIELD_FORMAT_IDS.TRUNCATE);

_defineProperty(TruncateFormat, "title", _i18n.i18n.translate('data.fieldFormats.truncated_string.title', {
  defaultMessage: 'Truncated string'
}));

_defineProperty(TruncateFormat, "fieldType", _types.KBN_FIELD_TYPES.STRING);