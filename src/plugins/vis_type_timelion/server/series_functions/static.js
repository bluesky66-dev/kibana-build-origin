"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = _interopRequireDefault(require("lodash"));

var _datasource = _interopRequireDefault(require("../lib/classes/datasource"));

var _bluebird = _interopRequireDefault(require("bluebird"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var _default = new _datasource.default('static', {
  aliases: ['value'],
  args: [{
    name: 'value',
    // _test-data.users.*.data
    types: ['number', 'string'],
    help: _i18n.i18n.translate('timelion.help.functions.static.args.valueHelpText', {
      defaultMessage: 'The single value to to display, you can also pass several values and I will interpolate them evenly across your time range.'
    })
  }, {
    name: 'label',
    types: ['string', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.static.args.labelHelpText', {
      defaultMessage: 'A quick way to set the label for the series. You could also use the .label() function'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.staticHelpText', {
    defaultMessage: 'Draws a single value across the chart'
  }),
  fn: function staticFn(args, tlConfig) {
    let data;
    const target = tlConfig.getTargetSeries();

    if (typeof args.byName.value === 'string') {
      const points = args.byName.value.split(':');

      const begin = _lodash.default.first(target)[0];

      const end = _lodash.default.last(target)[0];

      const step = (end - begin) / (points.length - 1);
      data = _lodash.default.map(points, function (point, i) {
        return [begin + i * step, parseFloat(point)];
      });
    } else {
      data = _lodash.default.map(target, function (bucket) {
        return [bucket[0], args.byName.value];
      });
    }

    return _bluebird.default.resolve({
      type: 'seriesList',
      list: [{
        data: data,
        type: 'series',
        label: args.byName.label == null ? String(args.byName.value) : args.byName.label,
        fit: args.byName.fit || 'average'
      }]
    });
  }
});

exports.default = _default;
module.exports = exports.default;