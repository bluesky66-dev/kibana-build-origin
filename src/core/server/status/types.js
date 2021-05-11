"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServiceStatusLevels = void 0;

var _std = require("@kbn/std");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The current "level" of availability of a service.
 *
 * @remarks
 * The values implement `valueOf` to allow for easy comparisons between status levels with <, >, etc. Higher values
 * represent higher severities. Note that the default `Array.prototype.sort` implementation does not correctly sort
 * these values.
 *
 * A snapshot serializer is available in `src/core/server/test_utils` to ease testing of these values with Jest.
 *
 * @public
 */
const ServiceStatusLevels = (0, _std.deepFreeze)({
  /**
   * Everything is working!
   */
  available: {
    toString: () => 'available',
    valueOf: () => 0,

    toJSON() {
      return this.toString();
    }

  },

  /**
   * Some features may not be working.
   */
  degraded: {
    toString: () => 'degraded',
    valueOf: () => 1,

    toJSON() {
      return this.toString();
    }

  },

  /**
   * The service is unavailable, but other functions that do not depend on this service should work.
   */
  unavailable: {
    toString: () => 'unavailable',
    valueOf: () => 2,

    toJSON() {
      return this.toString();
    }

  },

  /**
   * Block all user functions and display the status page, reserved for Core services only.
   */
  critical: {
    toString: () => 'critical',
    valueOf: () => 3,

    toJSON() {
      return this.toString();
    }

  }
});
/**
 * A convenience type that represents the union of each value in {@link ServiceStatusLevels}.
 * @public
 */

exports.ServiceStatusLevels = ServiceStatusLevels;