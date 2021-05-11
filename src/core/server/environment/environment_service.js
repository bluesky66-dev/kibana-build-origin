"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnvironmentService = void 0;

var _operators = require("rxjs/operators");

var _utils = require("@kbn/utils");

var _http = require("../http");

var _pid_config = require("./pid_config");

var _resolve_uuid = require("./resolve_uuid");

var _create_data_folder = require("./create_data_folder");

var _write_pid_file = require("./write_pid_file");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @internal */
class EnvironmentService {
  constructor(core) {
    _defineProperty(this, "log", void 0);

    _defineProperty(this, "configService", void 0);

    _defineProperty(this, "uuid", '');

    this.log = core.logger.get('environment');
    this.configService = core.configService;
  }

  async setup() {
    const [pathConfig, serverConfig, pidConfig] = await Promise.all([this.configService.atPath(_utils.config.path).pipe((0, _operators.take)(1)).toPromise(), this.configService.atPath(_http.config.path).pipe((0, _operators.take)(1)).toPromise(), this.configService.atPath(_pid_config.config.path).pipe((0, _operators.take)(1)).toPromise()]); // was present in the legacy `pid` file.

    process.on('unhandledRejection', reason => {
      this.log.warn(`Detected an unhandled Promise rejection.\n${reason}`);
    });
    await (0, _create_data_folder.createDataFolder)({
      pathConfig,
      logger: this.log
    });
    await (0, _write_pid_file.writePidFile)({
      pidConfig,
      logger: this.log
    });
    this.uuid = await (0, _resolve_uuid.resolveInstanceUuid)({
      pathConfig,
      serverConfig,
      logger: this.log
    });
    return {
      instanceUuid: this.uuid
    };
  }

}

exports.EnvironmentService = EnvironmentService;