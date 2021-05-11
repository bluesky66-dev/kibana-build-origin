"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateNanosFormat = void 0;

var _lodash = require("lodash");

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _date_nanos_shared = require("../../../common/field_formats/converters/date_nanos_shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DateNanosFormatServer extends _date_nanos_shared.DateNanosFormat {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "textConvert", val => {
      // don't give away our ref to converter so
      // we can hot-swap when config changes
      const pattern = this.param('pattern');
      const timezone = this.param('timezone');
      const fractPattern = (0, _date_nanos_shared.analysePatternForFract)(pattern);
      const fallbackPattern = this.param('patternFallback');
      const timezoneChanged = this.timeZone !== timezone;
      const datePatternChanged = this.memoizedPattern !== pattern;

      if (timezoneChanged || datePatternChanged) {
        this.timeZone = timezone;
        this.memoizedPattern = pattern;
        this.memoizedConverter = (0, _lodash.memoize)(value => {
          if (value === null || value === undefined) {
            return '-';
          }
          /* On the server, importing moment returns a new instance. Unlike on
           * the client side, it doesn't have the dateFormat:tz configuration
           * baked in.
           * We need to set the timezone manually here. The date is taken in as
           * UTC and converted into the desired timezone. */


          let date;

          if (this.timeZone === 'Browser') {
            // Assume a warning has been logged that this can be unpredictable. It
            // would be too verbose to log anything here.
            date = _momentTimezone.default.utc(val);
          } else {
            date = _momentTimezone.default.utc(val).tz(this.timeZone);
          }

          if (typeof value !== 'string' && date.isValid()) {
            // fallback for max/min aggregation, where unixtime in ms is returned as a number
            // aggregations in Elasticsearch generally just return ms
            return date.format(fallbackPattern);
          } else if (date.isValid()) {
            return (0, _date_nanos_shared.formatWithNanos)(date, value, fractPattern);
          } else {
            return value;
          }
        });
      }

      return this.memoizedConverter(val);
    });
  }

}

exports.DateNanosFormat = DateNanosFormatServer;