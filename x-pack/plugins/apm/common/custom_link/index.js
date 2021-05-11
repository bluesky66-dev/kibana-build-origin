"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NO_PERMISSION_LABEL = exports.INVALID_LICENSE = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const INVALID_LICENSE = _i18n.i18n.translate('xpack.apm.settings.customizeUI.customLink.license.text', {
  defaultMessage: "To create custom links, you must be subscribed to an Elastic Gold license or above. With it, you'll have the ability to create custom links to improve your workflow when analyzing your services."
});

exports.INVALID_LICENSE = INVALID_LICENSE;

const NO_PERMISSION_LABEL = _i18n.i18n.translate('xpack.apm.settings.customizeUI.customLink.noPermissionTooltipLabel', {
  defaultMessage: "Your user role doesn't have permissions to create custom links"
});

exports.NO_PERMISSION_LABEL = NO_PERMISSION_LABEL;