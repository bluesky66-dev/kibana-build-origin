"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.urlEncodeCursor = urlEncodeCursor;
exports.urlDecodeCursor = urlDecodeCursor;
exports.PaginationBuilder = void 0;

var _event = require("../../../../../common/endpoint/models/event");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A function to encode a cursor from a pagination object.
 *
 * @param data Transforms a pagination cursor into a base64 encoded string
 */


function urlEncodeCursor(data) {
  const value = JSON.stringify(data);
  return Buffer.from(value, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
/**
 * A function to decode a cursor.
 *
 * @param cursor a cursor encoded by the `urlEncodeCursor` function
 * @param decode a function to transform the parsed data into an actual type
 */


function urlDecodeCursor(cursor, decode) {
  const fixedCursor = cursor.replace(/\-/g, '+').replace(/_/g, '/');
  const data = Buffer.from(fixedCursor, 'base64').toString('utf8');
  let parsed;

  try {
    parsed = JSON.parse(data);
  } catch (e) {
    return;
  }

  return decode(parsed);
}
/**
 * This class handles constructing pagination cursors that resolver can use to return additional events in subsequent
 * queries.
 */


class PaginationBuilder {
  constructor(size, timestamp, eventID) {
    this.size = size;
    this.timestamp = timestamp;
    this.eventID = eventID;
  }
  /**
   * Validates that the parsed object is actually a PaginationCursor.
   *
   * @param parsed an object parsed from an encoded cursor.
   */


  static decode(parsed) {
    if (parsed && parsed.timestamp && parsed.eventID) {
      const {
        timestamp,
        eventID
      } = parsed;
      return {
        timestamp,
        eventID
      };
    }
  }
  /**
   * Construct a cursor to use in subsequent queries.
   *
   * @param results the events that were returned by the ES query
   */


  static buildCursor(results) {
    var _timestampSafeVersion;

    const lastResult = results[results.length - 1];
    const cursor = {
      timestamp: (_timestampSafeVersion = (0, _event.timestampSafeVersion)(lastResult)) !== null && _timestampSafeVersion !== void 0 ? _timestampSafeVersion : 0,
      eventID: (0, _event.eventIDSafeVersion)(lastResult) === undefined ? '' : String((0, _event.eventIDSafeVersion)(lastResult))
    };
    return urlEncodeCursor(cursor);
  }
  /**
   * Constructs a cursor if the requested limit has not been met.
   *
   * @param requestLimit the request limit for a query.
   * @param results the events that were returned by the ES query
   */


  static buildCursorRequestLimit(requestLimit, results) {
    if (requestLimit <= results.length && results.length > 0) {
      return PaginationBuilder.buildCursor(results);
    }

    return null;
  }
  /**
   * Creates a PaginationBuilder with an upper bound limit of results and a specific cursor to use to retrieve the next
   * set of results.
   *
   * @param limit upper bound for the number of results to return within this query
   * @param after a cursor to retrieve the next set of results
   */


  static createBuilder(limit, after) {
    if (after) {
      try {
        const cursor = urlDecodeCursor(after, PaginationBuilder.decode);

        if (cursor && cursor.timestamp && cursor.eventID) {
          return new PaginationBuilder(limit, cursor.timestamp, cursor.eventID);
        }
      } catch (err) {
        /* tslint:disable:no-empty */
      } // ignore invalid cursor values

    }

    return new PaginationBuilder(limit);
  }
  /**
   * Helper for creates an object for adding the pagination fields to a query
   *
   * @param tiebreaker a unique field to use as the tiebreaker for the search_after
   * @param timeSort is the timestamp sort direction
   * @returns an object containing the pagination information
   */


  buildQueryFieldsAsInterface(tiebreaker, timeSort = 'asc') {
    const sort = [{
      '@timestamp': timeSort
    }, {
      [tiebreaker]: 'asc'
    }];
    let searchAfter;

    if (this.timestamp && this.eventID) {
      searchAfter = [this.timestamp, this.eventID];
    }

    return {
      sort,
      size: this.size,
      searchAfter
    };
  }
  /**
   * Creates an object for adding the pagination fields to a query
   *
   * @param tiebreaker a unique field to use as the tiebreaker for the search_after
   * @param timeSort is the timestamp sort direction
   * @returns an object containing the pagination information
   */


  buildQueryFields(tiebreaker, timeSort = 'asc') {
    const fields = {};
    const pagination = this.buildQueryFieldsAsInterface(tiebreaker, timeSort);
    fields.sort = pagination.sort;
    fields.size = pagination.size;

    if (pagination.searchAfter) {
      fields.search_after = pagination.searchAfter;
    }

    return fields;
  }

}

exports.PaginationBuilder = PaginationBuilder;