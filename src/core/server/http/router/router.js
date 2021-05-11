"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = void 0;

var _configSchema = require("@kbn/config-schema");

var _errors = require("../../elasticsearch/legacy/errors");

var _errors2 = require("../../elasticsearch/client/errors");

var _request = require("./request");

var _response = require("./response");

var _route = require("./route");

var _response_adapter = require("./response_adapter");

var _error_wrapper = require("./error_wrapper");

var _validator = require("./validator");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getRouteFullPath(routerPath, routePath) {
  // If router's path ends with slash and route's path starts with slash,
  // we should omit one of them to have a valid concatenated path.
  const routePathStartIndex = routerPath.endsWith('/') && routePath.startsWith('/') ? 1 : 0;
  return `${routerPath}${routePath.slice(routePathStartIndex)}`;
}
/**
 * Create the validation schemas for a route
 *
 * @returns Route schemas if `validate` is specified on the route, otherwise
 * undefined.
 */


function routeSchemasFromRouteConfig(route, routeMethod) {
  // The type doesn't allow `validate` to be undefined, but it can still
  // happen when it's used from JavaScript.
  if (route.validate === undefined) {
    throw new Error(`The [${routeMethod}] at [${route.path}] does not have a 'validate' specified. Use 'false' as the value if you want to bypass validation.`);
  }

  if (route.validate !== false) {
    Object.entries(route.validate).forEach(([key, schema]) => {
      if (!((0, _configSchema.isConfigSchema)(schema) || typeof schema === 'function')) {
        throw new Error(`Expected a valid validation logic declared with '@kbn/config-schema' package or a RouteValidationFunction at key: [${key}].`);
      }
    });
  }

  if (route.validate) {
    return _validator.RouteValidator.from(route.validate);
  }
}
/**
 * Create a valid options object with "sensible" defaults + adding some validation to the options fields
 *
 * @param method HTTP verb for these options
 * @param routeConfig The route config definition
 */


function validOptions(method, routeConfig) {
  const shouldNotHavePayload = ['head', 'get'].includes(method);
  const {
    options = {},
    validate
  } = routeConfig;
  const shouldValidateBody = validate && !!validate.body || !!options.body;
  const {
    output
  } = options.body || {};

  if (typeof output === 'string' && !_route.validBodyOutput.includes(output)) {
    throw new Error(`[options.body.output: '${output}'] in route ${method.toUpperCase()} ${routeConfig.path} is not valid. Only '${_route.validBodyOutput.join("' or '")}' are valid.`);
  }

  const body = shouldNotHavePayload ? undefined : {
    // If it's not a GET (requires payload) but no body validation is required (or no body options are specified),
    // We assume the route does not care about the body => use the memory-cheapest approach (stream and no parsing)
    output: !shouldValidateBody ? 'stream' : undefined,
    parse: !shouldValidateBody ? false : undefined,
    // User's settings should overwrite any of the "desired" values
    ...options.body
  };
  return { ...options,
    body
  };
}
/**
 * @internal
 */


class Router {
  constructor(routerPath, log, enhanceWithContext) {
    this.routerPath = routerPath;
    this.log = log;
    this.enhanceWithContext = enhanceWithContext;

    _defineProperty(this, "routes", []);

    _defineProperty(this, "get", void 0);

    _defineProperty(this, "post", void 0);

    _defineProperty(this, "delete", void 0);

    _defineProperty(this, "put", void 0);

    _defineProperty(this, "patch", void 0);

    _defineProperty(this, "handleLegacyErrors", _error_wrapper.wrapErrors);

    const buildMethod = method => (route, handler) => {
      const routeSchemas = routeSchemasFromRouteConfig(route, method);
      this.routes.push({
        handler: async (req, responseToolkit) => await this.handle({
          routeSchemas,
          request: req,
          responseToolkit,
          handler: this.enhanceWithContext(handler)
        }),
        method,
        path: getRouteFullPath(this.routerPath, route.path),
        options: validOptions(method, route)
      });
    };

    this.get = buildMethod('get');
    this.post = buildMethod('post');
    this.delete = buildMethod('delete');
    this.put = buildMethod('put');
    this.patch = buildMethod('patch');
  }

  getRoutes() {
    return [...this.routes];
  }

  async handle({
    routeSchemas,
    request,
    responseToolkit,
    handler
  }) {
    let kibanaRequest;
    const hapiResponseAdapter = new _response_adapter.HapiResponseAdapter(responseToolkit);

    try {
      kibanaRequest = _request.KibanaRequest.from(request, routeSchemas);
    } catch (e) {
      return hapiResponseAdapter.toBadRequest(e.message);
    }

    try {
      const kibanaResponse = await handler(kibanaRequest, _response.kibanaResponseFactory);
      return hapiResponseAdapter.handle(kibanaResponse);
    } catch (e) {
      this.log.error(e); // forward 401 errors from ES client

      if ((0, _errors2.isUnauthorizedError)(e)) {
        return hapiResponseAdapter.handle(_response.kibanaResponseFactory.unauthorized(convertEsUnauthorized(e)));
      } // forward 401 (boom) errors from legacy ES client


      if (_errors.LegacyElasticsearchErrorHelpers.isNotAuthorizedError(e)) {
        return e;
      }

      return hapiResponseAdapter.toInternalError();
    }
  }

}

exports.Router = Router;

const convertEsUnauthorized = e => {
  const getAuthenticateHeaderValue = () => {
    const header = Object.entries(e.headers).find(([key]) => key.toLowerCase() === 'www-authenticate');
    return header ? header[1] : 'Basic realm="Authorization Required"';
  };

  return {
    body: e.message,
    headers: {
      'www-authenticate': getAuthenticateHeaderValue()
    }
  };
};