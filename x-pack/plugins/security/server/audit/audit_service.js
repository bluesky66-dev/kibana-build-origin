"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterEvent = filterEvent;
exports.createLoggingConfig = exports.AuditService = exports.RECORD_USAGE_INTERVAL = exports.ECS_VERSION = void 0;

var _operators = require("rxjs/operators");

var _audit_events = require("./audit_events");

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

const ECS_VERSION = '1.6.0';
exports.ECS_VERSION = ECS_VERSION;
const RECORD_USAGE_INTERVAL = 60 * 60 * 1000; // 1 hour

/**
 * @deprecated
 */

exports.RECORD_USAGE_INTERVAL = RECORD_USAGE_INTERVAL;

class AuditService {
  /**
   * @deprecated
   */

  /**
   * @deprecated
   */
  constructor(logger) {
    this.logger = logger;

    _defineProperty(this, "licenseFeaturesSubscription", void 0);

    _defineProperty(this, "allowLegacyAuditLogging", false);

    _defineProperty(this, "ecsLogger", void 0);

    _defineProperty(this, "usageIntervalId", void 0);

    this.ecsLogger = logger.get('ecs');
  }

  setup({
    license,
    config,
    logging,
    http,
    getCurrentUser,
    getSID,
    getSpaceId,
    recordAuditLoggingUsage
  }) {
    if (config.enabled && !config.appender) {
      this.licenseFeaturesSubscription = license.features$.subscribe(({
        allowLegacyAuditLogging
      }) => {
        this.allowLegacyAuditLogging = allowLegacyAuditLogging;
      });
    } // Configure logging during setup and when license changes


    logging.configure(license.features$.pipe((0, _operators.distinctUntilKeyChanged)('allowAuditLogging'), createLoggingConfig(config))); // Record feature usage at a regular interval if enabled and license allows

    if (config.enabled && config.appender) {
      license.features$.subscribe(features => {
        clearInterval(this.usageIntervalId);

        if (features.allowAuditLogging) {
          recordAuditLoggingUsage();
          this.usageIntervalId = setInterval(recordAuditLoggingUsage, RECORD_USAGE_INTERVAL);

          if (this.usageIntervalId.unref) {
            this.usageIntervalId.unref();
          }
        }
      });
    }
    /**
     * Creates an {@link AuditLogger} scoped to the current request.
     *
     * @example
     * ```typescript
     * const auditLogger = securitySetup.audit.asScoped(request);
     * auditLogger.log(event);
     * ```
     */


    const asScoped = request => {
      /**
       * Logs an {@link AuditEvent} and automatically adds meta data about the
       * current user, space and correlation id.
       *
       * Guidelines around what events should be logged and how they should be
       * structured can be found in: `/x-pack/plugins/security/README.md`
       *
       * @example
       * ```typescript
       * const auditLogger = securitySetup.audit.asScoped(request);
       * auditLogger.log({
       *   message: 'User is updating dashboard [id=123]',
       *   event: {
       *     action: 'saved_object_update',
       *     outcome: EventOutcome.UNKNOWN
       *   },
       *   kibana: {
       *     saved_object: { type: 'dashboard', id: '123' }
       *   },
       * });
       * ```
       */
      const log = async event => {
        if (!event) {
          return;
        }

        const spaceId = getSpaceId(request);
        const user = getCurrentUser(request);
        const sessionId = await getSID(request);
        const meta = {
          ecs: {
            version: ECS_VERSION
          },
          ...event,
          user: user && {
            name: user.username,
            roles: user.roles
          } || event.user,
          kibana: {
            space_id: spaceId,
            session_id: sessionId,
            ...event.kibana
          },
          trace: {
            id: request.id
          }
        };

        if (filterEvent(meta, config.ignore_filters)) {
          this.ecsLogger.info(event.message, meta);
        }
      };

      return {
        log
      };
    };
    /**
     * @deprecated
     * Use `audit.asScoped(request)` method instead to create an audit logger
     */


    const getLogger = id => {
      return {
        log: (eventType, message, data) => {
          if (!this.allowLegacyAuditLogging) {
            return;
          }

          this.logger.info(message, {
            tags: id ? [id, eventType] : [eventType],
            eventType,
            ...data
          });
        }
      };
    };

    http.registerOnPostAuth((request, response, t) => {
      if (request.auth.isAuthenticated) {
        asScoped(request).log((0, _audit_events.httpRequestEvent)({
          request
        }));
      }

      return t.next();
    });
    return {
      asScoped,
      getLogger
    };
  }

  stop() {
    if (this.licenseFeaturesSubscription) {
      this.licenseFeaturesSubscription.unsubscribe();
      this.licenseFeaturesSubscription = undefined;
    }

    clearInterval(this.usageIntervalId);
  }

}

exports.AuditService = AuditService;

const createLoggingConfig = config => (0, _operators.map)(features => {
  var _config$appender;

  return {
    appenders: {
      auditTrailAppender: (_config$appender = config.appender) !== null && _config$appender !== void 0 ? _config$appender : {
        type: 'console',
        layout: {
          type: 'pattern',
          highlight: true
        }
      }
    },
    loggers: [{
      name: 'audit.ecs',
      level: config.enabled && config.appender && features.allowAuditLogging ? 'info' : 'off',
      appenders: ['auditTrailAppender']
    }]
  };
});

exports.createLoggingConfig = createLoggingConfig;

function filterEvent(event, ignoreFilters) {
  if (ignoreFilters) {
    return !ignoreFilters.some(rule => {
      var _event$kibana;

      return (!rule.actions || rule.actions.includes(event.event.action)) && (!rule.categories || rule.categories.includes(event.event.category)) && (!rule.types || rule.types.includes(event.event.type)) && (!rule.outcomes || rule.outcomes.includes(event.event.outcome)) && (!rule.spaces || rule.spaces.includes((_event$kibana = event.kibana) === null || _event$kibana === void 0 ? void 0 : _event$kibana.space_id));
    });
  }

  return true;
}