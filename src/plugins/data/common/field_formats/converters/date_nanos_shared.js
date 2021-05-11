"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.analysePatternForFract = analysePatternForFract;
exports.formatWithNanos = formatWithNanos;
exports.DateNanosFormat = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _ = require("../../");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Analyse the given moment.js format pattern for the fractional sec part (S,SS,SSS...)
 * returning length, match, pattern and an escaped pattern, that excludes the fractional
 * part when formatting with moment.js -> e.g. [SSS]
 */
function analysePatternForFract(pattern) {
  const fracSecMatch = pattern.match('S+'); // extract fractional seconds sub-pattern

  const fracSecMatchStr = fracSecMatch ? fracSecMatch[0] : '';
  return {
    length: fracSecMatchStr.length,
    patternNanos: fracSecMatchStr,
    pattern,
    patternEscaped: fracSecMatchStr ? pattern.replace(fracSecMatch, `[${fracSecMatch}]`) : ''
  };
}
/**
 * Format a given moment.js date object
 * Since momentjs would loose the exact value for fractional seconds with a higher resolution than
 * milliseconds, the fractional pattern is replaced by the fractional value of the raw timestamp
 */


function formatWithNanos(dateMomentObj, valRaw, fracPatternObj) {
  if (fracPatternObj.length <= 3) {
    // S,SS,SSS is formatted correctly by moment.js
    return dateMomentObj.format(fracPatternObj.pattern);
  } else {
    // Beyond SSS the precise value of the raw datetime string is used
    const valFormatted = dateMomentObj.format(fracPatternObj.patternEscaped); // Extract fractional value of ES formatted timestamp, zero pad if necessary:
    // 2020-05-18T20:45:05.957Z -> 957000000
    // 2020-05-18T20:45:05.957000123Z -> 957000123
    // we do not need to take care of the year 10000 bug since max year of date_nanos is 2262

    const valNanos = valRaw.substr(20, valRaw.length - 21) // remove timezone(Z)
    .padEnd(9, '0') // pad shorter fractionals
    .substr(0, fracPatternObj.patternNanos.length);
    return valFormatted.replace(fracPatternObj.patternNanos, valNanos);
  }
}

class DateNanosFormat extends _.FieldFormat {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "memoizedConverter", _lodash.noop);

    _defineProperty(this, "memoizedPattern", '');

    _defineProperty(this, "timeZone", '');

    _defineProperty(this, "textConvert", val => {
      // don't give away our ref to converter so
      // we can hot-swap when config changes
      const pattern = this.param('pattern');
      const timezone = this.param('timezone');
      const fractPattern = analysePatternForFract(pattern);
      const fallbackPattern = this.param('patternFallback');
      const timezoneChanged = this.timeZone !== timezone;
      const datePatternChanged = this.memoizedPattern !== pattern;

      if (timezoneChanged || datePatternChanged) {
        this.timeZone = timezone;
        this.memoizedPattern = pattern;
        this.memoizedConverter = (0, _lodash.memoize)(function converter(value) {
          if (value === null || value === undefined) {
            return '-';
          }

          const date = (0, _moment.default)(value);

          if (typeof value !== 'string' && date.isValid()) {
            // fallback for max/min aggregation, where unixtime in ms is returned as a number
            // aggregations in Elasticsearch generally just return ms
            return date.format(fallbackPattern);
          } else if (date.isValid()) {
            return formatWithNanos(date, value, fractPattern);
          } else {
            return value;
          }
        });
      }

      return this.memoizedConverter(val);
    });
  }

  getParamDefaults() {
    return {
      pattern: this.getConfig('dateNanosFormat'),
      fallbackPattern: this.getConfig('dateFormat'),
      timezone: this.getConfig('dateFormat:tz')
    };
  }

}

exports.DateNanosFormat = DateNanosFormat;

_defineProperty(DateNanosFormat, "id", _.FIELD_FORMAT_IDS.DATE_NANOS);

_defineProperty(DateNanosFormat, "title", _i18n.i18n.translate('data.fieldFormats.date_nanos.title', {
  defaultMessage: 'Date nanos'
}));

_defineProperty(DateNanosFormat, "fieldType", _.KBN_FIELD_TYPES.DATE);