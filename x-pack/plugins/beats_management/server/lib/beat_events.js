"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BeatEventsLib = void 0;

var _PathReporter = require("io-ts/lib/PathReporter");

var _Either = require("fp-ts/lib/Either");

var _domain_types = require("../../common/domain_types");

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

class BeatEventsLib {
  constructor(beats) {
    this.beats = beats;

    _defineProperty(this, "log", async (user, beatId, events) => {
      return events.map((event, i) => {
        const assertData = _domain_types.RuntimeBeatEvent.decode(event);

        if ((0, _Either.isLeft)(assertData)) {
          if (events.length - 1 === i) {
            this.beats.update(user, beatId, {
              status: { ...events[events.length - 2],
                timestamp: new Date(events[events.length - 2].timestamp)
              }
            }).catch(e => {
              // eslint-disable-next-line
              console.error('Error inserting event into beats log.', e);
            });
          }

          return {
            success: false,
            error: `Error parsing event ${i}, ${_PathReporter.PathReporter.report(assertData)[0]}`
          };
        }

        if (events.length - 1 === i) {
          this.beats.update(user, beatId, {
            status: { ...events[events.length - 1],
              timestamp: new Date(events[events.length - 1].timestamp)
            }
          }).catch(e => {
            // eslint-disable-next-line
            console.error('Error inserting event into beats log.', e);
          });
        }

        return {
          success: true
        };
      });
    });
  }

}

exports.BeatEventsLib = BeatEventsLib;