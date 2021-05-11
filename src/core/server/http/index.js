"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  config: true,
  HttpConfig: true,
  HttpConfigType: true,
  HttpService: true,
  GetAuthHeaders: true,
  AuthStatus: true,
  GetAuthState: true,
  IsAuthenticated: true,
  CustomHttpResponseOptions: true,
  IKibanaSocket: true,
  isKibanaRequest: true,
  isRealRequest: true,
  Headers: true,
  HttpResponseOptions: true,
  HttpResponsePayload: true,
  ErrorHttpResponseOptions: true,
  KibanaRequest: true,
  KibanaRequestEvents: true,
  KibanaRequestRoute: true,
  KibanaRequestRouteOptions: true,
  IKibanaResponse: true,
  KnownHeaders: true,
  LegacyRequest: true,
  LifecycleResponseFactory: true,
  RedirectResponseOptions: true,
  RequestHandler: true,
  RequestHandlerWrapper: true,
  ResponseError: true,
  ResponseErrorAttributes: true,
  ResponseHeaders: true,
  kibanaResponseFactory: true,
  KibanaResponseFactory: true,
  RouteConfig: true,
  IRouter: true,
  RouteMethod: true,
  RouteRegistrar: true,
  RouteConfigOptions: true,
  RouteConfigOptionsBody: true,
  RouteContentType: true,
  validBodyOutput: true,
  RouteValidatorConfig: true,
  RouteValidationSpec: true,
  RouteValidationFunction: true,
  RouteValidatorOptions: true,
  RouteValidationError: true,
  RouteValidatorFullConfig: true,
  RouteValidationResultFactory: true,
  DestructiveRouteMethod: true,
  SafeRouteMethod: true,
  BasePathProxyServer: true,
  OnPreRoutingHandler: true,
  OnPreRoutingToolkit: true,
  AuthenticationHandler: true,
  AuthHeaders: true,
  AuthResultParams: true,
  AuthRedirected: true,
  AuthRedirectedParams: true,
  AuthToolkit: true,
  AuthResult: true,
  Authenticated: true,
  AuthNotHandled: true,
  AuthResultType: true,
  OnPostAuthHandler: true,
  OnPostAuthToolkit: true,
  OnPreAuthHandler: true,
  OnPreAuthToolkit: true,
  OnPreResponseHandler: true,
  OnPreResponseToolkit: true,
  OnPreResponseRender: true,
  OnPreResponseExtensions: true,
  OnPreResponseInfo: true,
  SessionStorageFactory: true,
  SessionStorage: true,
  SessionStorageCookieOptions: true,
  SessionCookieValidationResult: true,
  BasePath: true,
  IBasePath: true
};
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return _http_config.config;
  }
});
Object.defineProperty(exports, "HttpConfig", {
  enumerable: true,
  get: function () {
    return _http_config.HttpConfig;
  }
});
Object.defineProperty(exports, "HttpConfigType", {
  enumerable: true,
  get: function () {
    return _http_config.HttpConfigType;
  }
});
Object.defineProperty(exports, "HttpService", {
  enumerable: true,
  get: function () {
    return _http_service.HttpService;
  }
});
Object.defineProperty(exports, "GetAuthHeaders", {
  enumerable: true,
  get: function () {
    return _auth_headers_storage.GetAuthHeaders;
  }
});
Object.defineProperty(exports, "AuthStatus", {
  enumerable: true,
  get: function () {
    return _auth_state_storage.AuthStatus;
  }
});
Object.defineProperty(exports, "GetAuthState", {
  enumerable: true,
  get: function () {
    return _auth_state_storage.GetAuthState;
  }
});
Object.defineProperty(exports, "IsAuthenticated", {
  enumerable: true,
  get: function () {
    return _auth_state_storage.IsAuthenticated;
  }
});
Object.defineProperty(exports, "CustomHttpResponseOptions", {
  enumerable: true,
  get: function () {
    return _router.CustomHttpResponseOptions;
  }
});
Object.defineProperty(exports, "IKibanaSocket", {
  enumerable: true,
  get: function () {
    return _router.IKibanaSocket;
  }
});
Object.defineProperty(exports, "isKibanaRequest", {
  enumerable: true,
  get: function () {
    return _router.isKibanaRequest;
  }
});
Object.defineProperty(exports, "isRealRequest", {
  enumerable: true,
  get: function () {
    return _router.isRealRequest;
  }
});
Object.defineProperty(exports, "Headers", {
  enumerable: true,
  get: function () {
    return _router.Headers;
  }
});
Object.defineProperty(exports, "HttpResponseOptions", {
  enumerable: true,
  get: function () {
    return _router.HttpResponseOptions;
  }
});
Object.defineProperty(exports, "HttpResponsePayload", {
  enumerable: true,
  get: function () {
    return _router.HttpResponsePayload;
  }
});
Object.defineProperty(exports, "ErrorHttpResponseOptions", {
  enumerable: true,
  get: function () {
    return _router.ErrorHttpResponseOptions;
  }
});
Object.defineProperty(exports, "KibanaRequest", {
  enumerable: true,
  get: function () {
    return _router.KibanaRequest;
  }
});
Object.defineProperty(exports, "KibanaRequestEvents", {
  enumerable: true,
  get: function () {
    return _router.KibanaRequestEvents;
  }
});
Object.defineProperty(exports, "KibanaRequestRoute", {
  enumerable: true,
  get: function () {
    return _router.KibanaRequestRoute;
  }
});
Object.defineProperty(exports, "KibanaRequestRouteOptions", {
  enumerable: true,
  get: function () {
    return _router.KibanaRequestRouteOptions;
  }
});
Object.defineProperty(exports, "IKibanaResponse", {
  enumerable: true,
  get: function () {
    return _router.IKibanaResponse;
  }
});
Object.defineProperty(exports, "KnownHeaders", {
  enumerable: true,
  get: function () {
    return _router.KnownHeaders;
  }
});
Object.defineProperty(exports, "LegacyRequest", {
  enumerable: true,
  get: function () {
    return _router.LegacyRequest;
  }
});
Object.defineProperty(exports, "LifecycleResponseFactory", {
  enumerable: true,
  get: function () {
    return _router.LifecycleResponseFactory;
  }
});
Object.defineProperty(exports, "RedirectResponseOptions", {
  enumerable: true,
  get: function () {
    return _router.RedirectResponseOptions;
  }
});
Object.defineProperty(exports, "RequestHandler", {
  enumerable: true,
  get: function () {
    return _router.RequestHandler;
  }
});
Object.defineProperty(exports, "RequestHandlerWrapper", {
  enumerable: true,
  get: function () {
    return _router.RequestHandlerWrapper;
  }
});
Object.defineProperty(exports, "ResponseError", {
  enumerable: true,
  get: function () {
    return _router.ResponseError;
  }
});
Object.defineProperty(exports, "ResponseErrorAttributes", {
  enumerable: true,
  get: function () {
    return _router.ResponseErrorAttributes;
  }
});
Object.defineProperty(exports, "ResponseHeaders", {
  enumerable: true,
  get: function () {
    return _router.ResponseHeaders;
  }
});
Object.defineProperty(exports, "kibanaResponseFactory", {
  enumerable: true,
  get: function () {
    return _router.kibanaResponseFactory;
  }
});
Object.defineProperty(exports, "KibanaResponseFactory", {
  enumerable: true,
  get: function () {
    return _router.KibanaResponseFactory;
  }
});
Object.defineProperty(exports, "RouteConfig", {
  enumerable: true,
  get: function () {
    return _router.RouteConfig;
  }
});
Object.defineProperty(exports, "IRouter", {
  enumerable: true,
  get: function () {
    return _router.IRouter;
  }
});
Object.defineProperty(exports, "RouteMethod", {
  enumerable: true,
  get: function () {
    return _router.RouteMethod;
  }
});
Object.defineProperty(exports, "RouteRegistrar", {
  enumerable: true,
  get: function () {
    return _router.RouteRegistrar;
  }
});
Object.defineProperty(exports, "RouteConfigOptions", {
  enumerable: true,
  get: function () {
    return _router.RouteConfigOptions;
  }
});
Object.defineProperty(exports, "RouteConfigOptionsBody", {
  enumerable: true,
  get: function () {
    return _router.RouteConfigOptionsBody;
  }
});
Object.defineProperty(exports, "RouteContentType", {
  enumerable: true,
  get: function () {
    return _router.RouteContentType;
  }
});
Object.defineProperty(exports, "validBodyOutput", {
  enumerable: true,
  get: function () {
    return _router.validBodyOutput;
  }
});
Object.defineProperty(exports, "RouteValidatorConfig", {
  enumerable: true,
  get: function () {
    return _router.RouteValidatorConfig;
  }
});
Object.defineProperty(exports, "RouteValidationSpec", {
  enumerable: true,
  get: function () {
    return _router.RouteValidationSpec;
  }
});
Object.defineProperty(exports, "RouteValidationFunction", {
  enumerable: true,
  get: function () {
    return _router.RouteValidationFunction;
  }
});
Object.defineProperty(exports, "RouteValidatorOptions", {
  enumerable: true,
  get: function () {
    return _router.RouteValidatorOptions;
  }
});
Object.defineProperty(exports, "RouteValidationError", {
  enumerable: true,
  get: function () {
    return _router.RouteValidationError;
  }
});
Object.defineProperty(exports, "RouteValidatorFullConfig", {
  enumerable: true,
  get: function () {
    return _router.RouteValidatorFullConfig;
  }
});
Object.defineProperty(exports, "RouteValidationResultFactory", {
  enumerable: true,
  get: function () {
    return _router.RouteValidationResultFactory;
  }
});
Object.defineProperty(exports, "DestructiveRouteMethod", {
  enumerable: true,
  get: function () {
    return _router.DestructiveRouteMethod;
  }
});
Object.defineProperty(exports, "SafeRouteMethod", {
  enumerable: true,
  get: function () {
    return _router.SafeRouteMethod;
  }
});
Object.defineProperty(exports, "BasePathProxyServer", {
  enumerable: true,
  get: function () {
    return _base_path_proxy_server.BasePathProxyServer;
  }
});
Object.defineProperty(exports, "OnPreRoutingHandler", {
  enumerable: true,
  get: function () {
    return _on_pre_routing.OnPreRoutingHandler;
  }
});
Object.defineProperty(exports, "OnPreRoutingToolkit", {
  enumerable: true,
  get: function () {
    return _on_pre_routing.OnPreRoutingToolkit;
  }
});
Object.defineProperty(exports, "AuthenticationHandler", {
  enumerable: true,
  get: function () {
    return _auth.AuthenticationHandler;
  }
});
Object.defineProperty(exports, "AuthHeaders", {
  enumerable: true,
  get: function () {
    return _auth.AuthHeaders;
  }
});
Object.defineProperty(exports, "AuthResultParams", {
  enumerable: true,
  get: function () {
    return _auth.AuthResultParams;
  }
});
Object.defineProperty(exports, "AuthRedirected", {
  enumerable: true,
  get: function () {
    return _auth.AuthRedirected;
  }
});
Object.defineProperty(exports, "AuthRedirectedParams", {
  enumerable: true,
  get: function () {
    return _auth.AuthRedirectedParams;
  }
});
Object.defineProperty(exports, "AuthToolkit", {
  enumerable: true,
  get: function () {
    return _auth.AuthToolkit;
  }
});
Object.defineProperty(exports, "AuthResult", {
  enumerable: true,
  get: function () {
    return _auth.AuthResult;
  }
});
Object.defineProperty(exports, "Authenticated", {
  enumerable: true,
  get: function () {
    return _auth.Authenticated;
  }
});
Object.defineProperty(exports, "AuthNotHandled", {
  enumerable: true,
  get: function () {
    return _auth.AuthNotHandled;
  }
});
Object.defineProperty(exports, "AuthResultType", {
  enumerable: true,
  get: function () {
    return _auth.AuthResultType;
  }
});
Object.defineProperty(exports, "OnPostAuthHandler", {
  enumerable: true,
  get: function () {
    return _on_post_auth.OnPostAuthHandler;
  }
});
Object.defineProperty(exports, "OnPostAuthToolkit", {
  enumerable: true,
  get: function () {
    return _on_post_auth.OnPostAuthToolkit;
  }
});
Object.defineProperty(exports, "OnPreAuthHandler", {
  enumerable: true,
  get: function () {
    return _on_pre_auth.OnPreAuthHandler;
  }
});
Object.defineProperty(exports, "OnPreAuthToolkit", {
  enumerable: true,
  get: function () {
    return _on_pre_auth.OnPreAuthToolkit;
  }
});
Object.defineProperty(exports, "OnPreResponseHandler", {
  enumerable: true,
  get: function () {
    return _on_pre_response.OnPreResponseHandler;
  }
});
Object.defineProperty(exports, "OnPreResponseToolkit", {
  enumerable: true,
  get: function () {
    return _on_pre_response.OnPreResponseToolkit;
  }
});
Object.defineProperty(exports, "OnPreResponseRender", {
  enumerable: true,
  get: function () {
    return _on_pre_response.OnPreResponseRender;
  }
});
Object.defineProperty(exports, "OnPreResponseExtensions", {
  enumerable: true,
  get: function () {
    return _on_pre_response.OnPreResponseExtensions;
  }
});
Object.defineProperty(exports, "OnPreResponseInfo", {
  enumerable: true,
  get: function () {
    return _on_pre_response.OnPreResponseInfo;
  }
});
Object.defineProperty(exports, "SessionStorageFactory", {
  enumerable: true,
  get: function () {
    return _session_storage.SessionStorageFactory;
  }
});
Object.defineProperty(exports, "SessionStorage", {
  enumerable: true,
  get: function () {
    return _session_storage.SessionStorage;
  }
});
Object.defineProperty(exports, "SessionStorageCookieOptions", {
  enumerable: true,
  get: function () {
    return _cookie_session_storage.SessionStorageCookieOptions;
  }
});
Object.defineProperty(exports, "SessionCookieValidationResult", {
  enumerable: true,
  get: function () {
    return _cookie_session_storage.SessionCookieValidationResult;
  }
});
Object.defineProperty(exports, "BasePath", {
  enumerable: true,
  get: function () {
    return _base_path_service.BasePath;
  }
});
Object.defineProperty(exports, "IBasePath", {
  enumerable: true,
  get: function () {
    return _base_path_service.IBasePath;
  }
});

var _http_config = require("./http_config");

var _http_service = require("./http_service");

var _auth_headers_storage = require("./auth_headers_storage");

var _auth_state_storage = require("./auth_state_storage");

var _router = require("./router");

var _base_path_proxy_server = require("./base_path_proxy_server");

var _on_pre_routing = require("./lifecycle/on_pre_routing");

var _auth = require("./lifecycle/auth");

var _on_post_auth = require("./lifecycle/on_post_auth");

var _on_pre_auth = require("./lifecycle/on_pre_auth");

var _on_pre_response = require("./lifecycle/on_pre_response");

var _session_storage = require("./session_storage");

var _cookie_session_storage = require("./cookie_session_storage");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _base_path_service = require("./base_path_service");