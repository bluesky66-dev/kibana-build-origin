"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsService = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _ = require("./");

var _migrations = require("./migrations");

var _saved_objects_config = require("./saved_objects_config");

var _repository = require("./service/lib/repository");

var _saved_objects_type_registry = require("./saved_objects_type_registry");

var _serialization = require("./serialization");

var _export = require("./export");

var _import = require("./import");

var _routes = require("./routes");

var _status = require("./status");

var _object_types = require("./object_types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SavedObjectsService {
  constructor(coreContext) {
    this.coreContext = coreContext;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "setupDeps", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "clientFactoryProvider", void 0);

    _defineProperty(this, "clientFactoryWrappers", []);

    _defineProperty(this, "migrator$", new _rxjs.Subject());

    _defineProperty(this, "typeRegistry", new _saved_objects_type_registry.SavedObjectTypeRegistry());

    _defineProperty(this, "started", false);

    this.logger = coreContext.logger.get('savedobjects-service');
  }

  async setup(setupDeps) {
    this.logger.debug('Setting up SavedObjects service');
    this.setupDeps = setupDeps;
    const {
      http,
      elasticsearch,
      coreUsageData
    } = setupDeps;
    const savedObjectsConfig = await this.coreContext.configService.atPath('savedObjects').pipe((0, _operators.first)()).toPromise();
    const savedObjectsMigrationConfig = await this.coreContext.configService.atPath('migrations').pipe((0, _operators.first)()).toPromise();
    this.config = new _saved_objects_config.SavedObjectConfig(savedObjectsConfig, savedObjectsMigrationConfig);
    coreUsageData.registerType(this.typeRegistry);
    (0, _routes.registerRoutes)({
      http,
      coreUsageData,
      logger: this.logger,
      config: this.config,
      migratorPromise: this.migrator$.pipe((0, _operators.first)()).toPromise()
    });
    (0, _object_types.registerCoreObjectTypes)(this.typeRegistry);
    return {
      status$: (0, _status.calculateStatus$)(this.migrator$.pipe((0, _operators.switchMap)(migrator => migrator.getStatus$())), elasticsearch.status$),
      setClientFactoryProvider: provider => {
        if (this.started) {
          throw new Error('cannot call `setClientFactoryProvider` after service startup.');
        }

        if (this.clientFactoryProvider) {
          throw new Error('custom client factory is already set, and can only be set once');
        }

        this.clientFactoryProvider = provider;
      },
      addClientWrapper: (priority, id, factory) => {
        if (this.started) {
          throw new Error('cannot call `addClientWrapper` after service startup.');
        }

        this.clientFactoryWrappers.push({
          priority,
          id,
          factory
        });
      },
      registerType: type => {
        if (this.started) {
          throw new Error('cannot call `registerType` after service startup.');
        }

        this.typeRegistry.registerType(type);
      }
    };
  }

  async start({
    elasticsearch,
    pluginsInitialized = true
  }, migrationsRetryDelay) {
    if (!this.setupDeps || !this.config) {
      throw new Error('#setup() needs to be run first');
    }

    this.logger.debug('Starting SavedObjects service');
    const kibanaConfig = await this.coreContext.configService.atPath('kibana').pipe((0, _operators.first)()).toPromise();
    const client = elasticsearch.client;
    const migrator = this.createMigrator(kibanaConfig, this.config.migration, elasticsearch.client.asInternalUser, migrationsRetryDelay);
    this.migrator$.next(migrator);
    /**
     * Note: We want to ensure that migrations have completed before
     * continuing with further Core start steps that might use SavedObjects
     * such as running the legacy server, legacy plugins and allowing incoming
     * HTTP requests.
     *
     * However, our build system optimize step and some tests depend on the
     * HTTP server running without an Elasticsearch server being available.
     * So, when the `migrations.skip` is true, we skip migrations altogether.
     *
     * We also cannot safely run migrations if plugins are not initialized since
     * not plugin migrations won't be registered.
     */

    const skipMigrations = this.config.migration.skip || !pluginsInitialized;
    /**
     * Note: Prepares all migrations maps. If a saved object type was registered with property `migrations`
     * of type function; this function will be called to get the type's SavedObjectMigrationMap.
     */

    migrator.prepareMigrations();

    if (skipMigrations) {
      this.logger.warn('Skipping Saved Object migrations on startup. Note: Individual documents will still be migrated when read or written.');
    } else {
      this.logger.info('Waiting until all Elasticsearch nodes are compatible with Kibana before starting saved objects migrations...'); // TODO: Move to Status Service https://github.com/elastic/kibana/issues/41983

      this.setupDeps.elasticsearch.esNodesCompatibility$.subscribe(({
        isCompatible,
        message
      }) => {
        if (!isCompatible && message) {
          this.logger.error(message);
        }
      });
      await this.setupDeps.elasticsearch.esNodesCompatibility$.pipe((0, _operators.filter)(nodes => nodes.isCompatible), (0, _operators.take)(1)).toPromise();
      this.logger.info('Starting saved objects migrations');
      await migrator.runMigrations();
    }

    const createRepository = (esClient, includedHiddenTypes = []) => {
      return _repository.SavedObjectsRepository.createRepository(migrator, this.typeRegistry, kibanaConfig.index, esClient, includedHiddenTypes);
    };

    const repositoryFactory = {
      createInternalRepository: includedHiddenTypes => createRepository(client.asInternalUser, includedHiddenTypes),
      createScopedRepository: (req, includedHiddenTypes) => createRepository(client.asScoped(req).asCurrentUser, includedHiddenTypes)
    };
    const clientProvider = new _.SavedObjectsClientProvider({
      defaultClientFactory({
        request,
        includedHiddenTypes
      }) {
        const repository = repositoryFactory.createScopedRepository(request, includedHiddenTypes);
        return new _.SavedObjectsClient(repository);
      },

      typeRegistry: this.typeRegistry
    });

    if (this.clientFactoryProvider) {
      const clientFactory = this.clientFactoryProvider(repositoryFactory);
      clientProvider.setClientFactory(clientFactory);
    }

    this.clientFactoryWrappers.forEach(({
      id,
      factory,
      priority
    }) => {
      clientProvider.addClientWrapperFactory(priority, id, factory);
    });
    this.started = true;
    return {
      getScopedClient: clientProvider.getClient.bind(clientProvider),
      createScopedRepository: repositoryFactory.createScopedRepository,
      createInternalRepository: repositoryFactory.createInternalRepository,
      createSerializer: () => new _serialization.SavedObjectsSerializer(this.typeRegistry),
      createExporter: savedObjectsClient => new _export.SavedObjectsExporter({
        savedObjectsClient,
        typeRegistry: this.typeRegistry,
        exportSizeLimit: this.config.maxImportExportSize,
        logger: this.logger.get('exporter')
      }),
      createImporter: savedObjectsClient => new _import.SavedObjectsImporter({
        savedObjectsClient,
        typeRegistry: this.typeRegistry,
        importSizeLimit: this.config.maxImportExportSize
      }),
      getTypeRegistry: () => this.typeRegistry
    };
  }

  async stop() {}

  createMigrator(kibanaConfig, soMigrationsConfig, client, migrationsRetryDelay) {
    return new _migrations.KibanaMigrator({
      typeRegistry: this.typeRegistry,
      logger: this.logger,
      kibanaVersion: this.coreContext.env.packageInfo.version,
      soMigrationsConfig,
      kibanaConfig,
      client,
      migrationsRetryDelay
    });
  }

}

exports.SavedObjectsService = SavedObjectsService;