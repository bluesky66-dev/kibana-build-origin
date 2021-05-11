"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormDataProvider = void 0;

var _react = _interopRequireDefault(require("react"));

var _hooks = require("../hooks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const FormDataProviderComp = function ({
  children,
  pathsToWatch
}) {
  const {
    0: formData,
    2: isReady
  } = (0, _hooks.useFormData)({
    watch: pathsToWatch
  });

  if (!isReady) {
    // No field has mounted yet, don't render anything
    return null;
  }

  return children(formData);
};

const FormDataProvider = /*#__PURE__*/_react.default.memo(FormDataProviderComp);

exports.FormDataProvider = FormDataProvider;