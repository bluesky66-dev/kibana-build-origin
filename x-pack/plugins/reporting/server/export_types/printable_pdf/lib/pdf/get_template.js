"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplate = getTemplate;

var _i18n = require("@kbn/i18n");

var _path = _interopRequireDefault(require("path"));

var _get_doc_options = require("./get_doc_options");

var _get_font = require("./get_font");

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


function getTemplate(layout, logo, title, tableBorderWidth, assetPath) {
  const pageMarginTop = 40;
  const pageMarginBottom = 80;
  const pageMarginWidth = 40;
  const headingFontSize = 14;
  const headingMarginTop = 10;
  const headingMarginBottom = 5;
  const headingHeight = headingFontSize * 1.5 + headingMarginTop + headingMarginBottom;
  const subheadingFontSize = 12;
  const subheadingMarginTop = 0;
  const subheadingMarginBottom = 5;
  const subheadingHeight = subheadingFontSize * 1.5 + subheadingMarginTop + subheadingMarginBottom;

  const getStyle = () => ({
    heading: {
      alignment: 'left',
      fontSize: headingFontSize,
      bold: true,
      margin: [headingMarginTop, 0, headingMarginBottom, 0]
    },
    subheading: {
      alignment: 'left',
      fontSize: subheadingFontSize,
      italics: true,
      margin: [0, 0, subheadingMarginBottom, 20]
    },
    warning: {
      color: '#f39c12' // same as @brand-warning in Kibana colors.less

    }
  });

  const getHeader = () => ({
    margin: [pageMarginWidth, pageMarginTop / 4, pageMarginWidth, 0],
    text: title,
    font: (0, _get_font.getFont)(title),
    style: {
      color: '#aaa'
    },
    fontSize: 10,
    alignment: 'center'
  });

  const getFooter = () => (currentPage, pageCount) => {
    const logoPath = _path.default.resolve(assetPath, 'img', 'logo-grey.png'); // Default Elastic Logo


    return {
      margin: [pageMarginWidth, pageMarginBottom / 4, pageMarginWidth, 0],
      layout: _get_doc_options.REPORTING_TABLE_LAYOUT,
      table: {
        widths: [100, '*', 100],
        body: [[{
          fit: [100, 35],
          image: logo || logoPath
        }, {
          alignment: 'center',
          text: _i18n.i18n.translate('xpack.reporting.exportTypes.printablePdf.pagingDescription', {
            defaultMessage: 'Page {currentPage} of {pageCount}',
            values: {
              currentPage: currentPage.toString(),
              pageCount
            }
          }),
          style: {
            color: '#aaa'
          }
        }, ''], [logo ? {
          text: _i18n.i18n.translate('xpack.reporting.exportTypes.printablePdf.logoDescription', {
            defaultMessage: 'Powered by Elastic'
          }),
          fontSize: 10,
          style: {
            color: '#aaa'
          },
          margin: [0, 2, 0, 0]
        } : '', '', '']]
      }
    };
  };

  return {
    // define page size
    pageOrientation: layout.getPdfPageOrientation(),
    pageSize: layout.getPdfPageSize({
      pageMarginTop,
      pageMarginBottom,
      pageMarginWidth,
      tableBorderWidth,
      headingHeight,
      subheadingHeight
    }),
    pageMargins: layout.useReportingBranding ? [pageMarginWidth, pageMarginTop, pageMarginWidth, pageMarginBottom] : [0, 0, 0, 0],
    header: layout.hasHeader ? getHeader() : undefined,
    footer: layout.hasFooter ? getFooter() : undefined,
    styles: layout.useReportingBranding ? getStyle() : undefined,
    defaultStyle: {
      fontSize: 12,
      font: 'Roboto'
    }
  };
}