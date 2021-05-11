"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnitStrings = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const UnitStrings = {
  time: {
    getCycleTimeText: (length, format) => {
      switch (format) {
        case 'seconds':
          return _i18n.i18n.translate('xpack.canvas.workpadHeader.cycleIntervalSecondsText', {
            defaultMessage: 'Every {seconds} {seconds, plural, one {second} other {seconds}}',
            values: {
              seconds: length
            }
          });

        case 'minutes':
          return _i18n.i18n.translate('xpack.canvas.workpadHeader.cycleIntervalMinutesText', {
            defaultMessage: 'Every {minutes} {minutes, plural, one {minute} other {minutes}}',
            values: {
              minutes: length
            }
          });

        case 'hours':
          return _i18n.i18n.translate('xpack.canvas.workpadHeader.cycleIntervalHoursText', {
            defaultMessage: 'Every {hours} {hours, plural, one {hour} other {hours}}',
            values: {
              hours: length
            }
          });

        case 'days':
          return _i18n.i18n.translate('xpack.canvas.workpadHeader.cycleIntervalDaysText', {
            defaultMessage: 'Every {days} {days, plural, one {day} other {days}}',
            values: {
              days: length
            }
          });
      }
    },
    getDaysText: days => _i18n.i18n.translate('xpack.canvas.units.time.days', {
      defaultMessage: '{days, plural, one {# day} other {# days}}',
      values: {
        days
      }
    }),
    getHoursText: hours => _i18n.i18n.translate('xpack.canvas.units.time.hours', {
      defaultMessage: '{hours, plural, one {# hour} other {# hours}}',
      values: {
        hours
      }
    }),
    getMinutesText: minutes => _i18n.i18n.translate('xpack.canvas.units.time.minutes', {
      defaultMessage: '{minutes, plural, one {# minute} other {# minutes}}',
      values: {
        minutes
      }
    }),
    getSecondsText: seconds => _i18n.i18n.translate('xpack.canvas.units.time.seconds', {
      defaultMessage: '{seconds, plural, one {# second} other {# seconds}}',
      values: {
        seconds
      }
    })
  },
  quickRanges: {
    getYesterdayLabel: () => _i18n.i18n.translate('xpack.canvas.units.quickRange.yesterday', {
      defaultMessage: 'Yesterday'
    }),
    getTodayLabel: () => _i18n.i18n.translate('xpack.canvas.units.quickRange.today', {
      defaultMessage: 'Today'
    }),
    getLast24HoursLabel: () => _i18n.i18n.translate('xpack.canvas.units.quickRange.last24Hours', {
      defaultMessage: 'Last 24 hours'
    }),
    getLast7DaysLabel: () => _i18n.i18n.translate('xpack.canvas.units.quickRange.last7Days', {
      defaultMessage: 'Last 7 days'
    }),
    getLast2WeeksLabel: () => _i18n.i18n.translate('xpack.canvas.units.quickRange.last2Weeks', {
      defaultMessage: 'Last 2 weeks'
    }),
    getLast30DaysLabel: () => _i18n.i18n.translate('xpack.canvas.units.quickRange.last30Days', {
      defaultMessage: 'Last 30 days'
    }),
    getLast90DaysLabel: () => _i18n.i18n.translate('xpack.canvas.units.quickRange.last90Days', {
      defaultMessage: 'Last 90 days'
    }),
    getLast1YearLabel: () => _i18n.i18n.translate('xpack.canvas.units.quickRange.last1Year', {
      defaultMessage: 'Last 1 year'
    })
  }
};
exports.UnitStrings = UnitStrings;