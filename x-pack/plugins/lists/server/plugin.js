"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListPlugin = void 0;

var _init_routes = require("./routes/init_routes");

var _list_client = require("./services/lists/list_client");

var _get_space_id = require("./get_space_id");

var _get_user = require("./get_user");

var _saved_objects = require("./saved_objects");

var _exception_list_client = require("./services/exception_lists/exception_list_client");

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

class ListPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "spaces", void 0);

    _defineProperty(this, "security", void 0);

    _defineProperty(this, "createRouteHandlerContext", () => {
      return async (context, request) => {
        const {
          spaces,
          config,
          security
        } = this;
        const {
          core: {
            savedObjects: {
              client: savedObjectsClient
            },
            elasticsearch: {
              legacy: {
                client: {
                  callAsCurrentUser: callCluster
                }
              }
            }
          }
        } = context;

        if (config == null) {
          throw new TypeError('Configuration is required for this plugin to operate');
        } else {
          const spaceId = (0, _get_space_id.getSpaceId)({
            request,
            spaces
          });
          const user = (0, _get_user.getUser)({
            request,
            security
          });
          return {
            getExceptionListClient: () => new _exception_list_client.ExceptionListClient({
              savedObjectsClient,
              user
            }),
            getListClient: () => new _list_client.ListClient({
              callCluster,
              config,
              spaceId,
              user
            })
          };
        }
      };
    });

    this.logger = this.initializerContext.logger.get();
    this.config = this.initializerContext.config.get();
  }

  async setup(core) {
    const {
      config
    } = this;
    (0, _saved_objects.initSavedObjects)(core.savedObjects);
    core.http.registerRouteHandlerContext('lists', this.createRouteHandlerContext());
    const router = core.http.createRouter();
    (0, _init_routes.initRoutes)(router, config);
    return {
      getExceptionListClient: (savedObjectsClient, user) => {
        return new _exception_list_client.ExceptionListClient({
          savedObjectsClient,
          user
        });
      },
      getListClient: (callCluster, spaceId, user) => {
        return new _list_client.ListClient({
          callCluster,
          config,
          spaceId,
          user
        });
      }
    };
  }

  start(core, plugins) {
    var _plugins$spaces;

    this.logger.debug('Starting plugin');
    this.security = plugins.security;
    this.spaces = (_plugins$spaces = plugins.spaces) === null || _plugins$spaces === void 0 ? void 0 : _plugins$spaces.spacesService;
  }

  stop() {
    this.logger.debug('Stopping plugin');
  }

}

exports.ListPlugin = ListPlugin;