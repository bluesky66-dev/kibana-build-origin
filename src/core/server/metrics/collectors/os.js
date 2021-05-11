"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OsMetricsCollector = void 0;

var _os = _interopRequireDefault(require("os"));

var _getos = _interopRequireDefault(require("getos"));

var _util = require("util");

var _cgroup = require("./cgroup");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const getos = (0, _util.promisify)(_getos.default);

class OsMetricsCollector {
  constructor(options) {
    _defineProperty(this, "cgroupCollector", void 0);

    this.cgroupCollector = new _cgroup.OsCgroupMetricsCollector({ ...options,
      logger: options.logger.get('cgroup')
    });
  }

  async collect() {
    const platform = _os.default.platform();

    const load = _os.default.loadavg();

    const metrics = {
      platform,
      platformRelease: `${platform}-${_os.default.release()}`,
      load: {
        '1m': load[0],
        '5m': load[1],
        '15m': load[2]
      },
      memory: {
        total_in_bytes: _os.default.totalmem(),
        free_in_bytes: _os.default.freemem(),
        used_in_bytes: _os.default.totalmem() - _os.default.freemem()
      },
      uptime_in_millis: _os.default.uptime() * 1000,
      ...(await this.getDistroStats(platform)),
      ...(await this.cgroupCollector.collect())
    };
    return metrics;
  }

  reset() {}

  async getDistroStats(platform) {
    if (platform === 'linux') {
      try {
        const distro = await getos();
        return {
          distro: distro.dist,
          distroRelease: `${distro.dist}-${distro.release}`
        };
      } catch (e) {// ignore errors
      }
    }

    return {};
  }

}

exports.OsMetricsCollector = OsMetricsCollector;