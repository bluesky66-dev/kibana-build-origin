"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileAppender = void 0;

var _configSchema = require("@kbn/config-schema");

var _fs = require("fs");

var _layouts = require("../../layouts/layouts");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Appender that formats all the `LogRecord` instances it receives and writes them to the specified file.
 * @internal
 */
class FileAppender {
  /**
   * Writable file stream to write formatted `LogRecord` to.
   */

  /**
   * Creates FileAppender instance with specified layout and file path.
   * @param layout Instance of `Layout` sub-class responsible for `LogRecord` formatting.
   * @param path Path to the file where log records should be stored.
   */
  constructor(layout, path) {
    this.layout = layout;
    this.path = path;

    _defineProperty(this, "outputStream", void 0);
  }
  /**
   * Formats specified `record` and writes them to the specified file.
   * @param record `LogRecord` instance to be logged.
   */


  append(record) {
    if (this.outputStream === undefined) {
      this.outputStream = (0, _fs.createWriteStream)(this.path, {
        encoding: 'utf8',
        flags: 'a'
      });
    }

    this.outputStream.write(`${this.layout.format(record)}\n`);
  }
  /**
   * Disposes `FileAppender`. Waits for the underlying file stream to be completely flushed and closed.
   */


  async dispose() {
    await new Promise(resolve => {
      if (this.outputStream === undefined) {
        return resolve();
      }

      this.outputStream.end(() => {
        this.outputStream = undefined;
        resolve();
      });
    });
  }

}

exports.FileAppender = FileAppender;

_defineProperty(FileAppender, "configSchema", _configSchema.schema.object({
  type: _configSchema.schema.literal('file'),
  layout: _layouts.Layouts.configSchema,
  fileName: _configSchema.schema.string()
}));