"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PdfMaker = void 0;

var _i18n = require("@kbn/i18n");

var _concatStream = _interopRequireDefault(require("concat-stream"));

var _lodash = _interopRequireDefault(require("lodash"));

var _path = _interopRequireDefault(require("path"));

var _pdfmake = _interopRequireDefault(require("pdfmake"));

var _get_doc_options = require("./get_doc_options");

var _get_font = require("./get_font");

var _get_template = require("./get_template");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const assetPath = _path.default.resolve(__dirname, '..', '..', '..', 'common', 'assets');

const tableBorderWidth = 1;

class PdfMaker {
  constructor(layout, logo) {
    _defineProperty(this, "_layout", void 0);

    _defineProperty(this, "_logo", void 0);

    _defineProperty(this, "_title", void 0);

    _defineProperty(this, "_content", void 0);

    _defineProperty(this, "_printer", void 0);

    _defineProperty(this, "_pdfDoc", void 0);

    const fontPath = filename => _path.default.resolve(assetPath, 'fonts', filename);

    const fonts = {
      Roboto: {
        normal: fontPath('roboto/Roboto-Regular.ttf'),
        bold: fontPath('roboto/Roboto-Medium.ttf'),
        italics: fontPath('roboto/Roboto-Italic.ttf'),
        bolditalics: fontPath('roboto/Roboto-Italic.ttf')
      },
      'noto-cjk': {
        // Roboto does not support CJK characters, so we'll fall back on this font if we detect them.
        normal: fontPath('noto/NotoSansCJKtc-Regular.ttf'),
        bold: fontPath('noto/NotoSansCJKtc-Medium.ttf'),
        italics: fontPath('noto/NotoSansCJKtc-Regular.ttf'),
        bolditalics: fontPath('noto/NotoSansCJKtc-Medium.ttf')
      }
    };
    this._layout = layout;
    this._logo = logo;
    this._title = '';
    this._content = [];
    this._printer = new _pdfmake.default(fonts);
  }

  _addContents(contents) {
    const groupCount = this._content.length; // inject a page break for every 2 groups on the page

    if (groupCount > 0 && groupCount % this._layout.groupCount === 0) {
      contents = [{
        text: '',
        pageBreak: 'after'
      }].concat(contents);
    }

    this._content.push(contents);
  }

  addBrandedImage(img, {
    title = '',
    description = ''
  }) {
    const contents = [];

    if (title && title.length > 0) {
      contents.push({
        text: title,
        style: 'heading',
        font: (0, _get_font.getFont)(title),
        noWrap: true
      });
    }

    if (description && description.length > 0) {
      contents.push({
        text: description,
        style: 'subheading',
        font: (0, _get_font.getFont)(description),
        noWrap: true
      });
    }

    const wrappedImg = {
      table: {
        body: [[img]]
      },
      layout: _get_doc_options.REPORTING_TABLE_LAYOUT
    };
    contents.push(wrappedImg);

    this._addContents(contents);
  }

  addImage(base64EncodedData, opts = {
    title: '',
    description: ''
  }) {
    const size = this._layout.getPdfImageSize();

    const img = {
      image: `data:image/png;base64,${base64EncodedData}`,
      alignment: 'center',
      height: size.height,
      width: size.width
    };

    if (this._layout.useReportingBranding) {
      return this.addBrandedImage(img, opts);
    }

    this._addContents([img]);
  }

  setTitle(title) {
    this._title = title;
  }

  generate() {
    const docTemplate = _lodash.default.assign((0, _get_template.getTemplate)(this._layout, this._logo, this._title, tableBorderWidth, assetPath), {
      content: this._content
    });

    this._pdfDoc = this._printer.createPdfKitDocument(docTemplate, (0, _get_doc_options.getDocOptions)(tableBorderWidth));
    return this;
  }

  getBuffer() {
    return new Promise((resolve, reject) => {
      if (!this._pdfDoc) {
        throw new Error(_i18n.i18n.translate('xpack.reporting.exportTypes.printablePdf.documentStreamIsNotgeneratedErrorMessage', {
          defaultMessage: 'Document stream has not been generated'
        }));
      }

      const concatStream = (0, _concatStream.default)(function (pdfBuffer) {
        resolve(pdfBuffer);
      });

      this._pdfDoc.on('error', reject);

      this._pdfDoc.pipe(concatStream);

      this._pdfDoc.end();
    });
  }

}

exports.PdfMaker = PdfMaker;