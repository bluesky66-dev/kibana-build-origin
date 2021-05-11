"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NumeralFormat = void 0;

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _languages = _interopRequireDefault(require("@elastic/numeral/languages"));

var _types = require("../../kbn_field_types/types");

var _field_format = require("../field_format");

var _constants = require("../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const numeralInst = (0, _numeral.default)();

_languages.default.forEach(numeralLanguage => {
  _numeral.default.language(numeralLanguage.id, numeralLanguage.lang);
});

class NumeralFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "title", void 0);

    _defineProperty(this, "getParamDefaults", () => ({
      pattern: this.getConfig(`format:${this.id}:defaultPattern`)
    }));

    _defineProperty(this, "textConvert", val => {
      return this.getConvertedValue(val);
    });
  }

  getConvertedValue(val) {
    if (val === -Infinity) return '-∞';
    if (val === +Infinity) return '+∞';

    if (typeof val !== 'number') {
      val = parseFloat(val);
    }

    if (isNaN(val)) return '';

    const previousLocale = _numeral.default.language();

    const defaultLocale = this.getConfig && this.getConfig(_constants.UI_SETTINGS.FORMAT_NUMBER_DEFAULT_LOCALE) || 'en';

    _numeral.default.language(defaultLocale);

    const formatted = numeralInst.set(val).format(this.param('pattern'));

    _numeral.default.language(previousLocale);

    return formatted;
  }

}

exports.NumeralFormat = NumeralFormat;

_defineProperty(NumeralFormat, "fieldType", _types.KBN_FIELD_TYPES.NUMBER);