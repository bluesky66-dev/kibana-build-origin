"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  config: true,
  LegacyClusterClient: true,
  ILegacyClusterClient: true,
  ILegacyCustomClusterClient: true,
  LegacyScopedClusterClient: true,
  ILegacyScopedClusterClient: true,
  ElasticsearchConfig: true,
  LegacyElasticsearchClientConfig: true,
  LegacyElasticsearchError: true,
  LegacyElasticsearchErrorHelpers: true,
  ElasticsearchServiceSetup: true,
  ElasticsearchServiceStart: true,
  ElasticsearchStatusMeta: true,
  NodesVersionCompatibility: true,
  LegacyAPICaller: true,
  FakeRequest: true,
  ScopeableRequest: true,
  ElasticsearchClient: true,
  IClusterClient: true,
  ICustomClusterClient: true,
  ElasticsearchClientConfig: true,
  IScopedClusterClient: true,
  SearchResponse: true,
  CountResponse: true,
  ShardsInfo: true,
  ShardsResponse: true,
  Explanation: true,
  GetResponse: true,
  DeleteDocumentResponse: true,
  HttpResources: true,
  HttpResourcesRenderOptions: true,
  HttpResourcesResponseOptions: true,
  HttpResourcesServiceToolkit: true,
  HttpResourcesRequestHandler: true,
  PluginsServiceSetup: true,
  PluginsServiceStart: true,
  PluginOpaqueId: true,
  DiscoveredPlugin: true,
  Plugin: true,
  AsyncPlugin: true,
  PluginConfigDescriptor: true,
  PluginConfigSchema: true,
  PluginInitializer: true,
  PluginInitializerContext: true,
  PluginManifest: true,
  PluginName: true,
  SharedGlobalConfig: true,
  ContextSetup: true,
  IContextContainer: true,
  IContextProvider: true,
  HandlerFunction: true,
  HandlerContextType: true,
  HandlerParameters: true,
  CapabilitiesSetup: true,
  CapabilitiesStart: true,
  Capabilities: true,
  CapabilitiesProvider: true,
  CapabilitiesSwitcher: true,
  ResolveCapabilitiesOptions: true,
  Logger: true,
  LoggerFactory: true,
  LogMeta: true,
  LogRecord: true,
  LogLevel: true,
  LoggingServiceSetup: true,
  LoggerContextConfigInput: true,
  LoggerConfigType: true,
  AppenderConfigType: true,
  CoreUsageStats: true,
  CoreUsageData: true,
  CoreConfigUsageData: true,
  CoreEnvironmentUsageData: true,
  CoreServicesUsageData: true,
  CoreUsageDataStart: true,
  bootstrap: true,
  ConfigPath: true,
  ConfigService: true,
  ConfigDeprecation: true,
  ConfigDeprecationProvider: true,
  ConfigDeprecationLogger: true,
  ConfigDeprecationFactory: true,
  EnvironmentMode: true,
  PackageInfo: true,
  CoreId: true,
  CspConfig: true,
  ICspConfig: true,
  IExternalUrlConfig: true,
  IExternalUrlPolicy: true,
  AuthenticationHandler: true,
  AuthHeaders: true,
  AuthResultParams: true,
  AuthStatus: true,
  AuthToolkit: true,
  AuthRedirected: true,
  AuthRedirectedParams: true,
  AuthResult: true,
  AuthResultType: true,
  Authenticated: true,
  AuthNotHandled: true,
  BasePath: true,
  IBasePath: true,
  CustomHttpResponseOptions: true,
  GetAuthHeaders: true,
  GetAuthState: true,
  Headers: true,
  HttpAuth: true,
  HttpResponseOptions: true,
  HttpResponsePayload: true,
  HttpServerInfo: true,
  HttpServiceSetup: true,
  HttpServiceStart: true,
  ErrorHttpResponseOptions: true,
  IKibanaSocket: true,
  IsAuthenticated: true,
  KibanaRequest: true,
  KibanaRequestEvents: true,
  KibanaRequestRoute: true,
  KibanaRequestRouteOptions: true,
  IKibanaResponse: true,
  LifecycleResponseFactory: true,
  KnownHeaders: true,
  LegacyRequest: true,
  OnPreAuthHandler: true,
  OnPreAuthToolkit: true,
  OnPreRoutingHandler: true,
  OnPreRoutingToolkit: true,
  OnPostAuthHandler: true,
  OnPostAuthToolkit: true,
  OnPreResponseHandler: true,
  OnPreResponseToolkit: true,
  OnPreResponseRender: true,
  OnPreResponseExtensions: true,
  OnPreResponseInfo: true,
  RedirectResponseOptions: true,
  RequestHandler: true,
  RequestHandlerWrapper: true,
  RequestHandlerContextContainer: true,
  RequestHandlerContextProvider: true,
  ResponseError: true,
  ResponseErrorAttributes: true,
  ResponseHeaders: true,
  kibanaResponseFactory: true,
  KibanaResponseFactory: true,
  RouteConfig: true,
  IRouter: true,
  RouteRegistrar: true,
  RouteMethod: true,
  RouteConfigOptions: true,
  RouteConfigOptionsBody: true,
  RouteContentType: true,
  validBodyOutput: true,
  RouteValidatorConfig: true,
  RouteValidationSpec: true,
  RouteValidationFunction: true,
  RouteValidatorOptions: true,
  RouteValidatorFullConfig: true,
  RouteValidationResultFactory: true,
  RouteValidationError: true,
  SessionStorage: true,
  SessionStorageCookieOptions: true,
  SessionCookieValidationResult: true,
  SessionStorageFactory: true,
  DestructiveRouteMethod: true,
  SafeRouteMethod: true,
  IRenderOptions: true,
  SavedObjectsBulkCreateObject: true,
  SavedObjectsBulkGetObject: true,
  SavedObjectsBulkUpdateObject: true,
  SavedObjectsBulkUpdateOptions: true,
  SavedObjectsBulkResponse: true,
  SavedObjectsBulkUpdateResponse: true,
  SavedObjectsCheckConflictsObject: true,
  SavedObjectsCheckConflictsResponse: true,
  SavedObjectsClient: true,
  SavedObjectsClientProviderOptions: true,
  SavedObjectsClientWrapperFactory: true,
  SavedObjectsClientWrapperOptions: true,
  SavedObjectsClientFactory: true,
  SavedObjectsClientFactoryProvider: true,
  SavedObjectsClosePointInTimeOptions: true,
  SavedObjectsClosePointInTimeResponse: true,
  SavedObjectsCreateOptions: true,
  SavedObjectsErrorHelpers: true,
  SavedObjectsExportResultDetails: true,
  SavedObjectsFindResult: true,
  SavedObjectsFindResponse: true,
  SavedObjectsImportConflictError: true,
  SavedObjectsImportAmbiguousConflictError: true,
  SavedObjectsImportFailure: true,
  SavedObjectsImportMissingReferencesError: true,
  SavedObjectsImportOptions: true,
  SavedObjectsImportResponse: true,
  SavedObjectsImportRetry: true,
  SavedObjectsImportSuccess: true,
  SavedObjectsImportUnknownError: true,
  SavedObjectsImportUnsupportedTypeError: true,
  SavedObjectMigrationContext: true,
  SavedObjectsMigrationLogger: true,
  SavedObjectsOpenPointInTimeOptions: true,
  SavedObjectsOpenPointInTimeResponse: true,
  SavedObjectsRawDoc: true,
  SavedObjectsRawDocParseOptions: true,
  SavedObjectSanitizedDoc: true,
  SavedObjectUnsanitizedDoc: true,
  SavedObjectsRepositoryFactory: true,
  SavedObjectsResolveImportErrorsOptions: true,
  SavedObjectsResolveResponse: true,
  SavedObjectsSerializer: true,
  SavedObjectsUpdateOptions: true,
  SavedObjectsUpdateResponse: true,
  SavedObjectsAddToNamespacesOptions: true,
  SavedObjectsAddToNamespacesResponse: true,
  SavedObjectsDeleteFromNamespacesOptions: true,
  SavedObjectsDeleteFromNamespacesResponse: true,
  SavedObjectsRemoveReferencesToOptions: true,
  SavedObjectsRemoveReferencesToResponse: true,
  SavedObjectsServiceStart: true,
  SavedObjectsServiceSetup: true,
  SavedObjectStatusMeta: true,
  SavedObjectsDeleteOptions: true,
  ISavedObjectsRepository: true,
  SavedObjectsRepository: true,
  SavedObjectsDeleteByNamespaceOptions: true,
  SavedObjectsIncrementCounterOptions: true,
  SavedObjectsIncrementCounterField: true,
  SavedObjectsComplexFieldMapping: true,
  SavedObjectsCoreFieldMapping: true,
  SavedObjectsFieldMapping: true,
  SavedObjectsTypeMappingDefinition: true,
  SavedObjectsMappingProperties: true,
  SavedObjectTypeRegistry: true,
  ISavedObjectTypeRegistry: true,
  SavedObjectsNamespaceType: true,
  SavedObjectsType: true,
  SavedObjectsTypeManagementDefinition: true,
  SavedObjectMigrationMap: true,
  SavedObjectMigrationFn: true,
  SavedObjectsUtils: true,
  SavedObjectsExporter: true,
  ISavedObjectsExporter: true,
  SavedObjectExportBaseOptions: true,
  SavedObjectsExportByObjectOptions: true,
  SavedObjectsExportByTypeOptions: true,
  SavedObjectsExportError: true,
  SavedObjectsExportTransform: true,
  SavedObjectsExportTransformContext: true,
  SavedObjectsImporter: true,
  ISavedObjectsImporter: true,
  SavedObjectsImportError: true,
  SavedObjectsImportHook: true,
  SavedObjectsImportHookResult: true,
  SavedObjectsImportSimpleWarning: true,
  SavedObjectsImportActionRequiredWarning: true,
  SavedObjectsImportWarning: true,
  IUiSettingsClient: true,
  UiSettingsParams: true,
  PublicUiSettingsParams: true,
  UiSettingsType: true,
  UiSettingsServiceSetup: true,
  UiSettingsServiceStart: true,
  UserProvidedValues: true,
  ImageValidation: true,
  DeprecationSettings: true,
  StringValidation: true,
  StringValidationRegex: true,
  StringValidationRegexString: true,
  OpsMetrics: true,
  OpsOsMetrics: true,
  OpsServerMetrics: true,
  OpsProcessMetrics: true,
  MetricsServiceSetup: true,
  MetricsServiceStart: true,
  I18nServiceSetup: true,
  AppCategory: true,
  DEFAULT_APP_CATEGORIES: true,
  SavedObject: true,
  SavedObjectAttribute: true,
  SavedObjectAttributes: true,
  SavedObjectAttributeSingle: true,
  SavedObjectReference: true,
  SavedObjectsBaseOptions: true,
  MutatingOperationRefreshSetting: true,
  SavedObjectsClientContract: true,
  SavedObjectsFindOptions: true,
  SavedObjectsFindOptionsReference: true,
  SavedObjectsPitParams: true,
  SavedObjectsMigrationVersion: true,
  LegacyServiceSetupDeps: true,
  LegacyServiceStartDeps: true,
  LegacyConfig: true,
  CoreStatus: true,
  ServiceStatus: true,
  ServiceStatusLevel: true,
  ServiceStatusLevels: true,
  StatusServiceSetup: true
};
Object.defineProperty(exports, "LegacyClusterClient", {
  enumerable: true,
  get: function () {
    return _elasticsearch.LegacyClusterClient;
  }
});
Object.defineProperty(exports, "ILegacyClusterClient", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ILegacyClusterClient;
  }
});
Object.defineProperty(exports, "ILegacyCustomClusterClient", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ILegacyCustomClusterClient;
  }
});
Object.defineProperty(exports, "LegacyScopedClusterClient", {
  enumerable: true,
  get: function () {
    return _elasticsearch.LegacyScopedClusterClient;
  }
});
Object.defineProperty(exports, "ILegacyScopedClusterClient", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ILegacyScopedClusterClient;
  }
});
Object.defineProperty(exports, "ElasticsearchConfig", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ElasticsearchConfig;
  }
});
Object.defineProperty(exports, "LegacyElasticsearchClientConfig", {
  enumerable: true,
  get: function () {
    return _elasticsearch.LegacyElasticsearchClientConfig;
  }
});
Object.defineProperty(exports, "LegacyElasticsearchError", {
  enumerable: true,
  get: function () {
    return _elasticsearch.LegacyElasticsearchError;
  }
});
Object.defineProperty(exports, "LegacyElasticsearchErrorHelpers", {
  enumerable: true,
  get: function () {
    return _elasticsearch.LegacyElasticsearchErrorHelpers;
  }
});
Object.defineProperty(exports, "ElasticsearchServiceSetup", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ElasticsearchServiceSetup;
  }
});
Object.defineProperty(exports, "ElasticsearchServiceStart", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ElasticsearchServiceStart;
  }
});
Object.defineProperty(exports, "ElasticsearchStatusMeta", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ElasticsearchStatusMeta;
  }
});
Object.defineProperty(exports, "NodesVersionCompatibility", {
  enumerable: true,
  get: function () {
    return _elasticsearch.NodesVersionCompatibility;
  }
});
Object.defineProperty(exports, "LegacyAPICaller", {
  enumerable: true,
  get: function () {
    return _elasticsearch.LegacyAPICaller;
  }
});
Object.defineProperty(exports, "FakeRequest", {
  enumerable: true,
  get: function () {
    return _elasticsearch.FakeRequest;
  }
});
Object.defineProperty(exports, "ScopeableRequest", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ScopeableRequest;
  }
});
Object.defineProperty(exports, "ElasticsearchClient", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ElasticsearchClient;
  }
});
Object.defineProperty(exports, "IClusterClient", {
  enumerable: true,
  get: function () {
    return _elasticsearch.IClusterClient;
  }
});
Object.defineProperty(exports, "ICustomClusterClient", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ICustomClusterClient;
  }
});
Object.defineProperty(exports, "ElasticsearchClientConfig", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ElasticsearchClientConfig;
  }
});
Object.defineProperty(exports, "IScopedClusterClient", {
  enumerable: true,
  get: function () {
    return _elasticsearch.IScopedClusterClient;
  }
});
Object.defineProperty(exports, "SearchResponse", {
  enumerable: true,
  get: function () {
    return _elasticsearch.SearchResponse;
  }
});
Object.defineProperty(exports, "CountResponse", {
  enumerable: true,
  get: function () {
    return _elasticsearch.CountResponse;
  }
});
Object.defineProperty(exports, "ShardsInfo", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ShardsInfo;
  }
});
Object.defineProperty(exports, "ShardsResponse", {
  enumerable: true,
  get: function () {
    return _elasticsearch.ShardsResponse;
  }
});
Object.defineProperty(exports, "Explanation", {
  enumerable: true,
  get: function () {
    return _elasticsearch.Explanation;
  }
});
Object.defineProperty(exports, "GetResponse", {
  enumerable: true,
  get: function () {
    return _elasticsearch.GetResponse;
  }
});
Object.defineProperty(exports, "DeleteDocumentResponse", {
  enumerable: true,
  get: function () {
    return _elasticsearch.DeleteDocumentResponse;
  }
});
Object.defineProperty(exports, "HttpResources", {
  enumerable: true,
  get: function () {
    return _http_resources.HttpResources;
  }
});
Object.defineProperty(exports, "HttpResourcesRenderOptions", {
  enumerable: true,
  get: function () {
    return _http_resources.HttpResourcesRenderOptions;
  }
});
Object.defineProperty(exports, "HttpResourcesResponseOptions", {
  enumerable: true,
  get: function () {
    return _http_resources.HttpResourcesResponseOptions;
  }
});
Object.defineProperty(exports, "HttpResourcesServiceToolkit", {
  enumerable: true,
  get: function () {
    return _http_resources.HttpResourcesServiceToolkit;
  }
});
Object.defineProperty(exports, "HttpResourcesRequestHandler", {
  enumerable: true,
  get: function () {
    return _http_resources.HttpResourcesRequestHandler;
  }
});
Object.defineProperty(exports, "PluginsServiceSetup", {
  enumerable: true,
  get: function () {
    return _plugins.PluginsServiceSetup;
  }
});
Object.defineProperty(exports, "PluginsServiceStart", {
  enumerable: true,
  get: function () {
    return _plugins.PluginsServiceStart;
  }
});
Object.defineProperty(exports, "PluginOpaqueId", {
  enumerable: true,
  get: function () {
    return _plugins.PluginOpaqueId;
  }
});
Object.defineProperty(exports, "DiscoveredPlugin", {
  enumerable: true,
  get: function () {
    return _plugins.DiscoveredPlugin;
  }
});
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugins.Plugin;
  }
});
Object.defineProperty(exports, "AsyncPlugin", {
  enumerable: true,
  get: function () {
    return _plugins.AsyncPlugin;
  }
});
Object.defineProperty(exports, "PluginConfigDescriptor", {
  enumerable: true,
  get: function () {
    return _plugins.PluginConfigDescriptor;
  }
});
Object.defineProperty(exports, "PluginConfigSchema", {
  enumerable: true,
  get: function () {
    return _plugins.PluginConfigSchema;
  }
});
Object.defineProperty(exports, "PluginInitializer", {
  enumerable: true,
  get: function () {
    return _plugins.PluginInitializer;
  }
});
Object.defineProperty(exports, "PluginInitializerContext", {
  enumerable: true,
  get: function () {
    return _plugins.PluginInitializerContext;
  }
});
Object.defineProperty(exports, "PluginManifest", {
  enumerable: true,
  get: function () {
    return _plugins.PluginManifest;
  }
});
Object.defineProperty(exports, "PluginName", {
  enumerable: true,
  get: function () {
    return _plugins.PluginName;
  }
});
Object.defineProperty(exports, "SharedGlobalConfig", {
  enumerable: true,
  get: function () {
    return _plugins.SharedGlobalConfig;
  }
});
Object.defineProperty(exports, "ContextSetup", {
  enumerable: true,
  get: function () {
    return _context.ContextSetup;
  }
});
Object.defineProperty(exports, "IContextContainer", {
  enumerable: true,
  get: function () {
    return _context.IContextContainer;
  }
});
Object.defineProperty(exports, "IContextProvider", {
  enumerable: true,
  get: function () {
    return _context.IContextProvider;
  }
});
Object.defineProperty(exports, "HandlerFunction", {
  enumerable: true,
  get: function () {
    return _context.HandlerFunction;
  }
});
Object.defineProperty(exports, "HandlerContextType", {
  enumerable: true,
  get: function () {
    return _context.HandlerContextType;
  }
});
Object.defineProperty(exports, "HandlerParameters", {
  enumerable: true,
  get: function () {
    return _context.HandlerParameters;
  }
});
Object.defineProperty(exports, "CapabilitiesSetup", {
  enumerable: true,
  get: function () {
    return _capabilities.CapabilitiesSetup;
  }
});
Object.defineProperty(exports, "CapabilitiesStart", {
  enumerable: true,
  get: function () {
    return _capabilities.CapabilitiesStart;
  }
});
Object.defineProperty(exports, "Capabilities", {
  enumerable: true,
  get: function () {
    return _capabilities.Capabilities;
  }
});
Object.defineProperty(exports, "CapabilitiesProvider", {
  enumerable: true,
  get: function () {
    return _capabilities.CapabilitiesProvider;
  }
});
Object.defineProperty(exports, "CapabilitiesSwitcher", {
  enumerable: true,
  get: function () {
    return _capabilities.CapabilitiesSwitcher;
  }
});
Object.defineProperty(exports, "ResolveCapabilitiesOptions", {
  enumerable: true,
  get: function () {
    return _capabilities.ResolveCapabilitiesOptions;
  }
});
Object.defineProperty(exports, "Logger", {
  enumerable: true,
  get: function () {
    return _logging.Logger;
  }
});
Object.defineProperty(exports, "LoggerFactory", {
  enumerable: true,
  get: function () {
    return _logging.LoggerFactory;
  }
});
Object.defineProperty(exports, "LogMeta", {
  enumerable: true,
  get: function () {
    return _logging.LogMeta;
  }
});
Object.defineProperty(exports, "LogRecord", {
  enumerable: true,
  get: function () {
    return _logging.LogRecord;
  }
});
Object.defineProperty(exports, "LogLevel", {
  enumerable: true,
  get: function () {
    return _logging.LogLevel;
  }
});
Object.defineProperty(exports, "LoggingServiceSetup", {
  enumerable: true,
  get: function () {
    return _logging.LoggingServiceSetup;
  }
});
Object.defineProperty(exports, "LoggerContextConfigInput", {
  enumerable: true,
  get: function () {
    return _logging.LoggerContextConfigInput;
  }
});
Object.defineProperty(exports, "LoggerConfigType", {
  enumerable: true,
  get: function () {
    return _logging.LoggerConfigType;
  }
});
Object.defineProperty(exports, "AppenderConfigType", {
  enumerable: true,
  get: function () {
    return _logging.AppenderConfigType;
  }
});
Object.defineProperty(exports, "CoreUsageStats", {
  enumerable: true,
  get: function () {
    return _core_usage_data.CoreUsageStats;
  }
});
Object.defineProperty(exports, "CoreUsageData", {
  enumerable: true,
  get: function () {
    return _core_usage_data.CoreUsageData;
  }
});
Object.defineProperty(exports, "CoreConfigUsageData", {
  enumerable: true,
  get: function () {
    return _core_usage_data.CoreConfigUsageData;
  }
});
Object.defineProperty(exports, "CoreEnvironmentUsageData", {
  enumerable: true,
  get: function () {
    return _core_usage_data.CoreEnvironmentUsageData;
  }
});
Object.defineProperty(exports, "CoreServicesUsageData", {
  enumerable: true,
  get: function () {
    return _core_usage_data.CoreServicesUsageData;
  }
});
Object.defineProperty(exports, "CoreUsageDataStart", {
  enumerable: true,
  get: function () {
    return _core_usage_data.CoreUsageDataStart;
  }
});
Object.defineProperty(exports, "bootstrap", {
  enumerable: true,
  get: function () {
    return _bootstrap.bootstrap;
  }
});
Object.defineProperty(exports, "ConfigPath", {
  enumerable: true,
  get: function () {
    return _config.ConfigPath;
  }
});
Object.defineProperty(exports, "ConfigService", {
  enumerable: true,
  get: function () {
    return _config.ConfigService;
  }
});
Object.defineProperty(exports, "ConfigDeprecation", {
  enumerable: true,
  get: function () {
    return _config.ConfigDeprecation;
  }
});
Object.defineProperty(exports, "ConfigDeprecationProvider", {
  enumerable: true,
  get: function () {
    return _config.ConfigDeprecationProvider;
  }
});
Object.defineProperty(exports, "ConfigDeprecationLogger", {
  enumerable: true,
  get: function () {
    return _config.ConfigDeprecationLogger;
  }
});
Object.defineProperty(exports, "ConfigDeprecationFactory", {
  enumerable: true,
  get: function () {
    return _config.ConfigDeprecationFactory;
  }
});
Object.defineProperty(exports, "EnvironmentMode", {
  enumerable: true,
  get: function () {
    return _config.EnvironmentMode;
  }
});
Object.defineProperty(exports, "PackageInfo", {
  enumerable: true,
  get: function () {
    return _config.PackageInfo;
  }
});
Object.defineProperty(exports, "CoreId", {
  enumerable: true,
  get: function () {
    return _core_context.CoreId;
  }
});
Object.defineProperty(exports, "CspConfig", {
  enumerable: true,
  get: function () {
    return _csp.CspConfig;
  }
});
Object.defineProperty(exports, "ICspConfig", {
  enumerable: true,
  get: function () {
    return _csp.ICspConfig;
  }
});
Object.defineProperty(exports, "IExternalUrlConfig", {
  enumerable: true,
  get: function () {
    return _external_url.IExternalUrlConfig;
  }
});
Object.defineProperty(exports, "IExternalUrlPolicy", {
  enumerable: true,
  get: function () {
    return _external_url.IExternalUrlPolicy;
  }
});
Object.defineProperty(exports, "AuthenticationHandler", {
  enumerable: true,
  get: function () {
    return _http.AuthenticationHandler;
  }
});
Object.defineProperty(exports, "AuthHeaders", {
  enumerable: true,
  get: function () {
    return _http.AuthHeaders;
  }
});
Object.defineProperty(exports, "AuthResultParams", {
  enumerable: true,
  get: function () {
    return _http.AuthResultParams;
  }
});
Object.defineProperty(exports, "AuthStatus", {
  enumerable: true,
  get: function () {
    return _http.AuthStatus;
  }
});
Object.defineProperty(exports, "AuthToolkit", {
  enumerable: true,
  get: function () {
    return _http.AuthToolkit;
  }
});
Object.defineProperty(exports, "AuthRedirected", {
  enumerable: true,
  get: function () {
    return _http.AuthRedirected;
  }
});
Object.defineProperty(exports, "AuthRedirectedParams", {
  enumerable: true,
  get: function () {
    return _http.AuthRedirectedParams;
  }
});
Object.defineProperty(exports, "AuthResult", {
  enumerable: true,
  get: function () {
    return _http.AuthResult;
  }
});
Object.defineProperty(exports, "AuthResultType", {
  enumerable: true,
  get: function () {
    return _http.AuthResultType;
  }
});
Object.defineProperty(exports, "Authenticated", {
  enumerable: true,
  get: function () {
    return _http.Authenticated;
  }
});
Object.defineProperty(exports, "AuthNotHandled", {
  enumerable: true,
  get: function () {
    return _http.AuthNotHandled;
  }
});
Object.defineProperty(exports, "BasePath", {
  enumerable: true,
  get: function () {
    return _http.BasePath;
  }
});
Object.defineProperty(exports, "IBasePath", {
  enumerable: true,
  get: function () {
    return _http.IBasePath;
  }
});
Object.defineProperty(exports, "CustomHttpResponseOptions", {
  enumerable: true,
  get: function () {
    return _http.CustomHttpResponseOptions;
  }
});
Object.defineProperty(exports, "GetAuthHeaders", {
  enumerable: true,
  get: function () {
    return _http.GetAuthHeaders;
  }
});
Object.defineProperty(exports, "GetAuthState", {
  enumerable: true,
  get: function () {
    return _http.GetAuthState;
  }
});
Object.defineProperty(exports, "Headers", {
  enumerable: true,
  get: function () {
    return _http.Headers;
  }
});
Object.defineProperty(exports, "HttpAuth", {
  enumerable: true,
  get: function () {
    return _http.HttpAuth;
  }
});
Object.defineProperty(exports, "HttpResponseOptions", {
  enumerable: true,
  get: function () {
    return _http.HttpResponseOptions;
  }
});
Object.defineProperty(exports, "HttpResponsePayload", {
  enumerable: true,
  get: function () {
    return _http.HttpResponsePayload;
  }
});
Object.defineProperty(exports, "HttpServerInfo", {
  enumerable: true,
  get: function () {
    return _http.HttpServerInfo;
  }
});
Object.defineProperty(exports, "HttpServiceSetup", {
  enumerable: true,
  get: function () {
    return _http.HttpServiceSetup;
  }
});
Object.defineProperty(exports, "HttpServiceStart", {
  enumerable: true,
  get: function () {
    return _http.HttpServiceStart;
  }
});
Object.defineProperty(exports, "ErrorHttpResponseOptions", {
  enumerable: true,
  get: function () {
    return _http.ErrorHttpResponseOptions;
  }
});
Object.defineProperty(exports, "IKibanaSocket", {
  enumerable: true,
  get: function () {
    return _http.IKibanaSocket;
  }
});
Object.defineProperty(exports, "IsAuthenticated", {
  enumerable: true,
  get: function () {
    return _http.IsAuthenticated;
  }
});
Object.defineProperty(exports, "KibanaRequest", {
  enumerable: true,
  get: function () {
    return _http.KibanaRequest;
  }
});
Object.defineProperty(exports, "KibanaRequestEvents", {
  enumerable: true,
  get: function () {
    return _http.KibanaRequestEvents;
  }
});
Object.defineProperty(exports, "KibanaRequestRoute", {
  enumerable: true,
  get: function () {
    return _http.KibanaRequestRoute;
  }
});
Object.defineProperty(exports, "KibanaRequestRouteOptions", {
  enumerable: true,
  get: function () {
    return _http.KibanaRequestRouteOptions;
  }
});
Object.defineProperty(exports, "IKibanaResponse", {
  enumerable: true,
  get: function () {
    return _http.IKibanaResponse;
  }
});
Object.defineProperty(exports, "LifecycleResponseFactory", {
  enumerable: true,
  get: function () {
    return _http.LifecycleResponseFactory;
  }
});
Object.defineProperty(exports, "KnownHeaders", {
  enumerable: true,
  get: function () {
    return _http.KnownHeaders;
  }
});
Object.defineProperty(exports, "LegacyRequest", {
  enumerable: true,
  get: function () {
    return _http.LegacyRequest;
  }
});
Object.defineProperty(exports, "OnPreAuthHandler", {
  enumerable: true,
  get: function () {
    return _http.OnPreAuthHandler;
  }
});
Object.defineProperty(exports, "OnPreAuthToolkit", {
  enumerable: true,
  get: function () {
    return _http.OnPreAuthToolkit;
  }
});
Object.defineProperty(exports, "OnPreRoutingHandler", {
  enumerable: true,
  get: function () {
    return _http.OnPreRoutingHandler;
  }
});
Object.defineProperty(exports, "OnPreRoutingToolkit", {
  enumerable: true,
  get: function () {
    return _http.OnPreRoutingToolkit;
  }
});
Object.defineProperty(exports, "OnPostAuthHandler", {
  enumerable: true,
  get: function () {
    return _http.OnPostAuthHandler;
  }
});
Object.defineProperty(exports, "OnPostAuthToolkit", {
  enumerable: true,
  get: function () {
    return _http.OnPostAuthToolkit;
  }
});
Object.defineProperty(exports, "OnPreResponseHandler", {
  enumerable: true,
  get: function () {
    return _http.OnPreResponseHandler;
  }
});
Object.defineProperty(exports, "OnPreResponseToolkit", {
  enumerable: true,
  get: function () {
    return _http.OnPreResponseToolkit;
  }
});
Object.defineProperty(exports, "OnPreResponseRender", {
  enumerable: true,
  get: function () {
    return _http.OnPreResponseRender;
  }
});
Object.defineProperty(exports, "OnPreResponseExtensions", {
  enumerable: true,
  get: function () {
    return _http.OnPreResponseExtensions;
  }
});
Object.defineProperty(exports, "OnPreResponseInfo", {
  enumerable: true,
  get: function () {
    return _http.OnPreResponseInfo;
  }
});
Object.defineProperty(exports, "RedirectResponseOptions", {
  enumerable: true,
  get: function () {
    return _http.RedirectResponseOptions;
  }
});
Object.defineProperty(exports, "RequestHandler", {
  enumerable: true,
  get: function () {
    return _http.RequestHandler;
  }
});
Object.defineProperty(exports, "RequestHandlerWrapper", {
  enumerable: true,
  get: function () {
    return _http.RequestHandlerWrapper;
  }
});
Object.defineProperty(exports, "RequestHandlerContextContainer", {
  enumerable: true,
  get: function () {
    return _http.RequestHandlerContextContainer;
  }
});
Object.defineProperty(exports, "RequestHandlerContextProvider", {
  enumerable: true,
  get: function () {
    return _http.RequestHandlerContextProvider;
  }
});
Object.defineProperty(exports, "ResponseError", {
  enumerable: true,
  get: function () {
    return _http.ResponseError;
  }
});
Object.defineProperty(exports, "ResponseErrorAttributes", {
  enumerable: true,
  get: function () {
    return _http.ResponseErrorAttributes;
  }
});
Object.defineProperty(exports, "ResponseHeaders", {
  enumerable: true,
  get: function () {
    return _http.ResponseHeaders;
  }
});
Object.defineProperty(exports, "kibanaResponseFactory", {
  enumerable: true,
  get: function () {
    return _http.kibanaResponseFactory;
  }
});
Object.defineProperty(exports, "KibanaResponseFactory", {
  enumerable: true,
  get: function () {
    return _http.KibanaResponseFactory;
  }
});
Object.defineProperty(exports, "RouteConfig", {
  enumerable: true,
  get: function () {
    return _http.RouteConfig;
  }
});
Object.defineProperty(exports, "IRouter", {
  enumerable: true,
  get: function () {
    return _http.IRouter;
  }
});
Object.defineProperty(exports, "RouteRegistrar", {
  enumerable: true,
  get: function () {
    return _http.RouteRegistrar;
  }
});
Object.defineProperty(exports, "RouteMethod", {
  enumerable: true,
  get: function () {
    return _http.RouteMethod;
  }
});
Object.defineProperty(exports, "RouteConfigOptions", {
  enumerable: true,
  get: function () {
    return _http.RouteConfigOptions;
  }
});
Object.defineProperty(exports, "RouteConfigOptionsBody", {
  enumerable: true,
  get: function () {
    return _http.RouteConfigOptionsBody;
  }
});
Object.defineProperty(exports, "RouteContentType", {
  enumerable: true,
  get: function () {
    return _http.RouteContentType;
  }
});
Object.defineProperty(exports, "validBodyOutput", {
  enumerable: true,
  get: function () {
    return _http.validBodyOutput;
  }
});
Object.defineProperty(exports, "RouteValidatorConfig", {
  enumerable: true,
  get: function () {
    return _http.RouteValidatorConfig;
  }
});
Object.defineProperty(exports, "RouteValidationSpec", {
  enumerable: true,
  get: function () {
    return _http.RouteValidationSpec;
  }
});
Object.defineProperty(exports, "RouteValidationFunction", {
  enumerable: true,
  get: function () {
    return _http.RouteValidationFunction;
  }
});
Object.defineProperty(exports, "RouteValidatorOptions", {
  enumerable: true,
  get: function () {
    return _http.RouteValidatorOptions;
  }
});
Object.defineProperty(exports, "RouteValidatorFullConfig", {
  enumerable: true,
  get: function () {
    return _http.RouteValidatorFullConfig;
  }
});
Object.defineProperty(exports, "RouteValidationResultFactory", {
  enumerable: true,
  get: function () {
    return _http.RouteValidationResultFactory;
  }
});
Object.defineProperty(exports, "RouteValidationError", {
  enumerable: true,
  get: function () {
    return _http.RouteValidationError;
  }
});
Object.defineProperty(exports, "SessionStorage", {
  enumerable: true,
  get: function () {
    return _http.SessionStorage;
  }
});
Object.defineProperty(exports, "SessionStorageCookieOptions", {
  enumerable: true,
  get: function () {
    return _http.SessionStorageCookieOptions;
  }
});
Object.defineProperty(exports, "SessionCookieValidationResult", {
  enumerable: true,
  get: function () {
    return _http.SessionCookieValidationResult;
  }
});
Object.defineProperty(exports, "SessionStorageFactory", {
  enumerable: true,
  get: function () {
    return _http.SessionStorageFactory;
  }
});
Object.defineProperty(exports, "DestructiveRouteMethod", {
  enumerable: true,
  get: function () {
    return _http.DestructiveRouteMethod;
  }
});
Object.defineProperty(exports, "SafeRouteMethod", {
  enumerable: true,
  get: function () {
    return _http.SafeRouteMethod;
  }
});
Object.defineProperty(exports, "IRenderOptions", {
  enumerable: true,
  get: function () {
    return _rendering.IRenderOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsBulkCreateObject", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsBulkCreateObject;
  }
});
Object.defineProperty(exports, "SavedObjectsBulkGetObject", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsBulkGetObject;
  }
});
Object.defineProperty(exports, "SavedObjectsBulkUpdateObject", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsBulkUpdateObject;
  }
});
Object.defineProperty(exports, "SavedObjectsBulkUpdateOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsBulkUpdateOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsBulkResponse", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsBulkResponse;
  }
});
Object.defineProperty(exports, "SavedObjectsBulkUpdateResponse", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsBulkUpdateResponse;
  }
});
Object.defineProperty(exports, "SavedObjectsCheckConflictsObject", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsCheckConflictsObject;
  }
});
Object.defineProperty(exports, "SavedObjectsCheckConflictsResponse", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsCheckConflictsResponse;
  }
});
Object.defineProperty(exports, "SavedObjectsClient", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsClient;
  }
});
Object.defineProperty(exports, "SavedObjectsClientProviderOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsClientProviderOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsClientWrapperFactory", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsClientWrapperFactory;
  }
});
Object.defineProperty(exports, "SavedObjectsClientWrapperOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsClientWrapperOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsClientFactory", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsClientFactory;
  }
});
Object.defineProperty(exports, "SavedObjectsClientFactoryProvider", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsClientFactoryProvider;
  }
});
Object.defineProperty(exports, "SavedObjectsClosePointInTimeOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsClosePointInTimeOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsClosePointInTimeResponse", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsClosePointInTimeResponse;
  }
});
Object.defineProperty(exports, "SavedObjectsCreateOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsCreateOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsErrorHelpers", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsErrorHelpers;
  }
});
Object.defineProperty(exports, "SavedObjectsExportResultDetails", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsExportResultDetails;
  }
});
Object.defineProperty(exports, "SavedObjectsFindResult", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsFindResult;
  }
});
Object.defineProperty(exports, "SavedObjectsFindResponse", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsFindResponse;
  }
});
Object.defineProperty(exports, "SavedObjectsImportConflictError", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportConflictError;
  }
});
Object.defineProperty(exports, "SavedObjectsImportAmbiguousConflictError", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportAmbiguousConflictError;
  }
});
Object.defineProperty(exports, "SavedObjectsImportFailure", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportFailure;
  }
});
Object.defineProperty(exports, "SavedObjectsImportMissingReferencesError", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportMissingReferencesError;
  }
});
Object.defineProperty(exports, "SavedObjectsImportOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsImportResponse", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportResponse;
  }
});
Object.defineProperty(exports, "SavedObjectsImportRetry", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportRetry;
  }
});
Object.defineProperty(exports, "SavedObjectsImportSuccess", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportSuccess;
  }
});
Object.defineProperty(exports, "SavedObjectsImportUnknownError", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportUnknownError;
  }
});
Object.defineProperty(exports, "SavedObjectsImportUnsupportedTypeError", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportUnsupportedTypeError;
  }
});
Object.defineProperty(exports, "SavedObjectMigrationContext", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectMigrationContext;
  }
});
Object.defineProperty(exports, "SavedObjectsMigrationLogger", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsMigrationLogger;
  }
});
Object.defineProperty(exports, "SavedObjectsOpenPointInTimeOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsOpenPointInTimeOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsOpenPointInTimeResponse", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsOpenPointInTimeResponse;
  }
});
Object.defineProperty(exports, "SavedObjectsRawDoc", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsRawDoc;
  }
});
Object.defineProperty(exports, "SavedObjectsRawDocParseOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsRawDocParseOptions;
  }
});
Object.defineProperty(exports, "SavedObjectSanitizedDoc", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectSanitizedDoc;
  }
});
Object.defineProperty(exports, "SavedObjectUnsanitizedDoc", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectUnsanitizedDoc;
  }
});
Object.defineProperty(exports, "SavedObjectsRepositoryFactory", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsRepositoryFactory;
  }
});
Object.defineProperty(exports, "SavedObjectsResolveImportErrorsOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsResolveImportErrorsOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsResolveResponse", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsResolveResponse;
  }
});
Object.defineProperty(exports, "SavedObjectsSerializer", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsSerializer;
  }
});
Object.defineProperty(exports, "SavedObjectsUpdateOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsUpdateOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsUpdateResponse", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsUpdateResponse;
  }
});
Object.defineProperty(exports, "SavedObjectsAddToNamespacesOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsAddToNamespacesOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsAddToNamespacesResponse", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsAddToNamespacesResponse;
  }
});
Object.defineProperty(exports, "SavedObjectsDeleteFromNamespacesOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsDeleteFromNamespacesOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsDeleteFromNamespacesResponse", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsDeleteFromNamespacesResponse;
  }
});
Object.defineProperty(exports, "SavedObjectsRemoveReferencesToOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsRemoveReferencesToOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsRemoveReferencesToResponse", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsRemoveReferencesToResponse;
  }
});
Object.defineProperty(exports, "SavedObjectsServiceStart", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsServiceStart;
  }
});
Object.defineProperty(exports, "SavedObjectsServiceSetup", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsServiceSetup;
  }
});
Object.defineProperty(exports, "SavedObjectStatusMeta", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectStatusMeta;
  }
});
Object.defineProperty(exports, "SavedObjectsDeleteOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsDeleteOptions;
  }
});
Object.defineProperty(exports, "ISavedObjectsRepository", {
  enumerable: true,
  get: function () {
    return _saved_objects.ISavedObjectsRepository;
  }
});
Object.defineProperty(exports, "SavedObjectsRepository", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsRepository;
  }
});
Object.defineProperty(exports, "SavedObjectsDeleteByNamespaceOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsDeleteByNamespaceOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsIncrementCounterOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsIncrementCounterOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsIncrementCounterField", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsIncrementCounterField;
  }
});
Object.defineProperty(exports, "SavedObjectsComplexFieldMapping", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsComplexFieldMapping;
  }
});
Object.defineProperty(exports, "SavedObjectsCoreFieldMapping", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsCoreFieldMapping;
  }
});
Object.defineProperty(exports, "SavedObjectsFieldMapping", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsFieldMapping;
  }
});
Object.defineProperty(exports, "SavedObjectsTypeMappingDefinition", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsTypeMappingDefinition;
  }
});
Object.defineProperty(exports, "SavedObjectsMappingProperties", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsMappingProperties;
  }
});
Object.defineProperty(exports, "SavedObjectTypeRegistry", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectTypeRegistry;
  }
});
Object.defineProperty(exports, "ISavedObjectTypeRegistry", {
  enumerable: true,
  get: function () {
    return _saved_objects.ISavedObjectTypeRegistry;
  }
});
Object.defineProperty(exports, "SavedObjectsNamespaceType", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsNamespaceType;
  }
});
Object.defineProperty(exports, "SavedObjectsType", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsType;
  }
});
Object.defineProperty(exports, "SavedObjectsTypeManagementDefinition", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsTypeManagementDefinition;
  }
});
Object.defineProperty(exports, "SavedObjectMigrationMap", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectMigrationMap;
  }
});
Object.defineProperty(exports, "SavedObjectMigrationFn", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectMigrationFn;
  }
});
Object.defineProperty(exports, "SavedObjectsUtils", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsUtils;
  }
});
Object.defineProperty(exports, "SavedObjectsExporter", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsExporter;
  }
});
Object.defineProperty(exports, "ISavedObjectsExporter", {
  enumerable: true,
  get: function () {
    return _saved_objects.ISavedObjectsExporter;
  }
});
Object.defineProperty(exports, "SavedObjectExportBaseOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectExportBaseOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsExportByObjectOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsExportByObjectOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsExportByTypeOptions", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsExportByTypeOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsExportError", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsExportError;
  }
});
Object.defineProperty(exports, "SavedObjectsExportTransform", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsExportTransform;
  }
});
Object.defineProperty(exports, "SavedObjectsExportTransformContext", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsExportTransformContext;
  }
});
Object.defineProperty(exports, "SavedObjectsImporter", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImporter;
  }
});
Object.defineProperty(exports, "ISavedObjectsImporter", {
  enumerable: true,
  get: function () {
    return _saved_objects.ISavedObjectsImporter;
  }
});
Object.defineProperty(exports, "SavedObjectsImportError", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportError;
  }
});
Object.defineProperty(exports, "SavedObjectsImportHook", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportHook;
  }
});
Object.defineProperty(exports, "SavedObjectsImportHookResult", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportHookResult;
  }
});
Object.defineProperty(exports, "SavedObjectsImportSimpleWarning", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportSimpleWarning;
  }
});
Object.defineProperty(exports, "SavedObjectsImportActionRequiredWarning", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportActionRequiredWarning;
  }
});
Object.defineProperty(exports, "SavedObjectsImportWarning", {
  enumerable: true,
  get: function () {
    return _saved_objects.SavedObjectsImportWarning;
  }
});
Object.defineProperty(exports, "IUiSettingsClient", {
  enumerable: true,
  get: function () {
    return _ui_settings.IUiSettingsClient;
  }
});
Object.defineProperty(exports, "UiSettingsParams", {
  enumerable: true,
  get: function () {
    return _ui_settings.UiSettingsParams;
  }
});
Object.defineProperty(exports, "PublicUiSettingsParams", {
  enumerable: true,
  get: function () {
    return _ui_settings.PublicUiSettingsParams;
  }
});
Object.defineProperty(exports, "UiSettingsType", {
  enumerable: true,
  get: function () {
    return _ui_settings.UiSettingsType;
  }
});
Object.defineProperty(exports, "UiSettingsServiceSetup", {
  enumerable: true,
  get: function () {
    return _ui_settings.UiSettingsServiceSetup;
  }
});
Object.defineProperty(exports, "UiSettingsServiceStart", {
  enumerable: true,
  get: function () {
    return _ui_settings.UiSettingsServiceStart;
  }
});
Object.defineProperty(exports, "UserProvidedValues", {
  enumerable: true,
  get: function () {
    return _ui_settings.UserProvidedValues;
  }
});
Object.defineProperty(exports, "ImageValidation", {
  enumerable: true,
  get: function () {
    return _ui_settings.ImageValidation;
  }
});
Object.defineProperty(exports, "DeprecationSettings", {
  enumerable: true,
  get: function () {
    return _ui_settings.DeprecationSettings;
  }
});
Object.defineProperty(exports, "StringValidation", {
  enumerable: true,
  get: function () {
    return _ui_settings.StringValidation;
  }
});
Object.defineProperty(exports, "StringValidationRegex", {
  enumerable: true,
  get: function () {
    return _ui_settings.StringValidationRegex;
  }
});
Object.defineProperty(exports, "StringValidationRegexString", {
  enumerable: true,
  get: function () {
    return _ui_settings.StringValidationRegexString;
  }
});
Object.defineProperty(exports, "OpsMetrics", {
  enumerable: true,
  get: function () {
    return _metrics.OpsMetrics;
  }
});
Object.defineProperty(exports, "OpsOsMetrics", {
  enumerable: true,
  get: function () {
    return _metrics.OpsOsMetrics;
  }
});
Object.defineProperty(exports, "OpsServerMetrics", {
  enumerable: true,
  get: function () {
    return _metrics.OpsServerMetrics;
  }
});
Object.defineProperty(exports, "OpsProcessMetrics", {
  enumerable: true,
  get: function () {
    return _metrics.OpsProcessMetrics;
  }
});
Object.defineProperty(exports, "MetricsServiceSetup", {
  enumerable: true,
  get: function () {
    return _metrics.MetricsServiceSetup;
  }
});
Object.defineProperty(exports, "MetricsServiceStart", {
  enumerable: true,
  get: function () {
    return _metrics.MetricsServiceStart;
  }
});
Object.defineProperty(exports, "I18nServiceSetup", {
  enumerable: true,
  get: function () {
    return _i18n.I18nServiceSetup;
  }
});
Object.defineProperty(exports, "AppCategory", {
  enumerable: true,
  get: function () {
    return _types.AppCategory;
  }
});
Object.defineProperty(exports, "DEFAULT_APP_CATEGORIES", {
  enumerable: true,
  get: function () {
    return _utils.DEFAULT_APP_CATEGORIES;
  }
});
Object.defineProperty(exports, "SavedObject", {
  enumerable: true,
  get: function () {
    return _types2.SavedObject;
  }
});
Object.defineProperty(exports, "SavedObjectAttribute", {
  enumerable: true,
  get: function () {
    return _types2.SavedObjectAttribute;
  }
});
Object.defineProperty(exports, "SavedObjectAttributes", {
  enumerable: true,
  get: function () {
    return _types2.SavedObjectAttributes;
  }
});
Object.defineProperty(exports, "SavedObjectAttributeSingle", {
  enumerable: true,
  get: function () {
    return _types2.SavedObjectAttributeSingle;
  }
});
Object.defineProperty(exports, "SavedObjectReference", {
  enumerable: true,
  get: function () {
    return _types2.SavedObjectReference;
  }
});
Object.defineProperty(exports, "SavedObjectsBaseOptions", {
  enumerable: true,
  get: function () {
    return _types2.SavedObjectsBaseOptions;
  }
});
Object.defineProperty(exports, "MutatingOperationRefreshSetting", {
  enumerable: true,
  get: function () {
    return _types2.MutatingOperationRefreshSetting;
  }
});
Object.defineProperty(exports, "SavedObjectsClientContract", {
  enumerable: true,
  get: function () {
    return _types2.SavedObjectsClientContract;
  }
});
Object.defineProperty(exports, "SavedObjectsFindOptions", {
  enumerable: true,
  get: function () {
    return _types2.SavedObjectsFindOptions;
  }
});
Object.defineProperty(exports, "SavedObjectsFindOptionsReference", {
  enumerable: true,
  get: function () {
    return _types2.SavedObjectsFindOptionsReference;
  }
});
Object.defineProperty(exports, "SavedObjectsPitParams", {
  enumerable: true,
  get: function () {
    return _types2.SavedObjectsPitParams;
  }
});
Object.defineProperty(exports, "SavedObjectsMigrationVersion", {
  enumerable: true,
  get: function () {
    return _types2.SavedObjectsMigrationVersion;
  }
});
Object.defineProperty(exports, "LegacyServiceSetupDeps", {
  enumerable: true,
  get: function () {
    return _legacy.LegacyServiceSetupDeps;
  }
});
Object.defineProperty(exports, "LegacyServiceStartDeps", {
  enumerable: true,
  get: function () {
    return _legacy.LegacyServiceStartDeps;
  }
});
Object.defineProperty(exports, "LegacyConfig", {
  enumerable: true,
  get: function () {
    return _legacy.LegacyConfig;
  }
});
Object.defineProperty(exports, "CoreStatus", {
  enumerable: true,
  get: function () {
    return _status.CoreStatus;
  }
});
Object.defineProperty(exports, "ServiceStatus", {
  enumerable: true,
  get: function () {
    return _status.ServiceStatus;
  }
});
Object.defineProperty(exports, "ServiceStatusLevel", {
  enumerable: true,
  get: function () {
    return _status.ServiceStatusLevel;
  }
});
Object.defineProperty(exports, "ServiceStatusLevels", {
  enumerable: true,
  get: function () {
    return _status.ServiceStatusLevels;
  }
});
Object.defineProperty(exports, "StatusServiceSetup", {
  enumerable: true,
  get: function () {
    return _status.StatusServiceSetup;
  }
});
exports.config = void 0;

var _elasticsearch = require("./elasticsearch");

var _http_resources = require("./http_resources");

var _plugins = require("./plugins");

var _context = require("./context");

var _capabilities = require("./capabilities");

var _logging = require("./logging");

var _core_usage_data = require("./core_usage_data");

var _bootstrap = require("./bootstrap");

var _config = require("./config");

var _core_context = require("./core_context");

var _csp = require("./csp");

var _api_types = require("./elasticsearch/legacy/api_types");

Object.keys(_api_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _api_types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _api_types[key];
    }
  });
});

var _external_url = require("./external_url");

var _http = require("./http");

var _rendering = require("./rendering");

var _saved_objects = require("./saved_objects");

var _ui_settings = require("./ui_settings");

var _metrics = require("./metrics");

var _i18n = require("./i18n");

var _types = require("../types");

var _utils = require("../utils");

var _types2 = require("./types");

var _legacy = require("./legacy");

var _status = require("./status");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The Kibana Core APIs for server-side plugins.
 *
 * A plugin requires a `kibana.json` file at it's root directory that follows
 * {@link PluginManifest | the manfiest schema} to define static plugin
 * information required to load the plugin.
 *
 * A plugin's `server/index` file must contain a named import, `plugin`, that
 * implements {@link PluginInitializer} which returns an object that implements
 * {@link Plugin}.
 *
 * The plugin integrates with the core system via lifecycle events: `setup`,
 * `start`, and `stop`. In each lifecycle method, the plugin will receive the
 * corresponding core services available (either {@link CoreSetup} or
 * {@link CoreStart}) and any interfaces returned by dependency plugins'
 * lifecycle method. Anything returned by the plugin's lifecycle method will be
 * exposed to downstream dependencies when their corresponding lifecycle methods
 * are invoked.
 *
 * @packageDocumentation
 */
// Because of #79265 we need to explicity import, then export these types for
// scripts/telemetry_check.js to work as expected

/**
 * Config schemas for the platform services.
 *
 * @alpha
 */
const config = {
  elasticsearch: {
    schema: _elasticsearch.configSchema
  },
  logging: {
    appenders: _logging.appendersSchema
  }
};
exports.config = config;