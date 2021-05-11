"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IpFormat = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("../../kbn_field_types/types");

var _field_format = require("../field_format");

var _types2 = require("../types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class IpFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "textConvert", val => {
      if (val === undefined || val === null) return '-';
      if (!isFinite(val)) return val; // shazzam!
      // eslint-disable-next-line no-bitwise

      return [val >>> 24, val >>> 16 & 0xff, val >>> 8 & 0xff, val & 0xff].join('.');
    });
  }

}

exports.IpFormat = IpFormat;

_defineProperty(IpFormat, "id", _types2.FIELD_FORMAT_IDS.IP);

_defineProperty(IpFormat, "title", _i18n.i18n.translate('data.fieldFormats.ip.title', {
  defaultMessage: 'IP address'
}));

_defineProperty(IpFormat, "fieldType", _types.KBN_FIELD_TYPES.IP);