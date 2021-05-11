"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollupSearchCapabilities = void 0;

var _lodash = require("lodash");

var _interval_helper = require("../lib/interval_helper");

var _default_search_capabilities = require("./default_search_capabilities");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RollupSearchCapabilities extends _default_search_capabilities.DefaultSearchCapabilities {
  constructor(req, fieldsCapabilities, rollupIndex) {
    super(req, fieldsCapabilities);

    _defineProperty(this, "rollupIndex", void 0);

    _defineProperty(this, "availableMetrics", void 0);

    this.rollupIndex = rollupIndex;
    this.availableMetrics = (0, _lodash.get)(fieldsCapabilities, `${rollupIndex}.aggs`, {});
  }

  get dateHistogram() {
    const [dateHistogram] = Object.values(this.availableMetrics.date_histogram);
    return dateHistogram;
  }

  get defaultTimeInterval() {
    return this.dateHistogram.fixed_interval || this.dateHistogram.calendar_interval ||
    /*
       Deprecation: [interval] on [date_histogram] is deprecated, use [fixed_interval] or [calendar_interval] in the future.
       We can remove the following line only for versions > 8.x
      */
    this.dateHistogram.interval || null;
  }

  get searchTimezone() {
    return (0, _lodash.get)(this.dateHistogram, 'time_zone', null);
  }

  get whiteListedMetrics() {
    const baseRestrictions = this.createUiRestriction({
      count: this.createUiRestriction()
    });

    const getFields = fields => Object.keys(fields).reduce((acc, item) => ({ ...acc,
      [item]: true
    }), this.createUiRestriction({}));

    return Object.keys(this.availableMetrics).reduce((acc, item) => ({ ...acc,
      [item]: getFields(this.availableMetrics[item])
    }), baseRestrictions);
  }

  get whiteListedGroupByFields() {
    return this.createUiRestriction({
      everything: true,
      terms: (0, _lodash.has)(this.availableMetrics, 'terms')
    });
  }

  get whiteListedTimerangeModes() {
    return this.createUiRestriction({
      last_value: true
    });
  }

  getValidTimeInterval(userIntervalString) {
    const parsedRollupJobInterval = this.parseInterval(this.defaultTimeInterval);
    const inRollupJobUnit = this.convertIntervalToUnit(userIntervalString, parsedRollupJobInterval.unit);

    const getValidCalendarInterval = () => {
      let unit = parsedRollupJobInterval.unit;

      if (inRollupJobUnit.value > parsedRollupJobInterval.value) {
        const inSeconds = this.convertIntervalToUnit(userIntervalString, 's');

        if (inSeconds !== null && inSeconds !== void 0 && inSeconds.value) {
          unit = this.getSuitableUnit(inSeconds.value);
        }
      }

      return {
        value: 1,
        unit
      };
    };

    const getValidFixedInterval = () => ({
      value: (0, _interval_helper.leastCommonInterval)(inRollupJobUnit === null || inRollupJobUnit === void 0 ? void 0 : inRollupJobUnit.value, parsedRollupJobInterval === null || parsedRollupJobInterval === void 0 ? void 0 : parsedRollupJobInterval.value),
      unit: parsedRollupJobInterval.unit
    });

    const {
      value,
      unit
    } = ((0, _interval_helper.isCalendarInterval)(parsedRollupJobInterval) ? getValidCalendarInterval : getValidFixedInterval)();
    return `${value}${unit}`;
  }

}

exports.RollupSearchCapabilities = RollupSearchCapabilities;