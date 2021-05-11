"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCoreSettings = void 0;

var _accessibility = require("./accessibility");

var _date_formats = require("./date_formats");

var _misc = require("./misc");

var _navigation = require("./navigation");

var _notifications = require("./notifications");

var _theme = require("./theme");

var _state = require("./state");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getCoreSettings = () => {
  return { ...(0, _accessibility.getAccessibilitySettings)(),
    ...(0, _date_formats.getDateFormatSettings)(),
    ...(0, _misc.getMiscUiSettings)(),
    ...(0, _navigation.getNavigationSettings)(),
    ...(0, _notifications.getNotificationsSettings)(),
    ...(0, _theme.getThemeSettings)(),
    ...(0, _state.getStateSettings)()
  };
};

exports.getCoreSettings = getCoreSettings;