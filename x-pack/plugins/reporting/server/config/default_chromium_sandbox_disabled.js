"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultChromiumSandboxDisabled = getDefaultChromiumSandboxDisabled;

var _getos = _interopRequireDefault(require("getos"));

var _util = require("util");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getos = (0, _util.promisify)(_getos.default);

const distroSupportsUnprivilegedUsernamespaces = distro => {
  // Debian 7 and 8 don't support usernamespaces by default
  // this should be reevaluated when Debian 9 is available
  if (distro.toLowerCase() === 'debian') {
    return false;
  } // Starting at CentOS 7.2 usernamespaces are in the kernel
  // but they must be explicitly enabled. This should be reevaluated
  // once CentOS 7.5+ is available


  if (distro.toLowerCase() === 'centos') {
    return false;
  } // Tested on OracleLinux 7.4 (which returns 'red hat linux' for distro) and sandboxing failed.


  if (distro.toLowerCase() === 'red hat linux') {
    return false;
  }

  return true;
};

async function getDefaultChromiumSandboxDisabled() {
  const os = await getos();

  if (os.os === 'linux' && !distroSupportsUnprivilegedUsernamespaces(os.dist)) {
    return {
      os,
      disableSandbox: true
    };
  } else {
    return {
      os,
      disableSandbox: false
    };
  }
}