var EventClient = require("../EventClient.js");
var EventTypes = require("../../EventTypes.js");
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../Actions.js').ActionTypes;

var ChangedEvent = 'CHANGED';

var emitter = new EventEmitter();
var emitChange = emitter.emit.bind(emitter, ChangedEvent);

var storeData = {
  meeting_data: null,
  meeting_token: null
};

var getData = function() {
  return storeData;
};

var init = function() {
  if (!storeData.meeting_token) {
    return;
  }
  EventClient.emit(EventTypes.GET_MEETING_DATA, {
      meeting_token: storeData.meeting_token
    })
    .then(function(data) {
      storeData.meeting_data = data;
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
  case ActionTypes.REPORT_INIT:
    storeData.meeting_token = action.data.meeting_token;
    init();
    break;

  case ActionTypes.REPORT_REVEAL:
    EventClient.emit(EventTypes.REVEAL_REPORT, {
        meeting_token: storeData.meeting_token
      })
      .catch(function(err) {
        if (err == 404) {
          window.location.href = '/redirect';
        }
      });
    break;

  case ActionTypes.REPORT_RESET:
    EventClient.emit(EventTypes.RESET, {
        meeting_token: storeData.meeting_token
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