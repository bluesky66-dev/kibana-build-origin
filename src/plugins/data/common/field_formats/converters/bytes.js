"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BytesFormat = void 0;

var _i18n = require("@kbn/i18n");

var _numeral = require("./numeral");

var _types = require("../types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BytesFormat extends _numeral.NumeralFormat {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "id", BytesFormat.id);

    _defineProperty(this, "title", BytesFormat.title);

    _defineProperty(this, "allowsNumericalAggregations", true);
  }

}

exports.BytesFormat = BytesFormat;

_defineProperty(BytesFormat, "id", _types.FIELD_FORMAT_IDS.BYTES);

_defineProperty(BytesFormat, "title", _i18n.i18n.translate('data.fieldFormats.bytes.title', {
  defaultMessage: 'Bytes'
}));