"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateFormat = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _common = require("../../../common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DateFormat extends _common.FieldFormat {
  constructor(params, getConfig) {
    super(params, getConfig);

    _defineProperty(this, "memoizedConverter", _lodash.noop);

    _defineProperty(this, "memoizedPattern", '');

    _defineProperty(this, "timeZone", '');

    _defineProperty(this, "textConvert", val => {
      // don't give away our ref to converter so we can hot-swap when config changes
      const pattern = this.param('pattern');
      const timezone = this.param('timezone');
      const timezoneChanged = this.timeZone !== timezone;
      const datePatternChanged = this.memoizedPattern !== pattern;

      if (timezoneChanged || datePatternChanged) {
        this.timeZone = timezone;
        this.memoizedPattern = pattern;
      }

      return this.memoizedConverter(val);
    });

    this.memoizedConverter = (0, _lodash.memoize)(val => {
      if (val == null) {
        return '-';
      }
      /* On the server, importing moment returns a new instance. Unlike on
       * the client side, it doesn't have the dateFormat:tz configuration
       * baked in.
       * We need to set the timezone manually here. The date is taken in as
       * UTC and converted into the desired timezone. */


      let date;

      if (this.timeZone === 'Browser') {
        // Assume a warning has been logged this can be unpredictable. It
        // would be too verbose to log anything here.
        date = _momentTimezone.default.utc(val);
      } else {
        date = _momentTimezone.default.utc(val).tz(this.timeZone);
      }

      if (date.isValid()) {
        return date.format(this.memoizedPattern);
      } else {
        return val;
      }
    });
  }

  getParamDefaults() {
    return {
      pattern: this.getConfig('dateFormat'),
      timezone: this.getConfig('dateFormat:tz')
    };
  }

}

exports.DateFormat = DateFormat;

_defineProperty(DateFormat, "id", _common.FIELD_FORMAT_IDS.DATE);

_defineProperty(DateFormat, "title", _i18n.i18n.translate('data.fieldFormats.date.title', {
  defaultMessage: 'Date'
}));

_defineProperty(DateFormat, "fieldType", _common.KBN_FIELD_TYPES.DATE);