"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OsCgroupMetricsCollector = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OsCgroupMetricsCollector {
  /**  Used to prevent unnecessary file reads on systems not using cgroups. */
  constructor(options) {
    this.options = options;

    _defineProperty(this, "noCgroupPresent", false);

    _defineProperty(this, "cpuPath", void 0);

    _defineProperty(this, "cpuAcctPath", void 0);
  }

  async collect() {
    try {
      if (this.noCgroupPresent) {
        return {};
      }

      await this.initializePaths();

      if (!this.cpuAcctPath || !this.cpuPath) {
        return {};
      }

      const [cpuAcctUsage, cpuFsPeriod, cpuFsQuota, cpuStat] = await Promise.all([readCPUAcctUsage(this.cpuAcctPath), readCPUFsPeriod(this.cpuPath), readCPUFsQuota(this.cpuPath), readCPUStat(this.cpuPath)]);
      return {
        cpuacct: {
          control_group: this.cpuAcctPath,
          usage_nanos: cpuAcctUsage
        },
        cpu: {
          control_group: this.cpuPath,
          cfs_period_micros: cpuFsPeriod,
          cfs_quota_micros: cpuFsQuota,
          stat: cpuStat
        }
      };
    } catch (err) {
      this.noCgroupPresent = true;

      if (err.code !== 'ENOENT') {
        this.options.logger.error(`cgroup metrics could not be read due to error: [${err.toString()}]`);
      }

      return {};
    }
  }

  reset() {}

  async initializePaths() {
    // Perform this setup lazily on the first collect call and then memoize the results.
    // Makes the assumption this data doesn't change while the process is running.
    if (this.cpuPath && this.cpuAcctPath) {
      return;
    } // Only read the file if both options are undefined.


    if (!this.options.cpuPath || !this.options.cpuAcctPath) {
      const cgroups = await readControlGroups();
      this.cpuPath = this.options.cpuPath || cgroups[GROUP_CPU];
      this.cpuAcctPath = this.options.cpuAcctPath || cgroups[GROUP_CPUACCT];
    } else {
      this.cpuPath = this.options.cpuPath;
      this.cpuAcctPath = this.options.cpuAcctPath;
    } // prevents undefined cgroup paths


    if (!this.cpuPath || !this.cpuAcctPath) {
      this.noCgroupPresent = true;
    }
  }

}

exports.OsCgroupMetricsCollector = OsCgroupMetricsCollector;
const CONTROL_GROUP_RE = new RegExp('\\d+:([^:]+):(/.*)');
const CONTROLLER_SEPARATOR_RE = ',';
const PROC_SELF_CGROUP_FILE = '/proc/self/cgroup';
const PROC_CGROUP_CPU_DIR = '/sys/fs/cgroup/cpu';
const PROC_CGROUP_CPUACCT_DIR = '/sys/fs/cgroup/cpuacct';
const GROUP_CPUACCT = 'cpuacct';
const CPUACCT_USAGE_FILE = 'cpuacct.usage';
const GROUP_CPU = 'cpu';
const CPU_FS_PERIOD_US_FILE = 'cpu.cfs_period_us';
const CPU_FS_QUOTA_US_FILE = 'cpu.cfs_quota_us';
const CPU_STATS_FILE = 'cpu.stat';

async function readControlGroups() {
  const data = await _fs.default.promises.readFile(PROC_SELF_CGROUP_FILE);
  return data.toString().split(/\n/).reduce((acc, line) => {
    const matches = line.match(CONTROL_GROUP_RE);

    if (matches !== null) {
      const controllers = matches[1].split(CONTROLLER_SEPARATOR_RE);
      controllers.forEach(controller => {
        acc[controller] = matches[2];
      });
    }

    return acc;
  }, {});
}

async function fileContentsToInteger(path) {
  const data = await _fs.default.promises.readFile(path);
  return parseInt(data.toString(), 10);
}

function readCPUAcctUsage(controlGroup) {
  return fileContentsToInteger((0, _path.join)(PROC_CGROUP_CPUACCT_DIR, controlGroup, CPUACCT_USAGE_FILE));
}

function readCPUFsPeriod(controlGroup) {
  return fileContentsToInteger((0, _path.join)(PROC_CGROUP_CPU_DIR, controlGroup, CPU_FS_PERIOD_US_FILE));
}

function readCPUFsQuota(controlGroup) {
  return fileContentsToInteger((0, _path.join)(PROC_CGROUP_CPU_DIR, controlGroup, CPU_FS_QUOTA_US_FILE));
}

async function readCPUStat(controlGroup) {
  const stat = {
    number_of_elapsed_periods: -1,
    number_of_times_throttled: -1,
    time_throttled_nanos: -1
  };

  try {
    const data = await _fs.default.promises.readFile((0, _path.join)(PROC_CGROUP_CPU_DIR, controlGroup, CPU_STATS_FILE));
    return data.toString().split(/\n/).reduce((acc, line) => {
      const fields = line.split(/\s+/);

      switch (fields[0]) {
        case 'nr_periods':
          acc.number_of_elapsed_periods = parseInt(fields[1], 10);
          break;

        case 'nr_throttled':
          acc.number_of_times_throttled = parseInt(fields[1], 10);
          break;

        case 'throttled_time':
          acc.time_throttled_nanos = parseInt(fields[1], 10);
          break;
      }

      return acc;
    }, stat);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return stat;
    }

    throw err;
  }
}