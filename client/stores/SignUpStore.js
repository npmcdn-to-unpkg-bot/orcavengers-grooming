var EventClient = require("../EventClient.js");
var EventTypes = require("../../EventTypes.js");
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../Actions.js').ActionTypes;

var ChangedEvent = 'CHANGED';

var emitter = new EventEmitter();
var emitChange = emitter.emit.bind(emitter, ChangedEvent);

var storeData = {
  meetings: [],
  error: null,
  new_meeting_token: null,
  new_person_token: null,
  person_exist_data: null
};

var getData = function() {
  return storeData;
};

var init = function() {
  EventClient.emit(EventTypes.GET_MEETING_LIST)
    .then(function(data) {
      storeData.meetings = data;
      emitChange();
    });
};

var goToMeetingAsHost = function(meeting_token){
  window.location.href = '/meeting/' + meeting_token + '/voting_report';
};

var goToMeetingAsVoter = function(meeting_token, person_token){
  window.location.href = '/meeting/' + meeting_token + '/vote_as/' + person_token;
};

var actionHandler = function(action) {

  switch (action.type) {
  case ActionTypes.SIGN_UP_INIT:
    init();
    break;

  case ActionTypes.SIGN_UP_ADD_MEETING:
    EventClient.emit(EventTypes.CREATE_MEETING, action.data)
      .then(function(data) {
        storeData.new_meeting_token = data;
        goToMeetingAsHost(data);
        storeData.error = null;
        emitChange();
      })
      .catch(function(err) {
        storeData.error = err;
        emitChange();
      });
    break;

  case ActionTypes.SIGN_UP_ADD_PERSON:
    EventClient.emit(EventTypes.CREATE_PERSON, action.data)
    .then(function(data){
      if (data.exists){
        storeData.person_exist_data = data;
        emitChange();
      }else{
        goToMeetingAsVoter(data.meeting_token, data.person_token);
      }
    })
    .catch(function(err){
      storeData.error = err;
      emitChange();
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
  getData: getData,
  goToMeetingAsHost: goToMeetingAsHost,
  goToMeetingAsVoter: goToMeetingAsVoter
};