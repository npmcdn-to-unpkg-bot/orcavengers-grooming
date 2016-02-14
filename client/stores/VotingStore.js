var EventClient = require("../EventClient.js");
var EventTypes = require("../../EventTypes.js");
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../Actions.js').ActionTypes;

var ChangedEvent = 'CHANGED';

var emitter = new EventEmitter();
var emitChange = emitter.emit.bind(emitter, ChangedEvent);

var storeData = {
  meeting_token: null,
  person_token: null,
  rubic: {
    questions: [],
    point_scale: []
  },
  status: {
    point_index: null
  }
};

var getData = function() {
  return storeData;
};

var init = function() {
  if (!(storeData.meeting_token && storeData.person_token)){
    return;
  }
  EventClient.emit(EventTypes.GET_VOTING_STATUS, {
      meeting_token: storeData.meeting_token,
      person_token: storeData.person_token
    })
    .then(function(data) {
      Object.assign(storeData, data);
      emitChange();
    })
    .catch(function(err) {
      if (err == 404) {
        window.location.href = '/redirect';
      }
    });
};

var actionHandler = function(action) {

  switch (action.type) {
  case ActionTypes.VOTING_INIT:
    storeData.meeting_token = action.data.meeting_token;
    storeData.person_token = action.data.person_token;
    init();
    break;

  case ActionTypes.VOTING_NEW_ANSWER:
    EventClient.emit(EventTypes.UPDATE_VOTING_ANSWER, {
        meeting_token: storeData.meeting_token,
        person_token: storeData.person_token,
        question_index: action.data.question_index,
        answer_index: action.data.answer_index
      })
      .catch(function(err) {
        if (err == 404) {
          window.location.href = '/redirect';
        }
      });
    break;

  case ActionTypes.VOTING_NEW_POINT:
    EventClient.emit(EventTypes.UPDATE_VOTING_POINT, {
        meeting_token: storeData.meeting_token,
        person_token: storeData.person_token,
        point_index: action.data.point_index
      })
      .catch(function(err) {
        if (err == 404) {
          window.location.href = '/redirect';
        }
      });
    break;

  case EventTypes.DATA_CHANGED:
    init();
    break;

  }

};

module.exports = {
  addListener: emitter.addListener.bind(emitter, ChangedEvent),
  removeListener: emitter.removeListener.bind(emitter, ChangedEvent),
  dispatcherToken: EventClient.register(actionHandler),
  getData: getData
};