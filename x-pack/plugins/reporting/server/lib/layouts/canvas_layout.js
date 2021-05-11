"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasLayout = void 0;

var _ = require("./");

var _layout = require("./layout");

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
} // FIXME - should use zoom from capture config


const ZOOM = 2;
/*
 * This class provides a Layout definition. The PdfMaker class uses this to
 * define a document layout that includes no margins or branding or added logos.
 * The single image that was captured should be the only structural part of the
 * PDF document definition
 */

class CanvasLayout extends _layout.Layout {
  constructor(size) {
    super(_.LayoutTypes.CANVAS);

    _defineProperty(this, "selectors", (0, _.getDefaultLayoutSelectors)());

    _defineProperty(this, "groupCount", 1);

    _defineProperty(this, "height", void 0);

    _defineProperty(this, "width", void 0);

    _defineProperty(this, "scaledHeight", void 0);

    _defineProperty(this, "scaledWidth", void 0);

    _defineProperty(this, "hasHeader", false);

    _defineProperty(this, "hasFooter", false);

    _defineProperty(this, "useReportingBranding", false);

    this.height = size.height;
    this.width = size.width;
    this.scaledHeight = size.height * ZOOM;
    this.scaledWidth = size.width * ZOOM;
  }

  getPdfPageOrientation() {
    return undefined;
  }

  getCssOverridesPath() {
    return undefined;
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

  getPdfPageSize(pageSizeParams) {
    return {
      height: this.height,
      width: this.width
    };
  }

}

exports.CanvasLayout = CanvasLayout;