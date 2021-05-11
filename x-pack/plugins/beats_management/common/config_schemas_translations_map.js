"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translateConfigSchema = exports.translatedConfigs = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const supportedConfigLabelsMap = new Map([['filebeatInputConfig.paths.ui.label', _i18n.i18n.translate('xpack.beatsManagement.filebeatInputConfig.pathsLabel', {
  defaultMessage: 'Paths'
})], ['filebeatInputConfig.paths.ui.helpText', _i18n.i18n.translate('xpack.beatsManagement.filebeatInputConfig.pathsDescription', {
  defaultMessage: 'Put each of the paths on a separate line'
})], ['filebeatInputConfig.paths.error', _i18n.i18n.translate('xpack.beatsManagement.filebeatInputConfig.pathsErrorMessage', {
  defaultMessage: 'One file path per line'
})], ['filebeatInputConfig.other.ui.label', _i18n.i18n.translate('xpack.beatsManagement.filebeatInputConfig.otherConfigLabel', {
  defaultMessage: 'Other Config'
})], ['filebeatInputConfig.other.ui.helpText', _i18n.i18n.translate('xpack.beatsManagement.filebeatInputConfig.otherConfigDescription', {
  defaultMessage: 'Use YAML format to specify other settings for the Filebeat Input'
})], ['filebeatInputConfig.other.error', _i18n.i18n.translate('xpack.beatsManagement.filebeatInputConfig.otherConfigErrorMessage', {
  defaultMessage: 'Use valid YAML format'
})], ['filebeatModuleConfig.module.ui.label', _i18n.i18n.translate('xpack.beatsManagement.filebeatModuleConfig.moduleLabel', {
  defaultMessage: 'Module'
})], ['filebeatModuleConfig.module.error', _i18n.i18n.translate('xpack.beatsManagement.filebeatModuleConfig.moduleErrorMessage', {
  defaultMessage: 'Please select a module'
})], ['filebeatModuleConfig.other.ui.label', _i18n.i18n.translate('xpack.beatsManagement.filebeatModuleConfig.otherConfigLabel', {
  defaultMessage: 'Other Config'
})], ['filebeatModuleConfig.other.ui.helpText', _i18n.i18n.translate('xpack.beatsManagement.filebeatModuleConfig.moduleDescription', {
  defaultMessage: 'Use YAML format to specify other settings for the Filebeat Module'
})], ['filebeatModuleConfig.other.error', _i18n.i18n.translate('xpack.beatsManagement.filebeatModuleConfig.otherConfigErrorMessage', {
  defaultMessage: 'Use valid YAML format'
})], ['metricbeatModuleConfig.module.ui.label', _i18n.i18n.translate('xpack.beatsManagement.metricbeatModuleConfig.moduleLabel', {
  defaultMessage: 'Module'
})], ['metricbeatModuleConfig.module.error', _i18n.i18n.translate('xpack.beatsManagement.metricbeatModuleConfig.moduleErrorMessage', {
  defaultMessage: 'Please select a module'
})], ['metricbeatModuleConfig.hosts.ui.label', _i18n.i18n.translate('xpack.beatsManagement.metricbeatModuleConfig.hostsLabel', {
  defaultMessage: 'Hosts'
})], ['metricbeatModuleConfig.hosts.ui.helpText', _i18n.i18n.translate('xpack.beatsManagement.metricbeatModuleConfig.hostsDescription', {
  defaultMessage: 'Put each of the paths on a seperate line'
})], ['metricbeatModuleConfig.hosts.error', _i18n.i18n.translate('xpack.beatsManagement.metricbeatModuleConfig.hostsErrorMessage', {
  defaultMessage: 'One file host per line'
})], ['metricbeatModuleConfig.period.ui.label', _i18n.i18n.translate('xpack.beatsManagement.metricbeatModuleConfig.periodLabel', {
  defaultMessage: 'Period'
})], ['metricbeatModuleConfig.period.error', _i18n.i18n.translate('xpack.beatsManagement.metricbeatModuleConfig.periodErrorMessage', {
  defaultMessage: 'Invalid Period, must be formatted as `10s` for 10 seconds'
})], ['metricbeatModuleConfig.other.ui.label', _i18n.i18n.translate('xpack.beatsManagement.metricbeatModuleConfig.otherConfigLabel', {
  defaultMessage: 'Other Config'
})], ['metricbeatModuleConfig.other.ui.helpText', _i18n.i18n.translate('xpack.beatsManagement.metricbeatModuleConfig.otherConfigDescription', {
  defaultMessage: 'Use YAML format to specify other settings for the Metricbeat Module'
})], ['metricbeatModuleConfig.other.error', _i18n.i18n.translate('xpack.beatsManagement.metricbeatModuleConfig.otherConfigErrorMessage', {
  defaultMessage: 'Use valid YAML format'
})], ['outputConfig.output.ui.label', _i18n.i18n.translate('xpack.beatsManagement.outputConfig.outputTypeLabel', {
  defaultMessage: 'Output Type'
})], ['outputConfig.output.error', _i18n.i18n.translate('xpack.beatsManagement.outputConfig.outputTypeErrorMessage', {
  defaultMessage: 'Please select an output type'
})], ['outputConfig.hosts.ui.label', _i18n.i18n.translate('xpack.beatsManagement.outputConfig.hostsLabel', {
  defaultMessage: 'Hosts'
})], ['outputConfig.hosts.error', _i18n.i18n.translate('xpack.beatsManagement.outputConfig.hostsErrorMessage', {
  defaultMessage: 'One file host per line'
})], ['outputConfig.username.ui.label', _i18n.i18n.translate('xpack.beatsManagement.outputConfig.usernameLabel', {
  defaultMessage: 'Username'
})], ['outputConfig.username.error', _i18n.i18n.translate('xpack.beatsManagement.outputConfig.usernameErrorMessage', {
  defaultMessage: 'Unprocessable username'
})], ['outputConfig.password.ui.label', _i18n.i18n.translate('xpack.beatsManagement.outputConfig.passwordLabel', {
  defaultMessage: 'Password'
})], ['outputConfig.password.error', _i18n.i18n.translate('xpack.beatsManagement.outputConfig.passwordErrorMessage', {
  defaultMessage: 'Unprocessable password'
})], ['supportedConfigs.filebeat.input.text', _i18n.i18n.translate('xpack.beatsManagement.tagConfig.filebeatInputLabel', {
  defaultMessage: 'Filebeat Input'
})], ['supportedConfigs.filebeat.modules.text', _i18n.i18n.translate('xpack.beatsManagement.tagConfig.filebeatModuleLabel', {
  defaultMessage: 'Filebeat Module'
})], ['supportedConfigs.metricbeatModule.text', _i18n.i18n.translate('xpack.beatsManagement.tagConfig.metricbeatModuleLabel', {
  defaultMessage: 'Metricbeat Module'
})], ['supportedConfigs.output.text', _i18n.i18n.translate('xpack.beatsManagement.tagConfig.outputLabel', {
  defaultMessage: 'Output'
})]]);
let translatedConfigs;
exports.translatedConfigs = translatedConfigs;

const translateConfigSchema = schemas => {
  if (translatedConfigs) {
    return translatedConfigs;
  }

  exports.translatedConfigs = translatedConfigs = schemas.map(schema => {
    schema.name = supportedConfigLabelsMap.get(`supportedConfigs.${schema.id}.text`) || schema.name;
    schema.configs = schema.configs.map(configBlock => {
      if (configBlock.ui.label) {
        configBlock.ui.label = supportedConfigLabelsMap.get(configBlock.ui.labelId || '') || configBlock.ui.label;
      }

      if (configBlock.ui.helpText) {
        configBlock.ui.helpText = supportedConfigLabelsMap.get(configBlock.ui.helpTextId || '') || configBlock.ui.helpText;
      }

      if (configBlock.error) {
        configBlock.error = supportedConfigLabelsMap.get(configBlock.errorId || '') || configBlock.error;
      }

      return configBlock;
    });
    return schema;
  });
  return translatedConfigs;
};

exports.translateConfigSchema = translateConfigSchema;