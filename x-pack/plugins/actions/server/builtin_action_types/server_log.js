"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionType = getActionType;
exports.ActionTypeId = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _string_utils = require("./lib/string_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ParamsSchema = _configSchema.schema.object({
  message: _configSchema.schema.string(),
  level: _configSchema.schema.oneOf([_configSchema.schema.literal('trace'), _configSchema.schema.literal('debug'), _configSchema.schema.literal('info'), _configSchema.schema.literal('warn'), _configSchema.schema.literal('error'), _configSchema.schema.literal('fatal')], {
    defaultValue: 'info'
  })
});

const ActionTypeId = '.server-log'; // action type definition

exports.ActionTypeId = ActionTypeId;

function getActionType({
  logger
}) {
  return {
    id: ActionTypeId,
    minimumLicenseRequired: 'basic',
    name: _i18n.i18n.translate('xpack.actions.builtin.serverLogTitle', {
      defaultMessage: 'Server log'
    }),
    validate: {
      params: ParamsSchema
    },
    executor: (0, _lodash.curry)(executor)({
      logger
    })
  };
} // action executor


async function executor({
  logger
}, execOptions) {
  const actionId = execOptions.actionId;
  const params = execOptions.params;
  const sanitizedMessage = (0, _string_utils.withoutControlCharacters)(params.message);

  try {
    logger[params.level](`Server log: ${sanitizedMessage}`);
  } catch (err) {
    const message = _i18n.i18n.translate('xpack.actions.builtin.serverLog.errorLoggingErrorMessage', {
      defaultMessage: 'error logging message'
    });

    return {
      status: 'error',
      message,
      serviceMessage: err.message,
      actionId
    };
  }

  return {
    status: 'ok',
    actionId
  };
}