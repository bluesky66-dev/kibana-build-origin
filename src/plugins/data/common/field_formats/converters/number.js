"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NumberFormat = void 0;

var _i18n = require("@kbn/i18n");

var _numeral = require("./numeral");

var _types = require("../types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class NumberFormat extends _numeral.NumeralFormat {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "id", NumberFormat.id);

    _defineProperty(this, "title", NumberFormat.title);

    _defineProperty(this, "allowsNumericalAggregations", true);
  }

}

exports.NumberFormat = NumberFormat;

_defineProperty(NumberFormat, "id", _types.FIELD_FORMAT_IDS.NUMBER);

_defineProperty(NumberFormat, "title", _i18n.i18n.translate('data.fieldFormats.number.title', {
  defaultMessage: 'Number'
}));