"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoreApp = void 0;

var _path = _interopRequireDefault(require("path"));

var _utils = require("../../../core/server/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @internal */
class CoreApp {
  constructor(core) {
    _defineProperty(this, "logger", void 0);

    this.logger = core.logger.get('core-app');
  }

  setup(coreSetup) {
    this.logger.debug('Setting up core app.');
    this.registerDefaultRoutes(coreSetup);
    this.registerStaticDirs(coreSetup);
  }

  registerDefaultRoutes(coreSetup) {
    const httpSetup = coreSetup.http;
    const router = httpSetup.createRouter('/');
    router.get({
      path: '/',
      validate: false
    }, async (context, req, res) => {
      const defaultRoute = await context.core.uiSettings.client.get('defaultRoute');
      const basePath = httpSetup.basePath.get(req);
      const url = `${basePath}${defaultRoute}`;
      return res.redirected({
        headers: {
          location: url
        }
      });
    });
    router.get({
      path: '/core',
      validate: false
    }, async (context, req, res) => res.ok({
      body: {
        version: '0.0.1'
      }
    }));
    const anonymousStatusPage = coreSetup.status.isStatusPageAnonymous();
    coreSetup.httpResources.createRegistrar(router).register({
      path: '/status',
      validate: false,
      options: {
        authRequired: !anonymousStatusPage
      }
    }, async (context, request, response) => {
      if (anonymousStatusPage) {
        return response.renderAnonymousCoreApp();
      } else {
        return response.renderCoreApp();
      }
    });
  }

  registerStaticDirs(coreSetup) {
    coreSetup.http.registerStaticDir('/ui/{path*}', _path.default.resolve(__dirname, './assets'));
    coreSetup.http.registerStaticDir('/node_modules/@kbn/ui-framework/dist/{path*}', (0, _utils.fromRoot)('node_modules/@kbn/ui-framework/dist'));
  }

}

exports.CoreApp = CoreApp;