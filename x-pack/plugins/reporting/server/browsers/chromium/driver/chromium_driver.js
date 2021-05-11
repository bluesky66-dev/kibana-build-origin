"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadlessChromiumDriver = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _opn = _interopRequireDefault(require("opn"));

var _url = require("url");

var _ = require("../");

var _network_policy = require("../../network_policy");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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

const WAIT_FOR_DELAY_MS = 100;

class HeadlessChromiumDriver {
  constructor(page, {
    inspect,
    networkPolicy
  }) {
    _defineProperty(this, "page", void 0);

    _defineProperty(this, "inspect", void 0);

    _defineProperty(this, "networkPolicy", void 0);

    _defineProperty(this, "listenersAttached", false);

    _defineProperty(this, "interceptedCount", 0);

    this.page = page;
    this.inspect = inspect;
    this.networkPolicy = networkPolicy;
  }

  allowRequest(url) {
    return !this.networkPolicy.enabled || (0, _network_policy.allowRequest)(url, this.networkPolicy.rules);
  }

  truncateUrl(url) {
    return (0, _lodash.truncate)(url, {
      length: 100,
      omission: '[truncated]'
    });
  }
  /*
   * Call Page.goto and wait to see the Kibana DOM content
   */


  async open(url, {
    conditionalHeaders,
    waitForSelector: pageLoadSelector,
    timeout
  }, logger) {
    logger.info(`opening url ${url}`); // Reset intercepted request count

    this.interceptedCount = 0;
    await this.page.setRequestInterception(true);
    this.registerListeners(conditionalHeaders, logger);
    await this.page.goto(url, {
      waitUntil: 'domcontentloaded'
    });

    if (this.inspect) {
      await this.launchDebugger();
    }

    await this.waitForSelector(pageLoadSelector, {
      timeout
    }, {
      context: 'waiting for page load selector'
    }, logger);
    logger.info(`handled ${this.interceptedCount} page requests`);
  }
  /*
   * Let modules poll if Chrome is still running so they can short circuit if needed
   */


  isPageOpen() {
    return !this.page.isClosed();
  }
  /*
   * Call Page.screenshot and return a base64-encoded string of the image
   */


  async screenshot(elementPosition) {
    const {
      boundingClientRect,
      scroll
    } = elementPosition;
    const screenshot = await this.page.screenshot({
      clip: {
        x: boundingClientRect.left + scroll.x,
        y: boundingClientRect.top + scroll.y,
        height: boundingClientRect.height,
        width: boundingClientRect.width
      }
    });
    return screenshot.toString('base64');
  }

  async evaluate({
    fn,
    args = []
  }, meta, logger) {
    logger.debug(`evaluate ${meta.context}`);
    const result = await this.page.evaluate(fn, ...args);
    return result;
  }

  async waitForSelector(selector, opts, context, logger) {
    const {
      timeout
    } = opts;
    logger.debug(`waitForSelector ${selector}`);
    const resp = await this.page.waitForSelector(selector, {
      timeout
    }); // override default 30000ms

    logger.debug(`waitForSelector ${selector} resolved`);
    return resp;
  }

  async waitFor({
    fn,
    args,
    toEqual,
    timeout
  }, context, logger) {
    const startTime = Date.now();

    while (true) {
      const result = await this.evaluate({
        fn,
        args
      }, context, logger);

      if (result === toEqual) {
        return;
      }

      if (Date.now() - startTime > timeout) {
        throw new Error(`Timed out waiting for the items selected to equal ${toEqual}. Found: ${result}. Context: ${context.context}`);
      }

      await new Promise(r => setTimeout(r, WAIT_FOR_DELAY_MS));
    }
  }

  async setViewport({
    width: _width,
    height: _height,
    zoom
  }, logger) {
    const width = Math.floor(_width);
    const height = Math.floor(_height);
    logger.debug(`Setting viewport to: width=${width} height=${height} zoom=${zoom}`);
    await this.page.setViewport({
      width,
      height,
      deviceScaleFactor: zoom,
      isMobile: false
    });
  }

  registerListeners(conditionalHeaders, logger) {
    if (this.listenersAttached) {
      return;
    } // @ts-ignore


    const client = this.page._client; // We have to reach into the Chrome Devtools Protocol to apply headers as using
    // puppeteer's API will cause map tile requests to hang indefinitely:
    //    https://github.com/puppeteer/puppeteer/issues/5003
    // Docs on this client/protocol can be found here:
    //    https://chromedevtools.github.io/devtools-protocol/tot/Fetch

    client.on('Fetch.requestPaused', async interceptedRequest => {
      const {
        requestId,
        request: {
          url: interceptedUrl
        }
      } = interceptedRequest;
      const allowed = !interceptedUrl.startsWith('file://');
      const isData = interceptedUrl.startsWith('data:'); // We should never ever let file protocol requests go through

      if (!allowed || !this.allowRequest(interceptedUrl)) {
        await client.send('Fetch.failRequest', {
          errorReason: 'Aborted',
          requestId
        });
        this.page.browser().close();
        logger.error((0, _.getDisallowedOutgoingUrlError)(interceptedUrl));
        return;
      }

      if (this._shouldUseCustomHeaders(conditionalHeaders.conditions, interceptedUrl)) {
        logger.trace(`Using custom headers for ${interceptedUrl}`);
        const headers = (0, _lodash.map)({ ...interceptedRequest.request.headers,
          ...conditionalHeaders.headers
        }, (value, name) => ({
          name,
          value
        }));

        try {
          await client.send('Fetch.continueRequest', {
            requestId,
            headers
          });
        } catch (err) {
          logger.error(_i18n.i18n.translate('xpack.reporting.chromiumDriver.failedToCompleteRequestUsingHeaders', {
            defaultMessage: 'Failed to complete a request using headers: {error}',
            values: {
              error: err
            }
          }));
        }
      } else {
        const loggedUrl = isData ? this.truncateUrl(interceptedUrl) : interceptedUrl;
        logger.trace(`No custom headers for ${loggedUrl}`);

        try {
          await client.send('Fetch.continueRequest', {
            requestId
          });
        } catch (err) {
          logger.error(_i18n.i18n.translate('xpack.reporting.chromiumDriver.failedToCompleteRequest', {
            defaultMessage: 'Failed to complete a request: {error}',
            values: {
              error: err
            }
          }));
        }
      }

      this.interceptedCount = this.interceptedCount + (isData ? 0 : 1);
    }); // Even though 3xx redirects go through our request
    // handler, we should probably inspect responses just to
    // avoid being bamboozled by some malicious request

    this.page.on('response', interceptedResponse => {
      const interceptedUrl = interceptedResponse.url();
      const allowed = !interceptedUrl.startsWith('file://');

      if (!interceptedResponse.ok()) {
        logger.warn(`Chromium received a non-OK response (${interceptedResponse.status()}) for request ${interceptedUrl}`);
      }

      if (!allowed || !this.allowRequest(interceptedUrl)) {
        this.page.browser().close();
        logger.error((0, _.getDisallowedOutgoingUrlError)(interceptedUrl));
        return;
      }
    });
    this.listenersAttached = true;
  }

  async launchDebugger() {
    // In order to pause on execution we have to reach more deeply into Chromiums Devtools Protocol,
    // and more specifically, for the page being used. _client is per-page, and puppeteer doesn't expose
    // a page's client in their api, so we have to reach into internals to get this behavior.
    // Finally, in order to get the inspector running, we have to know the page's internal ID (again, private)
    // in order to construct the final debugging URL.
    // @ts-ignore
    await this.page._client.send('Debugger.enable'); // @ts-ignore

    await this.page._client.send('Debugger.pause'); // @ts-ignore

    const targetId = this.page._target._targetId;
    const wsEndpoint = this.page.browser().wsEndpoint();
    const {
      port
    } = (0, _url.parse)(wsEndpoint);
    (0, _opn.default)(`http://localhost:${port}/devtools/inspector.html?ws=localhost:${port}/devtools/page/${targetId}`);
  }

  _shouldUseCustomHeaders(conditions, url) {
    const {
      hostname,
      protocol,
      port,
      pathname
    } = (0, _url.parse)(url); // `port` is null in URLs that don't explicitly state it,
    // however we can derive the port from the protocol (http/https)
    // IE: https://feeds-staging.elastic.co/kibana/v8.0.0.json

    const derivedPort = (() => {
      if (port) {
        return port;
      }

      if (protocol === 'http:') {
        return '80';
      }

      if (protocol === 'https:') {
        return '443';
      }

      return null;
    })();

    if (derivedPort === null) throw new Error(`URL missing port: ${url}`);
    if (pathname === null) throw new Error(`URL missing pathname: ${url}`);
    return hostname === conditions.hostname && protocol === `${conditions.protocol}:` && this._shouldUseCustomHeadersForPort(conditions, derivedPort) && pathname.startsWith(`${conditions.basePath}/`);
  }

  _shouldUseCustomHeadersForPort(conditions, port) {
    if (conditions.protocol === 'http' && conditions.port === 80) {
      return port === undefined || port === null || port === '' || port === conditions.port.toString();
    }

    if (conditions.protocol === 'https' && conditions.port === 443) {
      return port === undefined || port === null || port === '' || port === conditions.port.toString();
    }

    return port === conditions.port.toString();
  }

}

exports.HeadlessChromiumDriver = HeadlessChromiumDriver;