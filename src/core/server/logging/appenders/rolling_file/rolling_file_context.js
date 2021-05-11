"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollingFileContext = void 0;

var _fs = require("fs");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Context shared between the rolling file manager, policy and strategy.
 */
class RollingFileContext {
  constructor(filePath) {
    this.filePath = filePath;

    _defineProperty(this, "currentFileSize", 0);

    _defineProperty(this, "currentFileTime", 0);
  }
  /**
   * The size of the currently opened file.
   */


  refreshFileInfo() {
    try {
      const {
        birthtime,
        size
      } = (0, _fs.statSync)(this.filePath);
      this.currentFileTime = birthtime.getTime();
      this.currentFileSize = size;
    } catch (e) {
      if (e.code !== 'ENOENT') {
        // eslint-disable-next-line no-console
        console.error('[RollingFileAppender] error accessing the log file', e);
      }

      this.currentFileTime = Date.now();
      this.currentFileSize = 0;
    }
  }

}

exports.RollingFileContext = RollingFileContext;