"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateFormatSettings = void 0;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getDateFormatSettings = () => {
  const weekdays = _momentTimezone.default.weekdays().slice();

  const [defaultWeekday] = weekdays;
  const timezones = ['Browser', ..._momentTimezone.default.tz.names() // We need to filter out some time zones, that moment.js knows about, but Elasticsearch
  // does not understand and would fail thus with a 400 bad request when using them.
  .filter(tz => !['America/Nuuk', 'EST', 'HST', 'ROC', 'MST'].includes(tz))];
  return {
    dateFormat: {
      name: _i18n.i18n.translate('core.ui_settings.params.dateFormatTitle', {
        defaultMessage: 'Date format'
      }),
      value: 'MMM D, YYYY @ HH:mm:ss.SSS',
      description: _i18n.i18n.translate('core.ui_settings.params.dateFormatText', {
        defaultMessage: 'When displaying a pretty formatted date, use this {formatLink}',
        description: 'Part of composite text: core.ui_settings.params.dateFormatText + ' + 'core.ui_settings.params.dateFormat.optionsLinkText',
        values: {
          formatLink: '<a href="https://momentjs.com/docs/#/displaying/format/" target="_blank" rel="noopener noreferrer">' + _i18n.i18n.translate('core.ui_settings.params.dateFormat.optionsLinkText', {
            defaultMessage: 'format'
          }) + '</a>'
        }
      }),
      schema: _configSchema.schema.string()
    },
    'dateFormat:tz': {
      name: _i18n.i18n.translate('core.ui_settings.params.dateFormat.timezoneTitle', {
        defaultMessage: 'Timezone for date formatting'
      }),
      value: 'Browser',
      description: _i18n.i18n.translate('core.ui_settings.params.dateFormat.timezoneText', {
        defaultMessage: 'Which timezone should be used. {defaultOption} will use the timezone detected by your browser.',
        values: {
          defaultOption: '"Browser"'
        }
      }),
      type: 'select',
      options: timezones,
      requiresPageReload: true,
      schema: _configSchema.schema.string({
        validate: value => {
          if (!timezones.includes(value)) {
            return _i18n.i18n.translate('core.ui_settings.params.dateFormat.timezone.invalidValidationMessage', {
              defaultMessage: 'Invalid timezone: {timezone}',
              values: {
                timezone: value
              }
            });
          }
        }
      })
    },
    'dateFormat:scaled': {
      name: _i18n.i18n.translate('core.ui_settings.params.dateFormat.scaledTitle', {
        defaultMessage: 'Scaled date format'
      }),
      type: 'json',
      value: `[
  ["", "HH:mm:ss.SSS"],
  ["PT1S", "HH:mm:ss"],
  ["PT1M", "HH:mm"],
  ["PT1H", "YYYY-MM-DD HH:mm"],
  ["P1DT", "YYYY-MM-DD"],
  ["P1YT", "YYYY"]
]`,
      description: _i18n.i18n.translate('core.ui_settings.params.dateFormat.scaledText', {
        defaultMessage: 'Values that define the format used in situations where time-based ' + 'data is rendered in order, and formatted timestamps should adapt to the ' + 'interval between measurements. Keys are {intervalsLink}.',
        description: 'Part of composite text: core.ui_settings.params.dateFormat.scaledText + ' + 'core.ui_settings.params.dateFormat.scaled.intervalsLinkText',
        values: {
          intervalsLink: '<a href="http://en.wikipedia.org/wiki/ISO_8601#Time_intervals" target="_blank" rel="noopener noreferrer">' + _i18n.i18n.translate('core.ui_settings.params.dateFormat.scaled.intervalsLinkText', {
            defaultMessage: 'ISO8601 intervals'
          }) + '</a>'
        }
      }),
      schema: _configSchema.schema.string()
    },
    'dateFormat:dow': {
      name: _i18n.i18n.translate('core.ui_settings.params.dateFormat.dayOfWeekTitle', {
        defaultMessage: 'Day of week'
      }),
      value: defaultWeekday,
      description: _i18n.i18n.translate('core.ui_settings.params.dateFormat.dayOfWeekText', {
        defaultMessage: 'What day should weeks start on?'
      }),
      type: 'select',
      options: weekdays,
      schema: _configSchema.schema.string({
        validate: value => {
          if (!weekdays.includes(value)) {
            return _i18n.i18n.translate('core.ui_settings.params.dayOfWeekText.invalidValidationMessage', {
              defaultMessage: 'Invalid day of week: {dayOfWeek}',
              values: {
                dayOfWeek: value
              }
            });
          }
        }
      })
    },
    dateNanosFormat: {
      name: _i18n.i18n.translate('core.ui_settings.params.dateNanosFormatTitle', {
        defaultMessage: 'Date with nanoseconds format'
      }),
      value: 'MMM D, YYYY @ HH:mm:ss.SSSSSSSSS',
      description: _i18n.i18n.translate('core.ui_settings.params.dateNanosFormatText', {
        defaultMessage: 'Used for the {dateNanosLink} datatype of Elasticsearch',
        values: {
          dateNanosLink: '<a href="https://www.elastic.co/guide/en/elasticsearch/reference/master/date_nanos.html" target="_blank" rel="noopener noreferrer">' + _i18n.i18n.translate('core.ui_settings.params.dateNanosLinkTitle', {
            defaultMessage: 'date_nanos'
          }) + '</a>'
        }
      }),
      schema: _configSchema.schema.string()
    }
  };
};

exports.getDateFormatSettings = getDateFormatSettings;