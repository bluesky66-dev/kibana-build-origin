"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotificationsSettings = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getNotificationsSettings = () => {
  return {
    'notifications:banner': {
      name: _i18n.i18n.translate('core.ui_settings.params.notifications.bannerTitle', {
        defaultMessage: 'Custom banner notification'
      }),
      value: '',
      type: 'markdown',
      description: _i18n.i18n.translate('core.ui_settings.params.notifications.bannerText', {
        defaultMessage: 'A custom banner intended for temporary notices to all users. {markdownLink}.',
        description: 'Part of composite text: core.ui_settings.params.notifications.bannerText + ' + 'core.ui_settings.params.notifications.banner.markdownLinkText',
        values: {
          markdownLink: `<a href="https://help.github.com/articles/basic-writing-and-formatting-syntax/"
            target="_blank" rel="noopener">` + _i18n.i18n.translate('core.ui_settings.params.notifications.banner.markdownLinkText', {
            defaultMessage: 'Markdown supported'
          }) + '</a>'
        }
      }),
      category: ['notifications'],
      sensitive: true,
      schema: _configSchema.schema.string()
    },
    'notifications:lifetime:banner': {
      name: _i18n.i18n.translate('core.ui_settings.params.notifications.bannerLifetimeTitle', {
        defaultMessage: 'Banner notification lifetime'
      }),
      value: 3000000,
      description: _i18n.i18n.translate('core.ui_settings.params.notifications.bannerLifetimeText', {
        defaultMessage: 'The time in milliseconds which a banner notification will be displayed on-screen for. ' + 'Setting to {infinityValue} will disable the countdown.',
        values: {
          infinityValue: 'Infinity'
        }
      }),
      type: 'number',
      category: ['notifications'],
      schema: _configSchema.schema.oneOf([_configSchema.schema.number({
        min: 0
      }), _configSchema.schema.literal('Infinity')])
    },
    'notifications:lifetime:error': {
      name: _i18n.i18n.translate('core.ui_settings.params.notifications.errorLifetimeTitle', {
        defaultMessage: 'Error notification lifetime'
      }),
      value: 300000,
      description: _i18n.i18n.translate('core.ui_settings.params.notifications.errorLifetimeText', {
        defaultMessage: 'The time in milliseconds which an error notification will be displayed on-screen for. ' + 'Setting to {infinityValue} will disable.',
        values: {
          infinityValue: 'Infinity'
        }
      }),
      type: 'number',
      category: ['notifications'],
      schema: _configSchema.schema.oneOf([_configSchema.schema.number({
        min: 0
      }), _configSchema.schema.literal('Infinity')])
    },
    'notifications:lifetime:warning': {
      name: _i18n.i18n.translate('core.ui_settings.params.notifications.warningLifetimeTitle', {
        defaultMessage: 'Warning notification lifetime'
      }),
      value: 10000,
      description: _i18n.i18n.translate('core.ui_settings.params.notifications.warningLifetimeText', {
        defaultMessage: 'The time in milliseconds which a warning notification will be displayed on-screen for. ' + 'Setting to {infinityValue} will disable.',
        values: {
          infinityValue: 'Infinity'
        }
      }),
      type: 'number',
      category: ['notifications'],
      schema: _configSchema.schema.oneOf([_configSchema.schema.number({
        min: 0
      }), _configSchema.schema.literal('Infinity')])
    },
    'notifications:lifetime:info': {
      name: _i18n.i18n.translate('core.ui_settings.params.notifications.infoLifetimeTitle', {
        defaultMessage: 'Info notification lifetime'
      }),
      value: 5000,
      description: _i18n.i18n.translate('core.ui_settings.params.notifications.infoLifetimeText', {
        defaultMessage: 'The time in milliseconds which an information notification will be displayed on-screen for. ' + 'Setting to {infinityValue} will disable.',
        values: {
          infinityValue: 'Infinity'
        }
      }),
      type: 'number',
      category: ['notifications'],
      schema: _configSchema.schema.oneOf([_configSchema.schema.number({
        min: 0
      }), _configSchema.schema.literal('Infinity')])
    }
  };
};

exports.getNotificationsSettings = getNotificationsSettings;