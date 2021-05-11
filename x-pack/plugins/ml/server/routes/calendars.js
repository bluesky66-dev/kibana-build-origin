"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calendars = calendars;

var _error_wrapper = require("../client/error_wrapper");

var _calendars_schema = require("./schemas/calendars_schema");

var _calendar = require("../models/calendar");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getAllCalendars(mlClient) {
  const cal = new _calendar.CalendarManager(mlClient);
  return cal.getAllCalendars();
}

function getCalendar(mlClient, calendarId) {
  const cal = new _calendar.CalendarManager(mlClient);
  return cal.getCalendar(calendarId);
}

function newCalendar(mlClient, calendar) {
  const cal = new _calendar.CalendarManager(mlClient);
  return cal.newCalendar(calendar);
}

function updateCalendar(mlClient, calendarId, calendar) {
  const cal = new _calendar.CalendarManager(mlClient);
  return cal.updateCalendar(calendarId, calendar);
}

function deleteCalendar(mlClient, calendarId) {
  const cal = new _calendar.CalendarManager(mlClient);
  return cal.deleteCalendar(calendarId);
}

function getCalendarsByIds(mlClient, calendarIds) {
  const cal = new _calendar.CalendarManager(mlClient);
  return cal.getCalendarsByIds(calendarIds);
}

function calendars({
  router,
  routeGuard
}) {
  /**
   * @apiGroup Calendars
   *
   * @api {get} /api/ml/calendars Gets calendars
   * @apiName GetCalendars
   * @apiDescription Gets calendars - size limit has been explicitly set to 1000
   */
  router.get({
    path: '/api/ml/calendars',
    validate: false,
    options: {
      tags: ['access:ml:canGetCalendars']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    response
  }) => {
    try {
      const resp = await getAllCalendars(mlClient);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup Calendars
   *
   * @api {get} /api/ml/calendars/:calendarIds Gets a calendar
   * @apiName GetCalendarById
   * @apiDescription Gets calendar by id
   *
   * @apiSchema (params) calendarIdsSchema
   */

  router.get({
    path: '/api/ml/calendars/{calendarIds}',
    validate: {
      params: _calendars_schema.calendarIdsSchema
    },
    options: {
      tags: ['access:ml:canGetCalendars']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    let returnValue;

    try {
      const calendarIds = request.params.calendarIds.split(',');

      if (calendarIds.length === 1) {
        returnValue = await getCalendar(mlClient, calendarIds[0]);
      } else {
        returnValue = await getCalendarsByIds(mlClient, calendarIds);
      }

      return response.ok({
        body: returnValue
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup Calendars
   *
   * @api {put} /api/ml/calendars Creates a calendar
   * @apiName PutCalendars
   * @apiDescription Creates a calendar
   *
   * @apiSchema (body) calendarSchema
   */

  router.put({
    path: '/api/ml/calendars',
    validate: {
      body: _calendars_schema.calendarSchema
    },
    options: {
      tags: ['access:ml:canCreateCalendar']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const body = request.body;
      const resp = await newCalendar(mlClient, body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup Calendars
   *
   * @api {put} /api/ml/calendars/:calendarId Updates a calendar
   * @apiName UpdateCalendarById
   * @apiDescription Updates a calendar
   *
   * @apiSchema (params) calendarIdSchema
   * @apiSchema (body) calendarSchema
   */

  router.put({
    path: '/api/ml/calendars/{calendarId}',
    validate: {
      params: _calendars_schema.calendarIdSchema,
      body: _calendars_schema.calendarSchema
    },
    options: {
      tags: ['access:ml:canCreateCalendar']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        calendarId
      } = request.params;
      const body = request.body;
      const resp = await updateCalendar(mlClient, calendarId, body);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
  /**
   * @apiGroup Calendars
   *
   * @api {delete} /api/ml/calendars/:calendarId Deletes a calendar
   * @apiName DeleteCalendarById
   * @apiDescription Deletes a calendar
   *
   * @apiSchema (params) calendarIdSchema
   */

  router.delete({
    path: '/api/ml/calendars/{calendarId}',
    validate: {
      params: _calendars_schema.calendarIdSchema
    },
    options: {
      tags: ['access:ml:canDeleteCalendar']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        calendarId
      } = request.params;
      const resp = await deleteCalendar(mlClient, calendarId);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}