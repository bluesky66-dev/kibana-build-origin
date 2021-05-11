"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcAutoIntervalNear = calcAutoIntervalNear;
exports.calcAutoIntervalLessThan = calcAutoIntervalLessThan;
exports.boundsDescendingRaw = void 0;

var _i18n = require("@kbn/i18n");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const boundsDescendingRaw = [{
  bound: Infinity,
  interval: _moment.default.duration(1, 'year'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.infinityLabel', {
    defaultMessage: 'More than a year'
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.yearLabel', {
    defaultMessage: 'a year'
  })
}, {
  bound: _moment.default.duration(1, 'year'),
  interval: _moment.default.duration(1, 'month'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.yearLabel', {
    defaultMessage: 'a year'
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.monthLabel', {
    defaultMessage: 'a month'
  })
}, {
  bound: _moment.default.duration(3, 'week'),
  interval: _moment.default.duration(1, 'week'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.dayLabel', {
    defaultMessage: '{amount, plural, one {a day} other {# days}}',
    values: {
      amount: 21
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.dayLabel', {
    defaultMessage: '{amount, plural, one {a day} other {# days}}',
    values: {
      amount: 7
    }
  })
}, {
  bound: _moment.default.duration(1, 'week'),
  interval: _moment.default.duration(1, 'd'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.dayLabel', {
    defaultMessage: '{amount, plural, one {a day} other {# days}}',
    values: {
      amount: 7
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.dayLabel', {
    defaultMessage: '{amount, plural, one {a day} other {# days}}',
    values: {
      amount: 1
    }
  })
}, {
  bound: _moment.default.duration(24, 'hour'),
  interval: _moment.default.duration(12, 'hour'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.dayLabel', {
    defaultMessage: '{amount, plural, one {a day} other {# days}}',
    values: {
      amount: 1
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.hourLabel', {
    defaultMessage: '{amount, plural, one {an hour} other {# hours}}',
    values: {
      amount: 12
    }
  })
}, {
  bound: _moment.default.duration(6, 'hour'),
  interval: _moment.default.duration(3, 'hour'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.hourLabel', {
    defaultMessage: '{amount, plural, one {an hour} other {# hours}}',
    values: {
      amount: 6
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.hourLabel', {
    defaultMessage: '{amount, plural, one {an hour} other {# hours}}',
    values: {
      amount: 3
    }
  })
}, {
  bound: _moment.default.duration(2, 'hour'),
  interval: _moment.default.duration(1, 'hour'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.hourLabel', {
    defaultMessage: '{amount, plural, one {an hour} other {# hours}}',
    values: {
      amount: 2
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.hourLabel', {
    defaultMessage: '{amount, plural, one {an hour} other {# hours}}',
    values: {
      amount: 1
    }
  })
}, {
  bound: _moment.default.duration(45, 'minute'),
  interval: _moment.default.duration(30, 'minute'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.minuteLabel', {
    defaultMessage: '{amount, plural, one {a minute} other {# minutes}}',
    values: {
      amount: 45
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.minuteLabel', {
    defaultMessage: '{amount, plural, one {a minute} other {# minutes}}',
    values: {
      amount: 30
    }
  })
}, {
  bound: _moment.default.duration(20, 'minute'),
  interval: _moment.default.duration(10, 'minute'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.minuteLabel', {
    defaultMessage: '{amount, plural, one {a minute} other {# minutes}}',
    values: {
      amount: 20
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.minuteLabel', {
    defaultMessage: '{amount, plural, one {a minute} other {# minutes}}',
    values: {
      amount: 10
    }
  })
}, {
  bound: _moment.default.duration(9, 'minute'),
  interval: _moment.default.duration(5, 'minute'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.minuteLabel', {
    defaultMessage: '{amount, plural, one {a minute} other {# minutes}}',
    values: {
      amount: 9
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.minuteLabel', {
    defaultMessage: '{amount, plural, one {a minute} other {# minutes}}',
    values: {
      amount: 5
    }
  })
}, {
  bound: _moment.default.duration(3, 'minute'),
  interval: _moment.default.duration(1, 'minute'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.minuteLabel', {
    defaultMessage: '{amount, plural, one {a minute} other {# minutes}}',
    values: {
      amount: 3
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.minuteLabel', {
    defaultMessage: '{amount, plural, one {a minute} other {# minutes}}',
    values: {
      amount: 1
    }
  })
}, {
  bound: _moment.default.duration(45, 'second'),
  interval: _moment.default.duration(30, 'second'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.secondLabel', {
    defaultMessage: '{amount, plural, one {a second} other {# seconds}}',
    values: {
      amount: 45
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.secondLabel', {
    defaultMessage: '{amount, plural, one {a second} other {# seconds}}',
    values: {
      amount: 30
    }
  })
}, {
  bound: _moment.default.duration(15, 'second'),
  interval: _moment.default.duration(10, 'second'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.secondLabel', {
    defaultMessage: '{amount, plural, one {a second} other {# seconds}}',
    values: {
      amount: 15
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.secondLabel', {
    defaultMessage: '{amount, plural, one {a second} other {# seconds}}',
    values: {
      amount: 10
    }
  })
}, {
  bound: _moment.default.duration(7.5, 'second'),
  interval: _moment.default.duration(5, 'second'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.secondLabel', {
    defaultMessage: '{amount, plural, one {a second} other {# seconds}}',
    values: {
      amount: 7.5
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.secondLabel', {
    defaultMessage: '{amount, plural, one {a second} other {# seconds}}',
    values: {
      amount: 5
    }
  })
}, {
  bound: _moment.default.duration(5, 'second'),
  interval: _moment.default.duration(1, 'second'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.secondLabel', {
    defaultMessage: '{amount, plural, one {a second} other {# seconds}}',
    values: {
      amount: 5
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.secondLabel', {
    defaultMessage: '{amount, plural, one {a second} other {# seconds}}',
    values: {
      amount: 1
    }
  })
}, {
  bound: _moment.default.duration(500, 'ms'),
  interval: _moment.default.duration(100, 'ms'),
  boundLabel: _i18n.i18n.translate('data.search.timeBuckets.millisecondLabel', {
    defaultMessage: '{amount, plural, one {a millisecond} other {# milliseconds}}',
    values: {
      amount: 500
    }
  }),
  intervalLabel: _i18n.i18n.translate('data.search.timeBuckets.millisecondLabel', {
    defaultMessage: '{amount, plural, one {a millisecond} other {# milliseconds}}',
    values: {
      amount: 100
    }
  })
}];
exports.boundsDescendingRaw = boundsDescendingRaw;
const boundsDescending = boundsDescendingRaw.map(({
  bound,
  interval
}) => ({
  bound: Number(bound),
  interval: Number(interval)
}));

function getPerBucketMs(count, duration) {
  const ms = duration / count;
  return isFinite(ms) ? ms : NaN;
}

function normalizeMinimumInterval(targetMs) {
  const value = isNaN(targetMs) ? 0 : Math.max(Math.floor(targetMs), 1);
  return _moment.default.duration(value);
}
/**
 * Using some simple rules we pick a "pretty" interval that will
 * produce around the number of buckets desired given a time range.
 *
 * @param targetBucketCount desired number of buckets
 * @param duration time range the agg covers
 */


function calcAutoIntervalNear(targetBucketCount, duration) {
  const targetPerBucketMs = getPerBucketMs(targetBucketCount, duration); // Find the first bound which is smaller than our target.

  const lowerBoundIndex = boundsDescending.findIndex(({
    bound
  }) => {
    const boundMs = Number(bound);
    return boundMs <= targetPerBucketMs;
  }); // The bound immediately preceeding that lower bound contains the
  // interval most closely matching our target.

  if (lowerBoundIndex !== -1) {
    const nearestInterval = boundsDescending[lowerBoundIndex - 1].interval;
    return _moment.default.duration(nearestInterval);
  } // If the target is smaller than any of our bounds, then we'll use it for the interval as-is.


  return normalizeMinimumInterval(targetPerBucketMs);
}
/**
 * Pick a "pretty" interval that produces no more than the maxBucketCount
 * for the given time range.
 *
 * @param maxBucketCount maximum number of buckets to create
 * @param duration amount of time covered by the agg
 */


function calcAutoIntervalLessThan(maxBucketCount, duration) {
  const maxPerBucketMs = getPerBucketMs(maxBucketCount, duration);

  for (const {
    interval
  } of boundsDescending) {
    // Find the highest interval which meets our per bucket limitation.
    if (interval <= maxPerBucketMs) {
      return _moment.default.duration(interval);
    }
  } // If the max is smaller than any of our intervals, then we'll use it for the interval as-is.


  return normalizeMinimumInterval(maxPerBucketMs);
}