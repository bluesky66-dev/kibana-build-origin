"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PreserveLayout = void 0;

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
} // We use a zoom of two to bump up the resolution of the screenshot a bit.


const ZOOM = 2;

class PreserveLayout extends _layout.Layout {
  constructor(size, layoutSelectors) {
    super(_constants.LAYOUT_TYPES.PRESERVE_LAYOUT);

    _defineProperty(this, "selectors", (0, _common.getDefaultLayoutSelectors)());

    _defineProperty(this, "groupCount", 1);

    _defineProperty(this, "height", void 0);

    _defineProperty(this, "width", void 0);

    _defineProperty(this, "scaledHeight", void 0);

    _defineProperty(this, "scaledWidth", void 0);

    this.height = size.height;
    this.width = size.width;
    this.scaledHeight = size.height * ZOOM;
    this.scaledWidth = size.width * ZOOM;

    if (layoutSelectors) {
      this.selectors = layoutSelectors;
    }
  }

  getCssOverridesPath() {
    return _path.default.join(__dirname, 'preserve_layout.css');
  }

  getBrowserViewport() {
    return {
      height: this.scaledHeight,
      width: this.scaledWidth
    };
  }

  getBrowserZoom() {
    return ZOOM;
  }

  getViewport() {
    return {
      height: this.height,
      width: this.width,
      zoom: ZOOM
    };
  }

  getPdfImageSize() {
    return {
      height: this.height,
      width: this.width
    };
  }

  getPdfPageOrientation() {
    return undefined;
  }

  getPdfPageSize(pageSizeParams) {
    return {
      height: this.height + pageSizeParams.pageMarginTop + pageSizeParams.pageMarginBottom + pageSizeParams.tableBorderWidth * 2 + pageSizeParams.headingHeight + pageSizeParams.subheadingHeight,
      width: this.width + pageSizeParams.pageMarginWidth * 2 + pageSizeParams.tableBorderWidth * 2
    };
  }

}

exports.PreserveLayout = PreserveLayout;