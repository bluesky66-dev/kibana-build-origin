"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchService = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _errors = require("../../common/errors");

var _operators2 = require("../../common/operators");

var _constants = require("../../common/constants");

var _process_result = require("../../common/process_result");

var _context = require("./context");

var _utils = require("./utils");

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

const mapToUndefined = () => undefined;
/** @internal */


class SearchService {
  constructor() {
    _defineProperty(this, "providers", new Map());

    _defineProperty(this, "basePath", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "contextFactory", void 0);

    _defineProperty(this, "licenseChecker", void 0);

    _defineProperty(this, "maxProviderResults", _constants.defaultMaxProviderResults);
  }

  setup({
    basePath,
    config,
    maxProviderResults = _constants.defaultMaxProviderResults
  }) {
    this.basePath = basePath;
    this.config = config;
    this.maxProviderResults = maxProviderResults;
    return {
      registerResultProvider: provider => {
        if (this.providers.has(provider.id)) {
          throw new Error(`trying to register duplicate provider: ${provider.id}`);
        }

        this.providers.set(provider.id, provider);
      }
    };
  }

  start({
    core,
    licenseChecker
  }) {
    this.licenseChecker = licenseChecker;
    this.contextFactory = (0, _context.getContextFactory)(core);
    return {
      find: (params, options, request) => this.performFind(params, options, request),
      getSearchableTypes: request => this.getSearchableTypes(request)
    };
  }

  async getSearchableTypes(request) {
    const context = this.contextFactory(request);
    const allTypes = (await Promise.all([...this.providers.values()].map(provider => provider.getSearchableTypes(context)))).flat();
    return (0, _lodash.uniq)(allTypes);
  }

  performFind(params, options, request) {
    var _options$preference;

    const licenseState = this.licenseChecker.getState();

    if (!licenseState.valid) {
      return (0, _rxjs.throwError)(_errors.GlobalSearchFindError.invalidLicense(_i18n.i18n.translate('xpack.globalSearch.find.invalidLicenseError', {
        defaultMessage: `GlobalSearch API is disabled because of invalid license state: {errorMessage}`,
        values: {
          errorMessage: licenseState.message
        }
      })));
    }

    const context = this.contextFactory(request);
    const basePath = (0, _utils.getRequestBasePath)(request, this.basePath);
    const timeout$ = (0, _rxjs.timer)(this.config.search_timeout.asMilliseconds()).pipe((0, _operators.map)(mapToUndefined));
    const aborted$ = options.aborted$ ? (0, _rxjs.merge)(options.aborted$, timeout$) : timeout$;
    const findOptions = { ...options,
      preference: (_options$preference = options.preference) !== null && _options$preference !== void 0 ? _options$preference : 'default',
      maxResults: this.maxProviderResults,
      aborted$
    };

    const processResult = result => (0, _process_result.processProviderResult)(result, basePath);

    const providersResults$ = [...this.providers.values()].map(provider => provider.find(params, findOptions, context).pipe((0, _operators2.takeInArray)(this.maxProviderResults), (0, _operators.takeUntil)(aborted$), (0, _operators.map)(results => results.map(r => processResult(r)))));
    return (0, _rxjs.merge)(...providersResults$).pipe((0, _operators.map)(results => ({
      results
    })));
  }

}

exports.SearchService = SearchService;