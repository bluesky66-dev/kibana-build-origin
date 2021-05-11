"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrintLayout = void 0;

var _path = _interopRequireDefault(require("path"));

var _common = require("../../../common");

var _constants = require("../../../common/constants");

var _layout = require("./layout");

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

class PrintLayout extends _layout.Layout {
  constructor(captureConfig) {
    super(_constants.LAYOUT_TYPES.PRINT);

    _defineProperty(this, "selectors", { ...(0, _common.getDefaultLayoutSelectors)(),
      screenshot: '[data-shared-item]'
    });

    _defineProperty(this, "groupCount", 2);

    _defineProperty(this, "captureConfig", void 0);

    this.captureConfig = captureConfig;
  }

  getCssOverridesPath() {
    return _path.default.join(__dirname, 'print.css');
  }

  getBrowserViewport() {
    return this.captureConfig.viewport;
  }

  getBrowserZoom() {
    return this.captureConfig.zoom;
  }

  getViewport(itemsCount) {
    return {
      zoom: this.captureConfig.zoom,
      width: this.captureConfig.viewport.width,
      height: this.captureConfig.viewport.height * itemsCount
    };
  }

  async positionElements(browser, logger) {
    logger.debug('positioning elements');
    const elementSize = {
      width: this.captureConfig.viewport.width / this.captureConfig.zoom,
      height: this.captureConfig.viewport.height / this.captureConfig.zoom
    };
    const evalOptions = {
      fn: (selector, height, width) => {
        const visualizations = document.querySelectorAll(selector);
        const visualizationsLength = visualizations.length;

        for (let i = 0; i < visualizationsLength; i++) {
          const visualization = visualizations[i];
          const style = visualization.style;
          style.position = 'fixed';
          style.top = `${height * i}px`;
          style.left = '0';
          style.width = `${width}px`;
          style.height = `${height}px`;
          style.zIndex = '1';
          style.backgroundColor = 'inherit';
        }
      },
      args: [this.selectors.screenshot, elementSize.height, elementSize.width]
    };
    await browser.evaluate(evalOptions, {
      context: 'PositionElements'
    }, logger);
  }

  getPdfImageSize() {
    return {
      width: 500
    };
  }

  getPdfPageOrientation() {
    return 'portrait';
  }

  getPdfPageSize() {
    return 'A4';
  }

}

exports.PrintLayout = PrintLayout;