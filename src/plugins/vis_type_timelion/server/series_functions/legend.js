"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = require("@kbn/i18n");

var _alter = _interopRequireDefault(require("../lib/alter.js"));

var _chainable = _interopRequireDefault(require("../lib/classes/chainable"));

var _lib = require("../../common/lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var _default = new _chainable.default('legend', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'position',
    types: ['string', 'boolean', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.legend.args.positionHelpText', {
      defaultMessage: 'Corner to place the legend in: nw, ne, se, or sw. You can also pass false to disable the legend',
      description: '"nw", "ne", "se", "sw" and "false" are keywords and must not be translated.'
    }),
    suggestions: [{
      name: 'false',
      help: _i18n.i18n.translate('timelion.help.functions.legend.args.position.suggestions.falseHelpText', {
        defaultMessage: 'disable legend'
      })
    }, {
      name: 'nw',
      help: _i18n.i18n.translate('timelion.help.functions.legend.args.position.suggestions.nwHelpText', {
        defaultMessage: 'place legend in north west corner'
      })
    }, {
      name: 'ne',
      help: _i18n.i18n.translate('timelion.help.functions.legend.args.position.suggestions.neHelpText', {
        defaultMessage: 'place legend in north east corner'
      })
    }, {
      name: 'se',
      help: _i18n.i18n.translate('timelion.help.functions.legend.args.position.suggestions.seHelpText', {
        defaultMessage: 'place legend in south east corner'
      })
    }, {
      name: 'sw',
      help: _i18n.i18n.translate('timelion.help.functions.legend.args.position.suggestions.swHelpText', {
        defaultMessage: 'place legend in south west corner'
      })
    }]
  }, {
    name: 'columns',
    types: ['number', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.legend.args.columnsHelpText', {
      defaultMessage: 'Number of columns to divide the legend into'
    })
  }, {
    name: 'showTime',
    types: ['boolean'],
    help: _i18n.i18n.translate('timelion.help.functions.legend.args.showTimeHelpText', {
      defaultMessage: 'Show time value in legend when hovering over graph. Default: true'
    })
  }, {
    name: 'timeFormat',
    types: ['string'],
    help: _i18n.i18n.translate('timelion.help.functions.legend.args.timeFormatHelpText', {
      defaultMessage: 'moment.js format pattern. Default: {defaultTimeFormat}',
      values: {
        defaultTimeFormat: _lib.DEFAULT_TIME_FORMAT
      }
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.legendHelpText', {
    defaultMessage: 'Set the position and style of the legend on the plot'
  }),
  fn: function legendFn(args) {
    return (0, _alter.default)(args, function (eachSeries, position, columns, showTime = true, timeFormat = _lib.DEFAULT_TIME_FORMAT) {
      eachSeries._global = eachSeries._global || {};
      eachSeries._global.legend = eachSeries._global.legend || {};
      eachSeries._global.legend.noColumns = columns;
      eachSeries._global.legend.showTime = showTime;
      eachSeries._global.legend.timeFormat = timeFormat;

      if (position === false) {
        eachSeries._global.legend.show = false;
        eachSeries._global.legend.showTime = false;
      } else {
        eachSeries._global.legend.position = position;
      }

      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;