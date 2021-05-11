"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpacesClientService = void 0;

var _spaces_client = require("./spaces_client");

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

class SpacesClientService {
  constructor(debugLogger) {
    this.debugLogger = debugLogger;

    _defineProperty(this, "repositoryFactory", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "clientWrapper", void 0);
  }

  setup({
    config$
  }) {
    config$.subscribe(nextConfig => {
      this.config = nextConfig;
    });
    return {
      setClientRepositoryFactory: repositoryFactory => {
        if (this.repositoryFactory) {
          throw new Error(`Repository factory has already been set`);
        }

        this.repositoryFactory = repositoryFactory;
      },
      registerClientWrapper: wrapper => {
        if (this.clientWrapper) {
          throw new Error(`Client wrapper has already been set`);
        }

        this.clientWrapper = wrapper;
      }
    };
  }

  start(coreStart) {
    if (!this.repositoryFactory) {
      this.repositoryFactory = (request, savedObjectsStart) => savedObjectsStart.createScopedRepository(request, ['space']);
    }

    return {
      createSpacesClient: request => {
        if (!this.config) {
          throw new Error('Initialization error: spaces config is not available');
        }

        const baseClient = new _spaces_client.SpacesClient(this.debugLogger, this.config, this.repositoryFactory(request, coreStart.savedObjects));

        if (this.clientWrapper) {
          return this.clientWrapper(request, baseClient);
        }

        return baseClient;
      }
    };
  }

}

exports.SpacesClientService = SpacesClientService;