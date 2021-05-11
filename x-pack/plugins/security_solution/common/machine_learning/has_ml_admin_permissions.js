"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasMlAdminPermissions = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hasMlAdminPermissions = capabilities => getDataFeedPermissions(capabilities) && getJobPermissions(capabilities) && getFilterPermissions(capabilities) && getCalendarPermissions(capabilities);

exports.hasMlAdminPermissions = hasMlAdminPermissions;

const getDataFeedPermissions = ({
  capabilities
}) => capabilities.canGetDatafeeds && capabilities.canStartStopDatafeed && capabilities.canUpdateDatafeed && capabilities.canPreviewDatafeed;

const getJobPermissions = ({
  capabilities
}) => capabilities.canCreateJob && capabilities.canGetJobs && capabilities.canUpdateJob && capabilities.canDeleteJob && capabilities.canOpenJob && capabilities.canCloseJob && capabilities.canForecastJob;

const getFilterPermissions = ({
  capabilities
}) => capabilities.canGetFilters && capabilities.canCreateFilter && capabilities.canDeleteFilter;

const getCalendarPermissions = ({
  capabilities
}) => capabilities.canCreateCalendar && capabilities.canGetCalendars && capabilities.canDeleteCalendar;