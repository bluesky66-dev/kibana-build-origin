"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollingFileManager = void 0;

var _fs = require("fs");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Delegate of the {@link RollingFileAppender} used to manage the log file access
 */
class RollingFileManager {
  constructor(context) {
    this.context = context;

    _defineProperty(this, "filePath", void 0);

    _defineProperty(this, "outputStream", void 0);

    this.filePath = context.filePath;
  }

  write(chunk) {
    const stream = this.ensureStreamOpen();
    this.context.currentFileSize += Buffer.byteLength(chunk, 'utf8');
    stream.write(chunk);
  }

  async closeStream() {
    return new Promise(resolve => {
      if (this.outputStream === undefined) {
        return resolve();
      }

      this.outputStream.end(() => {
        this.outputStream = undefined;
        resolve();
      });
    });
  }

  ensureStreamOpen() {
    if (this.outputStream === undefined) {
      this.outputStream = (0, _fs.createWriteStream)(this.filePath, {
        encoding: 'utf8',
        flags: 'a'
      }); // refresh the file meta in case it was not initialized yet.

      this.context.refreshFileInfo();
    }

    return this.outputStream;
  }

}

exports.RollingFileManager = RollingFileManager;