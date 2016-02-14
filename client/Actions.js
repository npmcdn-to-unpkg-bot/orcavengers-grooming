var EventClient = require('./EventClient.js');
module.exports = {
  ActionTypes: {
    SIGN_UP_INIT:'SIGN_UP_INIT',
    SIGN_UP_ADD_MEETING: 'SIGN_UP_ADD_MEETING',
    SIGN_UP_ADD_PERSON: 'SIGN_UP_ADD_PERSON',

    VOTING_INIT:'VOTING_INIT',
    VOTING_NEW_ANSWER: 'VOTING_NEW_ANSWER',
    VOTING_NEW_POINT: 'VOTING_NEW_POINT',

    REPORT_INIT:'REPORT_INIT',
    REPORT_REVEAL:'REPORT_REVEAL',
    REPORT_RESET:'REPORT_RESET'
  },
  doAction: function(type, data){
    EventClient.dispatch({
      type: type,
      data: data
    });
  }
};
