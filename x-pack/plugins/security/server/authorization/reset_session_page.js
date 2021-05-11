"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResetSessionPage = ResetSessionPage;

var _react = _interopRequireDefault(require("react"));

var _button = require("@elastic/eui/lib/components/button");

var _page = require("@elastic/eui/lib/components/page");

var _empty_prompt = require("@elastic/eui/lib/components/empty_prompt");

var _icon = require("@elastic/eui/lib/components/icon/icon");

var _alert = require("@elastic/eui/lib/components/icon/assets/alert");

var _react2 = require("@kbn/i18n/react");

var _i18n = require("@kbn/i18n");

var _fonts = require("../../../../../src/core/server/rendering/views/fonts");

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
// @ts-expect-error no definitions in component folder
// @ts-expect-error no definitions in component folder
// @ts-expect-error no definitions in component folder
// @ts-expect-error no definitions in component folder
// @ts-expect-error no definitions in component folder
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// Preload the alert icon used by `EuiEmptyPrompt` to ensure that it's loaded
// in advance the first time this page is rendered server-side. If not, the
// icon svg wouldn't contain any paths the first time the page was rendered.


(0, _icon.appendIconComponentCache)({
  alert: _alert.icon
});

function ResetSessionPage({
  logoutUrl,
  styleSheetPaths,
  basePath
}) {
  const uiPublicUrl = `${basePath}/ui`;
  return /*#__PURE__*/_react.default.createElement("html", {
    lang: _i18n.i18n.getLocale()
  }, /*#__PURE__*/_react.default.createElement("head", null, styleSheetPaths.map(path => /*#__PURE__*/_react.default.createElement("link", {
    href: path,
    rel: "stylesheet",
    key: path
  })), /*#__PURE__*/_react.default.createElement(_fonts.Fonts, {
    url: uiPublicUrl
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "alternate icon",
    type: "image/png",
    href: `${uiPublicUrl}/favicons/favicon.png`
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "icon",
    type: "image/svg+xml",
    href: `${uiPublicUrl}/favicons/favicon.svg`
  }), /*#__PURE__*/_react.default.createElement("meta", {
    name: "theme-color",
    content: "#ffffff"
  }), /*#__PURE__*/_react.default.createElement("meta", {
    name: "color-scheme",
    content: "light dark"
  })), /*#__PURE__*/_react.default.createElement("body", null, /*#__PURE__*/_react.default.createElement(_react2.I18nProvider, null, /*#__PURE__*/_react.default.createElement(_page.EuiPage, {
    paddingSize: "none",
    style: {
      minHeight: '100vh'
    }
  }, /*#__PURE__*/_react.default.createElement(_page.EuiPageBody, null, /*#__PURE__*/_react.default.createElement(_page.EuiPageContent, {
    verticalPosition: "center",
    horizontalPosition: "center"
  }, /*#__PURE__*/_react.default.createElement(_empty_prompt.EuiEmptyPrompt, {
    iconType: "alert",
    iconColor: "danger",
    title: /*#__PURE__*/_react.default.createElement("h2", null, /*#__PURE__*/_react.default.createElement(_react2.FormattedMessage, {
      id: "xpack.security.resetSession.title",
      defaultMessage: "You do not have permission to access the requested page"
    })),
    body: /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement(_react2.FormattedMessage, {
      id: "xpack.security.resetSession.description",
      defaultMessage: "Either go back to the previous page or log in as a different user."
    })),
    actions: [/*#__PURE__*/_react.default.createElement(_button.EuiButton, {
      color: "primary",
      fill: true,
      href: logoutUrl,
      "data-test-subj": "ResetSessionButton"
    }, /*#__PURE__*/_react.default.createElement(_react2.FormattedMessage, {
      id: "xpack.security.resetSession.logOutButtonLabel",
      defaultMessage: "Log in as different user"
    })), /*#__PURE__*/_react.default.createElement(_button.EuiButtonEmpty, {
      id: "goBackButton"
    }, /*#__PURE__*/_react.default.createElement(_react2.FormattedMessage, {
      id: "xpack.security.resetSession.goBackButtonLabel",
      defaultMessage: "Go back"
    }))]
  })))))));
}