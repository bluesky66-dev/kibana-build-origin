"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalendarManager = void 0;

var _lodash = require("lodash");

var _event_manager = require("./event_manager");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class CalendarManager {
  constructor(mlClient) {
    _defineProperty(this, "_mlClient", void 0);

    _defineProperty(this, "_eventManager", void 0);

    this._mlClient = mlClient;
    this._eventManager = new _event_manager.EventManager(mlClient);
  }

  async getCalendar(calendarId) {
    const {
      body
    } = await this._mlClient.getCalendars({
      calendar_id: calendarId
    });
    const calendars = body.calendars;
    const calendar = calendars[0]; // Endpoint throws a 404 if calendar is not found.

    calendar.events = await this._eventManager.getCalendarEvents(calendarId);
    return calendar;
  }

  async getAllCalendars() {
    const {
      body
    } = await this._mlClient.getCalendars({
      size: 1000
    });
    const events = await this._eventManager.getAllEvents();
    const calendars = body.calendars;
    calendars.forEach(cal => cal.events = []); // loop events and combine with related calendars

    events.forEach(event => {
      const calendar = calendars.find(cal => cal.calendar_id === event.calendar_id);

      if (calendar) {
        calendar.events.push(event);
      }
    });
    return calendars;
  }
  /**
   * Gets a list of calendar objects based on provided ids.
   * @param calendarIds
   * @returns {Promise<*>}
   */


  async getCalendarsByIds(calendarIds) {
    const calendars = await this.getAllCalendars();
    return calendars.filter(calendar => calendarIds.includes(calendar.calendar_id));
  }

  async newCalendar(calendar) {
    const {
      calendarId,
      events,
      ...newCalendar
    } = calendar;
    await this._mlClient.putCalendar({
      calendar_id: calendarId,
      body: newCalendar
    });

    if (events.length) {
      await this._eventManager.addEvents(calendarId, events);
    } // return the newly created calendar


    return await this.getCalendar(calendarId);
  }

  async updateCalendar(calendarId, calendar) {
    const origCalendar = await this.getCalendar(calendarId); // update job_ids

    const jobsToAdd = (0, _lodash.difference)(calendar.job_ids, origCalendar.job_ids);
    const jobsToRemove = (0, _lodash.difference)(origCalendar.job_ids, calendar.job_ids); // workout the differences between the original events list and the new one
    // if an event has no event_id, it must be new

    const eventsToAdd = calendar.events.filter(event => origCalendar.events.find(e => this._eventManager.isEqual(e, event)) === undefined); // if an event in the original calendar cannot be found, it must have been deleted

    const eventsToRemove = origCalendar.events.filter(event => calendar.events.find(e => this._eventManager.isEqual(e, event)) === undefined); // note, both of the loops below could be removed if the add and delete endpoints
    // allowed multiple job_ids
    // add all new jobs

    if (jobsToAdd.length) {
      await this._mlClient.putCalendarJob({
        calendar_id: calendarId,
        job_id: jobsToAdd.join(',')
      });
    } // remove all removed jobs


    if (jobsToRemove.length) {
      await this._mlClient.deleteCalendarJob({
        calendar_id: calendarId,
        job_id: jobsToRemove.join(',')
      });
    } // add all new events


    if (eventsToAdd.length !== 0) {
      await this._eventManager.addEvents(calendarId, eventsToAdd);
    } // remove all removed events


    await Promise.all(eventsToRemove.map(async event => {
      await this._eventManager.deleteEvent(calendarId, event.event_id);
    })); // return the updated calendar

    return await this.getCalendar(calendarId);
  }

  async deleteCalendar(calendarId) {
    const {
      body
    } = await this._mlClient.deleteCalendar({
      calendar_id: calendarId
    });
    return body;
  }

}

exports.CalendarManager = CalendarManager;