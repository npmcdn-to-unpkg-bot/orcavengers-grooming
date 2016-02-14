var Rubic = require('./rubic.json');
var randomstring = require("randomstring");
var EventServer = require("./EventServer.js");
var EventTypes = require('../EventTypes.js');
var _ = require('lodash');

var host_token = 'host';
var meetings = {
  //'abcd': {
  //  name: 'test meeting 1'
  //}
};

var get_token = function() {
  return randomstring.generate({
    length: 6,
    readable: true,
    charset: 'alphabetic',
    capitalization: 'lowercase'
  });
};

var get_meeting_token = function() {
  var token = get_token();
  while (meetings.hasOwnProperty(token)) {
    token = get_token();
  }
  return token;
};

var get_people_token = function(meeting_token) {
  var token = get_token();
  while (meetings[meeting_token].people.hasOwnProperty(token)) {
    token = get_token();
  }
  return token;
};

var add_meeting = function(meeting_name) {
  if (!meeting_name) {
    throw new Error("The meeting name must not be empty");
  }
  if (_.find(meetings, function(meeting) {
      return meeting.name.toLowerCase() == meeting_name.toLowerCase();
    })) {
    throw new Error("There is already a meeting being hosted called " + meeting_name);
  }
  var token = get_meeting_token();
  meetings[token] = {
    name: meeting_name,
    people: {
      host: {
        sockets: []
      }
    },
    show_result: false,
    fresh: true
  };
  return token;
};

var add_people = function(meeting_token, person_name) {
  if (!person_name) {
    throw new Error("The name must not be empty");
  }
  for (var t in meetings[meeting_token].people) {
    if (meetings[meeting_token].people.hasOwnProperty(t) && meetings[meeting_token].people[t].name &&
      meetings[meeting_token].people[t].name.toLowerCase() == person_name.toLowerCase()) {
      return {
        meeting_token: meeting_token,
        person_token: t,
        name: meetings[meeting_token].people[t].name,
        exists: true
      };
    }
  }
  var token = get_people_token(meeting_token);
  meetings[meeting_token].people[token] = {
    name: person_name,
    answers: [],
    point_index: null,
    sockets: []
  };
  return {
    meeting_token: meeting_token,
    person_token: token,
    name: person_name,
    exists: false
  };
};

var list_meetings = function() {
  return _.map(meetings, function(meeting, token) {
    return {
      token: token,
      name: meeting.name
    };
  });
};

var cleanup_socket = function(sockets) {
  return sockets.filter(function(socket) {
    return socket.connected;
  });
};

var record_new_socket = function(person_info, socket) {
  person_info.sockets = cleanup_socket(person_info.sockets);
  if (person_info.sockets.indexOf(socket) === -1) {
    person_info.sockets.push(socket);
    return true;
  }
  return false;
};

var event_handler = function(event) {

  switch (event.type) {

  case EventTypes.SOCKET_CONNECT:
    EventServer.send(event.socket, EventTypes.DATA_CHANGED, null);
    break;

  case EventTypes.SOCKET_DISCONNECT:
    _.forEach(meetings, function(meeting) {
      _.forEach(meeting.people, function(person) {
        person.sockets = cleanup_socket(person.sockets);
      });
    });
    _.forEach(meetings, function(meeting, meeting_token) {
      if (meeting.people.host.sockets.length <= 0 && !meeting.fresh) {
        delete meetings[meeting_token];
      }
    });
    EventServer.broadcast(EventTypes.DATA_CHANGED);
    break;


  case EventTypes.GET_MEETING_LIST:
    event.callback(null, list_meetings());
    break;

  case EventTypes.CREATE_MEETING:
    try {
      var token = add_meeting(event.data.name);
      event.callback(null, token);
      EventServer.broadcast(EventTypes.DATA_CHANGED);
    } catch (err) {
      event.callback(err.message, null);
    }
    break;

  case EventTypes.CREATE_PERSON:
    try {
      var result = add_people(event.data.meeting_token, event.data.name);
      event.callback(null, result);
      EventServer.broadcast(EventTypes.DATA_CHANGED);
    } catch (err) {
      event.callback(err.message, null);
    }
    break;

  case EventTypes.GET_VOTING_STATUS:
    result = {};
    result.rubic = Rubic;
    if (meetings[event.data.meeting_token] && meetings[event.data.meeting_token].people[event.data.person_token]) {
      var person_info = meetings[event.data.meeting_token].people[event.data.person_token];
      var answers = Rubic.questions.map(function(__, index) {
        var answer = person_info.answers[index];
        return _.isNil(answer) ? null : answer;
      });
      result.status = {
        answers: answers,
        point_index: person_info.point_index
      };
      event.callback(null, result);
      if (record_new_socket(person_info, event.socket)) {
        EventServer.broadcast(EventTypes.DATA_CHANGED);
      }
    } else {
      event.callback(404, null);
    }
    break;

  case EventTypes.UPDATE_VOTING_ANSWER:
    if (meetings[event.data.meeting_token] && meetings[event.data.meeting_token].people[event.data.person_token]) {
      person_info = meetings[event.data.meeting_token].people[event.data.person_token];
      person_info.answers[event.data.question_index] = event.data.answer_index;
      event.callback(null, null);
      EventServer.broadcast(EventTypes.DATA_CHANGED);
    } else {
      event.callback(404, null);
    }
    break;

  case EventTypes.UPDATE_VOTING_POINT:
    if (meetings[event.data.meeting_token] && meetings[event.data.meeting_token].people[event.data.person_token]) {
      person_info = meetings[event.data.meeting_token].people[event.data.person_token];
      person_info.point_index = event.data.point_index;
      event.callback(null, null);
      EventServer.broadcast(EventTypes.DATA_CHANGED);
    } else {
      event.callback(404, null);
    }
    break;

  case EventTypes.GET_MEETING_DATA:
    result = {};
    var meeting = meetings[event.data.meeting_token];
    if (!meeting) {
      event.callback(404, null);
      break;
    }

    result.people = [];
    _.forEach(meeting.people, function(person_info, person_key) {
      person_info.sockets = cleanup_socket(person_info.sockets);
      if (person_key != host_token) {
        result.people.push({
          name: person_info.name,
          online: person_info.sockets.length > 0,
          finished: !_.isNil(person_info.point_index)
        });
      }
    });
    result.show_result = meeting.show_result;

    result.report = [];
    Rubic.questions.forEach(function(question, index) {
      var answers = [];
      _.forEach(meeting.people, function(person_info, person_key) {
        if (person_key != host_token && (!_.isNil(person_info.answers[index]))) {
          answers.push({
            name: person_info.name,
            answer: question.options[person_info.answers[index]].name
          });
        }
      });
      result.report.push({
        question: question,
        answers: answers
      });
    });
    result.point_answers = [];
    _.forEach(meeting.people, function(person_info, person_key) {
      if (person_key != host_token && (!_.isNil(person_info.point_index)) && person_info.point_index < Rubic.point_scale.length) {
        result.point_answers.push({
          name: person_info.name,
          answer: Rubic.point_scale[person_info.point_index]
        });
      }
    });
    event.callback(null, result);
    if (record_new_socket(meeting.people.host, event.socket)) {
      meeting.fresh = false;
      EventServer.broadcast(EventTypes.DATA_CHANGED);
    }
    break;

  case EventTypes.REVEAL_REPORT:
    meeting = meetings[event.data.meeting_token];
    if (!meeting) {
      event.callback(404, null);
      break;
    }

    meeting.show_result = true;
    EventServer.broadcast(EventTypes.DATA_CHANGED);
    break;

  case EventTypes.RESET:
    meeting = meetings[event.data.meeting_token];
    if (!meeting) {
      event.callback(404, null);
      break;
    }

    meeting.show_result = false;
    _.forEach(meeting.people, function(person_info, person_token) {
      if (person_token != host_token) {
        person_info.answers = [];
        person_info.point_index = null;
      }
    });
    EventServer.broadcast(EventTypes.DATA_CHANGED);
    break;

  }

};
var dispatcherToken = EventServer.register(event_handler);

module.exports = {
  dispatcherToken: dispatcherToken
};