"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const configSchema = _configSchema.schema.object({
  search: _configSchema.schema.object({
    sessions: _configSchema.schema.object({
      /**
       * Turns the feature on \ off (incl. removing indicator and management screens)
       */
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),

      /**
       * pageSize controls how many search session objects we load at once while monitoring
       * session completion
       */
      pageSize: _configSchema.schema.number({
        defaultValue: 100
      }),

      /**
       * trackingInterval controls how often we track search session objects progress
       */
      trackingInterval: _configSchema.schema.duration({
        defaultValue: '10s'
      }),

      /**
       * monitoringTaskTimeout controls for how long task manager waits for search session monitoring task to complete before considering it timed out,
       * If tasks timeouts it receives cancel signal and next task starts in "trackingInterval" time
       */
      monitoringTaskTimeout: _configSchema.schema.duration({
        defaultValue: '5m'
      }),

      /**
       * notTouchedTimeout controls how long do we store unpersisted search session results,
       * after the last search in the session has completed
       */
      notTouchedTimeout: _configSchema.schema.duration({
        defaultValue: '5m'
      }),

      /**
       * notTouchedInProgressTimeout controls how long do allow a search session to run after
       * a user has navigated away without persisting
       */
      notTouchedInProgressTimeout: _configSchema.schema.duration({
        defaultValue: '1m'
      }),

      /**
       * maxUpdateRetries controls how many retries we perform while attempting to save a search session
       */
      maxUpdateRetries: _configSchema.schema.number({
        defaultValue: 3
      }),

      /**
       * defaultExpiration controls how long search sessions are valid for, until they are expired.
       */
      defaultExpiration: _configSchema.schema.duration({
        defaultValue: '7d'
      }),
      management: _configSchema.schema.object({
        /**
         * maxSessions controls how many saved search sessions we display per page on the management screen.
         */
        maxSessions: _configSchema.schema.number({
          defaultValue: 10000
        }),

        /**
         * refreshInterval controls how often we refresh the management screen.
         */
        refreshInterval: _configSchema.schema.duration({
          defaultValue: '10s'
        }),

        /**
         * refreshTimeout controls how often we refresh the management screen.
         */
        refreshTimeout: _configSchema.schema.duration({
          defaultValue: '1m'
        }),
        expiresSoonWarning: _configSchema.schema.duration({
          defaultValue: '1d'
        })
      })
    })
  })
});

exports.configSchema = configSchema;