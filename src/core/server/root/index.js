"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Root = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _logging = require("../logging");

var _server = require("../server");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Top-level entry point to kick off the app and start the Kibana server.
 */
class Root {
  constructor(rawConfigProvider, env, onShutdown) {
    this.env = env;
    this.onShutdown = onShutdown;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "loggingSystem", void 0);

    _defineProperty(this, "server", void 0);

    _defineProperty(this, "loggingConfigSubscription", void 0);

    this.loggingSystem = new _logging.LoggingSystem();
    this.logger = this.loggingSystem.asLoggerFactory();
    this.log = this.logger.get('root');
    this.server = new _server.Server(rawConfigProvider, env, this.loggingSystem);
  }

  async setup() {
    try {
      this.server.setupCoreConfig();
      await this.setupLogging();
      this.log.debug('setting up root');
      return await this.server.setup();
    } catch (e) {
      await this.shutdown(e);
      throw e;
    }
  }

  async start() {
    this.log.debug('starting root');

    try {
      return await this.server.start();
    } catch (e) {
      await this.shutdown(e);
      throw e;
    }
  }

  async shutdown(reason) {
    this.log.debug('shutting root down');

    if (reason) {
      if (reason.code === 'EADDRINUSE' && Number.isInteger(reason.port)) {
        reason = new Error(`Port ${reason.port} is already in use. Another instance of Kibana may be running!`);
      }

      this.log.fatal(reason);
    }

    await this.server.stop();

    if (this.loggingConfigSubscription !== undefined) {
      this.loggingConfigSubscription.unsubscribe();
      this.loggingConfigSubscription = undefined;
    }

    await this.loggingSystem.stop();

    if (this.onShutdown !== undefined) {
      this.onShutdown(reason);
    }
  }

  async setupLogging() {
    const {
      configService
    } = this.server; // Stream that maps config updates to logger updates, including update failures.

    const update$ = configService.getConfig$().pipe( // always read the logging config when the underlying config object is re-read
    // except for the CLI process where we only apply the default logging config once
    (0, _operators.switchMap)(() => this.env.isDevCliParent ? (0, _rxjs.of)(undefined) : configService.atPath('logging')), (0, _operators.concatMap)(config => this.loggingSystem.upgrade(config)), // This specifically console.logs because we were not able to configure the logger.
    // eslint-disable-next-line no-console
    (0, _operators.tap)({
      error: err => console.error('Configuring logger failed:', err)
    }), (0, _operators.publishReplay)(1)); // Subscription and wait for the first update to complete and throw if it fails.

    const connectSubscription = update$.connect();
    await update$.pipe((0, _operators.first)()).toPromise(); // Send subsequent update failures to this.shutdown(), stopped via loggingConfigSubscription.

    this.loggingConfigSubscription = update$.subscribe({
      error: err => this.shutdown(err)
    }); // Add subscription we got from `connect` so that we can dispose both of them
    // at once. We can't inverse this and add consequent updates subscription to
    // the one we got from `connect` because in the error case the latter will be
    // automatically disposed before the error is forwarded to the former one so
    // the shutdown logic won't be called.

    this.loggingConfigSubscription.add(connectSubscription);
  }

}

exports.Root = Root;