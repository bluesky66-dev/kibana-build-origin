"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findNonExistentItems = findNonExistentItems;
exports.CMBeatsDomain = void 0;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _types = require("./types");

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

class CMBeatsDomain {
  constructor(adapter, libs) {
    this.adapter = adapter;

    _defineProperty(this, "tags", void 0);

    _defineProperty(this, "tokens", void 0);

    _defineProperty(this, "framework", void 0);

    this.adapter = adapter;
    this.tags = libs.tags;
    this.tokens = libs.tokens;
    this.framework = libs.framework;
  }

  async getById(user, beatId) {
    const beat = await this.adapter.get(user, beatId);
    return beat && beat.active ? beat : null;
  }

  async getByIds(user, beatIds) {
    const beats = await this.adapter.getWithIds(user, beatIds);
    return beats.filter(beat => beat.active);
  }

  async getAll(user, ESQuery) {
    return (await this.adapter.getAll(user, ESQuery)).filter(beat => beat.active === true);
  }

  async getAllWithTag(user, tagId) {
    return (await this.adapter.getAllWithTags(user, [tagId])).filter(beat => beat.active === true);
  }

  async getByEnrollmentToken(user, enrollmentToken) {
    const beat = await this.adapter.getBeatWithToken(user, enrollmentToken);
    return beat && beat.active ? beat : null;
  }

  async update(userOrToken, beatId, beatData) {
    const beat = await this.adapter.get(this.framework.internalUser, beatId); // FIXME make return type enum

    if (beat === null) {
      return 'beat-not-found';
    }

    if (typeof userOrToken === 'string') {
      var _beat$access_token;

      const {
        verified: isAccessTokenValid
      } = this.tokens.verifyToken((_beat$access_token = beat === null || beat === void 0 ? void 0 : beat.access_token) !== null && _beat$access_token !== void 0 ? _beat$access_token : '', userOrToken);

      if (!isAccessTokenValid) {
        return 'invalid-access-token';
      }
    }

    const user = typeof userOrToken === 'string' ? this.framework.internalUser : userOrToken;
    await this.adapter.update(user, { ...beat,
      ...beatData
    });
  }

  async enrollBeat(enrollmentToken, beatId, remoteAddress, beat) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      token,
      expires_on
    } = await this.tokens.getEnrollmentToken(enrollmentToken);

    if (expires_on && (0, _moment.default)(expires_on).isBefore((0, _moment.default)())) {
      return {
        status: _types.BeatEnrollmentStatus.ExpiredEnrollmentToken
      };
    }

    if (!token) {
      return {
        status: _types.BeatEnrollmentStatus.InvalidEnrollmentToken
      };
    }

    const existingBeat = await this.getById(this.framework.internalUser, beatId);

    if (existingBeat) {
      return {
        status: _types.BeatEnrollmentStatus.Success
      };
    }

    const accessToken = this.tokens.generateAccessToken();
    const verifiedOn = (0, _moment.default)().toJSON();
    await this.adapter.insert(this.framework.internalUser, {
      tags: [],
      ...beat,
      active: true,
      enrollment_token: enrollmentToken,
      verified_on: verifiedOn,
      access_token: accessToken,
      host_ip: remoteAddress,
      id: beatId
    });
    await this.tokens.deleteEnrollmentToken(enrollmentToken);
    return {
      status: _types.BeatEnrollmentStatus.Success,
      accessToken
    };
  }

  async removeTagsFromBeats(user, removals) {
    const beatIds = (0, _lodash.uniq)(removals.map(removal => removal.beatId));
    const tagIds = (0, _lodash.uniq)(removals.map(removal => removal.tag));
    const response = {
      removals: removals.map(() => ({
        status: null
      }))
    };
    const beats = await this.adapter.getWithIds(user, beatIds);
    const tags = await this.tags.getWithIds(user, tagIds); // Handle assignments containing non-existing beat IDs or tags

    const nonExistentBeatIds = findNonExistentItems(beats, beatIds);
    const nonExistentTags = await findNonExistentItems(tags, tagIds);
    addNonExistentItemToResponse(response, removals, nonExistentBeatIds, nonExistentTags, 'removals'); // FIXME abstract this

    const validRemovals = removals.map((removal, idxInRequest) => ({
      beatId: removal.beatId,
      idxInRequest,
      // so we can add the result of this removal to the correct place in the response
      tag: removal.tag
    })).filter((removal, idx) => response.removals[idx].status === null);

    if (validRemovals.length > 0) {
      const removalResults = await this.adapter.removeTagsFromBeats(user, validRemovals);
      return addToResultsToResponse('removals', response, removalResults);
    }

    return response;
  }

  async assignTagsToBeats(user, assignments) {
    const beatIds = (0, _lodash.uniq)(assignments.map(assignment => assignment.beatId));
    const tagIds = (0, _lodash.uniq)(assignments.map(assignment => assignment.tag));
    const response = {
      assignments: assignments.map(() => ({
        status: null
      }))
    };
    const beats = await this.adapter.getWithIds(user, beatIds);
    const tags = await this.tags.getWithIds(user, tagIds); // Handle assignments containing non-existing beat IDs or tags

    const nonExistentBeatIds = findNonExistentItems(beats, beatIds);
    const nonExistentTags = findNonExistentItems(tags, tagIds); // FIXME break out back into route / function response
    // FIXME causes function to error if a beat or tag does not exist

    addNonExistentItemToResponse(response, assignments, nonExistentBeatIds, nonExistentTags, 'assignments'); // FIXME abstract this

    const validAssignments = assignments.map((assignment, idxInRequest) => ({
      beatId: assignment.beatId,
      idxInRequest,
      // so we can add the result of this assignment to the correct place in the response
      tag: assignment.tag
    })).filter((assignment, idx) => response.assignments[idx].status === null);

    if (validAssignments.length > 0) {
      const assignmentResults = await this.adapter.assignTagsToBeats(user, validAssignments); // TODO This should prob not mutate

      return addToResultsToResponse('assignments', response, assignmentResults);
    }

    return response;
  }

} // FIXME abstract to the route, also the key arg is a temp fix


exports.CMBeatsDomain = CMBeatsDomain;

function addNonExistentItemToResponse(response, assignments, nonExistentBeatIds, nonExistentTags, key) {
  assignments.forEach(({
    beatId,
    tag
  }, idx) => {
    const isBeatNonExistent = nonExistentBeatIds.includes(beatId);
    const isTagNonExistent = nonExistentTags.includes(tag);

    if (isBeatNonExistent && isTagNonExistent) {
      response[key][idx].status = 404;
      response[key][idx].result = `Beat ${beatId} and tag ${tag} not found`;
    } else if (isBeatNonExistent) {
      response[key][idx].status = 404;
      response[key][idx].result = `Beat ${beatId} not found`;
    } else if (isTagNonExistent) {
      response[key][idx].status = 404;
      response[key][idx].result = `Tag ${tag} not found`;
    }
  });
} // TODO dont mutate response


function addToResultsToResponse(key, response, assignmentResults) {
  assignmentResults.forEach(assignmentResult => {
    const {
      idxInRequest,
      status,
      result
    } = assignmentResult;
    response[key][idxInRequest].status = status;
    response[key][idxInRequest].result = result;
  });
  return response;
}

function findNonExistentItems(items, requestedItems) {
  return requestedItems.reduce((nonExistentItems, requestedItem, idx) => {
    if (items.findIndex(item => item && item.id === requestedItem) === -1) {
      nonExistentItems.push(requestedItems[idx]);
    }

    return nonExistentItems;
  }, []);
}