"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoolFormat = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("../../kbn_field_types/types");

var _field_format = require("../field_format");

var _types2 = require("../types");

var _utils = require("../utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BoolFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "textConvert", value => {
      if (typeof value === 'string') {
        value = value.trim().toLowerCase();
      }

      switch (value) {
        case false:
        case 0:
        case 'false':
        case 'no':
          return 'false';

        case true:
        case 1:
        case 'true':
        case 'yes':
          return 'true';

        default:
          return (0, _utils.asPrettyString)(value);
      }
    });
  }

}

exports.BoolFormat = BoolFormat;

_defineProperty(BoolFormat, "id", _types2.FIELD_FORMAT_IDS.BOOLEAN);

_defineProperty(BoolFormat, "title", _i18n.i18n.translate('data.fieldFormats.boolean.title', {
  defaultMessage: 'Boolean'
}));

_defineProperty(BoolFormat, "fieldType", [_types.KBN_FIELD_TYPES.BOOLEAN, _types.KBN_FIELD_TYPES.NUMBER, _types.KBN_FIELD_TYPES.STRING]);