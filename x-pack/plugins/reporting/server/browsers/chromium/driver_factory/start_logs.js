"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.browserStartLogs = void 0;

var _i18n = require("@kbn/i18n");

var _child_process = require("child_process");

var _del = _interopRequireDefault(require("del"));

var _fs = require("fs");

var _lodash = require("lodash");

var _os = require("os");

var _path = require("path");

var _readline = require("readline");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _install = require("../../install");

var _args = require("./args");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const browserLaunchTimeToWait = 5 * 1000; // Default args used by pptr
// https://github.com/puppeteer/puppeteer/blob/13ea347/src/node/Launcher.ts#L168

const defaultArgs = ['--disable-background-networking', '--enable-features=NetworkService,NetworkServiceInProcess', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-breakpad', '--disable-client-side-phishing-detection', '--disable-component-extensions-with-background-pages', '--disable-default-apps', '--disable-dev-shm-usage', '--disable-extensions', '--disable-features=TranslateUI', '--disable-hang-monitor', '--disable-ipc-flooding-protection', '--disable-popup-blocking', '--disable-prompt-on-repost', '--disable-renderer-backgrounding', '--disable-sync', '--force-color-profile=srgb', '--metrics-recording-only', '--no-first-run', '--enable-automation', '--password-store=basic', '--use-mock-keychain', '--remote-debugging-port=0', '--headless'];

const browserStartLogs = (core, logger, overrideFlags = []) => {
  const config = core.getConfig();
  const proxy = config.get('capture', 'browser', 'chromium', 'proxy');
  const disableSandbox = config.get('capture', 'browser', 'chromium', 'disableSandbox');
  const userDataDir = (0, _fs.mkdtempSync)((0, _path.join)((0, _os.tmpdir)(), 'chromium-'));
  const binaryPath = (0, _install.getBinaryPath)();
  const kbnArgs = (0, _args.args)({
    userDataDir,
    viewport: {
      width: 800,
      height: 600
    },
    disableSandbox,
    proxy
  });
  const finalArgs = (0, _lodash.uniq)([...defaultArgs, ...kbnArgs, ...overrideFlags]); // On non-windows platforms, `detached: true` makes child process a
  // leader of a new process group, making it possible to kill child
  // process tree with `.kill(-pid)` command. @see
  // https://nodejs.org/api/child_process.html#child_process_options_detached

  const browserProcess = (0, _child_process.spawn)(binaryPath, finalArgs, {
    detached: process.platform !== 'win32'
  });
  const rl = (0, _readline.createInterface)({
    input: browserProcess.stderr
  });
  const exit$ = (0, _rxjs.fromEvent)(browserProcess, 'exit').pipe((0, _operators.map)(code => {
    logger.error(`Browser exited abnormally, received code: ${code}`);
    return _i18n.i18n.translate('xpack.reporting.diagnostic.browserCrashed', {
      defaultMessage: `Browser exited abnormally during startup`
    });
  }));
  const error$ = (0, _rxjs.fromEvent)(browserProcess, 'error').pipe((0, _operators.map)(() => {
    logger.error(`Browser process threw an error on startup`);
    return _i18n.i18n.translate('xpack.reporting.diagnostic.browserErrored', {
      defaultMessage: `Browser process threw an error on startup`
    });
  }));
  const browserProcessLogger = logger.clone(['chromium-stderr']);
  const log$ = (0, _rxjs.fromEvent)(rl, 'line').pipe((0, _operators.tap)(message => {
    if (typeof message === 'string') {
      browserProcessLogger.info(message);
    }
  })); // Collect all events (exit, error and on log-lines), but let chromium keep spitting out
  // logs as sometimes it's "bind" successfully for remote connections, but later emit
  // a log indicative of an issue (for example, no default font found).

  return (0, _rxjs.merge)(exit$, error$, log$).pipe((0, _operators.takeUntil)((0, _rxjs.timer)(browserLaunchTimeToWait)), (0, _operators.reduce)((acc, curr) => `${acc}${curr}\n`, ''), (0, _operators.tap)(() => {
    if (browserProcess && browserProcess.pid && !browserProcess.killed) {
      browserProcess.kill('SIGKILL');
      logger.info(`Successfully sent 'SIGKILL' to browser process (PID: ${browserProcess.pid})`);
    }

    browserProcess.removeAllListeners();
    rl.removeAllListeners();
    rl.close();
    (0, _del.default)(userDataDir, {
      force: true
    }).catch(error => {
      logger.error(`Error deleting user data directory at [${userDataDir}]!`);
      logger.error(error);
    });
  }), (0, _operators.catchError)(error => {
    logger.error(error);
    return (0, _rxjs.of)(error);
  }));
};

exports.browserStartLogs = browserStartLogs;