"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SecurityOssPlugin = void 0;

var _rxjs = require("rxjs");

var _check_cluster_data = require("./check_cluster_data");

var _routes = require("./routes");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SecurityOssPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "config$", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "anonymousAccessServiceProvider", void 0);

    this.config$ = initializerContext.config.create();
    this.logger = initializerContext.logger.get();
  }

  setup(core) {
    const router = core.http.createRouter();
    const showInsecureClusterWarning$ = new _rxjs.BehaviorSubject(true);
    (0, _routes.setupAppStateRoute)({
      router,
      log: this.logger,
      config$: this.config$,
      displayModifier$: showInsecureClusterWarning$,
      doesClusterHaveUserData: (0, _check_cluster_data.createClusterDataCheck)(),
      getAnonymousAccessService: () => {
        var _this$anonymousAccess, _this$anonymousAccess2;

        return (_this$anonymousAccess = (_this$anonymousAccess2 = this.anonymousAccessServiceProvider) === null || _this$anonymousAccess2 === void 0 ? void 0 : _this$anonymousAccess2.call(this)) !== null && _this$anonymousAccess !== void 0 ? _this$anonymousAccess : null;
      }
    });
    (0, _routes.setupAnonymousAccessCapabilitiesRoute)({
      router,
      getAnonymousAccessService: () => {
        var _this$anonymousAccess3, _this$anonymousAccess4;

        return (_this$anonymousAccess3 = (_this$anonymousAccess4 = this.anonymousAccessServiceProvider) === null || _this$anonymousAccess4 === void 0 ? void 0 : _this$anonymousAccess4.call(this)) !== null && _this$anonymousAccess3 !== void 0 ? _this$anonymousAccess3 : null;
      }
    });
    return {
      showInsecureClusterWarning$,
      setAnonymousAccessServiceProvider: provider => {
        if (this.anonymousAccessServiceProvider) {
          throw new Error('Anonymous Access service provider is already set.');
        }

        this.anonymousAccessServiceProvider = provider;
      }
    };
  }

  start() {}

  stop() {}

}

exports.SecurityOssPlugin = SecurityOssPlugin;