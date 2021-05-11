"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RelativeDateFormat = void 0;

var _i18n = require("@kbn/i18n");

var _moment = _interopRequireDefault(require("moment"));

var _types = require("../../kbn_field_types/types");

var _field_format = require("../field_format");

var _types2 = require("../types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RelativeDateFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "textConvert", val => {
      if (val === null || val === undefined) {
        return '-';
      }

      const date = (0, _moment.default)(val);

      if (date.isValid()) {
        return date.fromNow();
      } else {
        return val;
      }
    });
  }

}

exports.RelativeDateFormat = RelativeDateFormat;

_defineProperty(RelativeDateFormat, "id", _types2.FIELD_FORMAT_IDS.RELATIVE_DATE);

_defineProperty(RelativeDateFormat, "title", _i18n.i18n.translate('data.fieldFormats.relative_date.title', {
  defaultMessage: 'Relative date'
}));

_defineProperty(RelativeDateFormat, "fieldType", _types.KBN_FIELD_TYPES.DATE);