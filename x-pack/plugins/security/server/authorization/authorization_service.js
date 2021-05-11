"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Actions", {
  enumerable: true,
  get: function () {
    return _actions.Actions;
  }
});
Object.defineProperty(exports, "CheckSavedObjectsPrivileges", {
  enumerable: true,
  get: function () {
    return _check_saved_objects_privileges.CheckSavedObjectsPrivileges;
  }
});
Object.defineProperty(exports, "featurePrivilegeIterator", {
  enumerable: true,
  get: function () {
    return _privileges.featurePrivilegeIterator;
  }
});
exports.AuthorizationService = void 0;

var _querystring = _interopRequireDefault(require("querystring"));

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var UiSharedDeps = _interopRequireWildcard(require("@kbn/ui-shared-deps"));

var _actions = require("./actions");

var _check_privileges = require("./check_privileges");

var _check_privileges_dynamically = require("./check_privileges_dynamically");

var _check_saved_objects_privileges = require("./check_saved_objects_privileges");

var _mode = require("./mode");

var _privileges = require("./privileges");

var _app_authorization = require("./app_authorization");

var _api_authorization = require("./api_authorization");

var _disable_ui_capabilities = require("./disable_ui_capabilities");

var _validate_feature_privileges = require("./validate_feature_privileges");

var _validate_reserved_privileges = require("./validate_reserved_privileges");

var _register_privileges_with_cluster = require("./register_privileges_with_cluster");

var _constants = require("../../common/constants");

var _authentication = require("../authentication");

var _reset_session_page = require("./reset_session_page");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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

class AuthorizationService {
  constructor() {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "applicationName", void 0);

    _defineProperty(this, "privileges", void 0);

    _defineProperty(this, "statusSubscription", void 0);
  }

  setup({
    http,
    capabilities,
    packageVersion,
    buildNumber,
    getClusterClient,
    license,
    loggers,
    features,
    kibanaIndexName,
    getSpacesService,
    getCurrentUser
  }) {
    this.logger = loggers.get('authorization');
    this.applicationName = `${_constants.APPLICATION_PREFIX}${kibanaIndexName}`;
    const mode = (0, _mode.authorizationModeFactory)(license);
    const actions = new _actions.Actions(packageVersion);
    this.privileges = (0, _privileges.privilegesFactory)(actions, features, license);
    const checkPrivilegesWithRequest = (0, _check_privileges.checkPrivilegesWithRequestFactory)(actions, getClusterClient, this.applicationName);
    const authz = {
      actions,
      applicationName: this.applicationName,
      mode,
      privileges: this.privileges,
      checkPrivilegesWithRequest,
      checkPrivilegesDynamicallyWithRequest: (0, _check_privileges_dynamically.checkPrivilegesDynamicallyWithRequestFactory)(checkPrivilegesWithRequest, getSpacesService),
      checkSavedObjectsPrivilegesWithRequest: (0, _check_saved_objects_privileges.checkSavedObjectsPrivilegesWithRequestFactory)(checkPrivilegesWithRequest, getSpacesService)
    };
    capabilities.registerSwitcher(async (request, uiCapabilities) => {
      // If we have a license which doesn't enable security, or we're a legacy user we shouldn't
      // disable any ui capabilities
      if (!mode.useRbacForRequest(request)) {
        return uiCapabilities;
      }

      const disableUICapabilities = (0, _disable_ui_capabilities.disableUICapabilitiesFactory)(request, features.getKibanaFeatures(), features.getElasticsearchFeatures(), this.logger, authz, getCurrentUser(request));

      if (!request.auth.isAuthenticated) {
        return disableUICapabilities.all(uiCapabilities);
      }

      return await disableUICapabilities.usingPrivileges(uiCapabilities);
    });
    (0, _api_authorization.initAPIAuthorization)(http, authz, loggers.get('api-authorization'));
    (0, _app_authorization.initAppAuthorization)(http, authz, loggers.get('app-authorization'), features);
    http.registerOnPreResponse((request, preResponse, toolkit) => {
      if (preResponse.statusCode === 403 && (0, _authentication.canRedirectRequest)(request)) {
        const basePath = http.basePath.get(request);
        const next = `${basePath}${request.url.pathname}${request.url.search}`;
        const regularBundlePath = `${basePath}/${buildNumber}/bundles`;
        const logoutUrl = http.basePath.prepend(`/api/security/logout?${_querystring.default.stringify({
          next
        })}`);
        const styleSheetPaths = [`${regularBundlePath}/kbn-ui-shared-deps/${UiSharedDeps.baseCssDistFilename}`, `${regularBundlePath}/kbn-ui-shared-deps/${UiSharedDeps.lightCssDistFilename}`, `${basePath}/node_modules/@kbn/ui-framework/dist/kui_light.css`, `${basePath}/ui/legacy_light_theme.css`];
        const body = (0, _server.renderToStaticMarkup)( /*#__PURE__*/_react.default.createElement(_reset_session_page.ResetSessionPage, {
          logoutUrl: logoutUrl,
          styleSheetPaths: styleSheetPaths,
          basePath: basePath
        }));
        return toolkit.render({
          body,
          headers: {
            'Content-Security-Policy': http.csp.header
          }
        });
      }

      return toolkit.next();
    });
    return authz;
  }

  start({
    clusterClient,
    features,
    online$
  }) {
    const allFeatures = features.getKibanaFeatures();
    (0, _validate_feature_privileges.validateFeaturePrivileges)(allFeatures);
    (0, _validate_reserved_privileges.validateReservedPrivileges)(allFeatures);
    this.statusSubscription = online$.subscribe(async ({
      scheduleRetry
    }) => {
      try {
        await (0, _register_privileges_with_cluster.registerPrivilegesWithCluster)(this.logger, this.privileges, this.applicationName, clusterClient);
      } catch (err) {
        scheduleRetry();
      }
    });
  }

  stop() {
    if (this.statusSubscription !== undefined) {
      this.statusSubscription.unsubscribe();
      this.statusSubscription = undefined;
    }
  }

}

exports.AuthorizationService = AuthorizationService;