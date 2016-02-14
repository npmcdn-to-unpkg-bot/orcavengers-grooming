var React = require('react');
var MeetingSelectionComponent = require('./../components/MeetingSelectionComponent.jsx');
var SignUpStore = require('../stores/SignUpStore.js');
var ActionTypes = require('../Actions.js').ActionTypes;
var doAction = require('../Actions.js').doAction;

var HostSignUpView = React.createClass({
  getInitialState: function() {
    return SignUpStore.getData();
  },
  handleMeetingSelection: function(meeting_token) {
    SignUpStore.goToMeetingAsHost(meeting_token);
  },
  onChange: function() {
    this.setState(SignUpStore.getData());
  },
  componentDidMount: function() {
    SignUpStore.addListener(this.onChange);

    doAction(ActionTypes.SIGN_UP_INIT);
  },

  componentWillUnmount: function() {
    SignUpStore.removeListener(this.onChange);
  },

  onMeetingNameChange: function(event) {
    this.setState({
      new_meeting_name: event.target.value
    });
  },

  onCreateMeeting: function() {
    doAction(ActionTypes.SIGN_UP_ADD_MEETING, {name: this.state.new_meeting_name});
  },

  render: function() {
    var choose;
    if (this.state.meetings && this.state.meetings.length > 0) {
      choose = (
        <MeetingSelectionComponent
          label="Or choose from one of existing meetings"
          meetingSelectionCallback={this.handleMeetingSelection}
          meetings={this.state.meetings}
        />
      );
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body">
                <div className={'form-group' + (this.state.error ? ' has-error' : '')}>
                  <label htmlFor="name">Start a new meeting</label>
                  <input type="text" className="form-control" id="name"
                         placeholder="Orcavengers Secret Grooming" value={this.state.new_meeting_name}
                         onChange={this.onMeetingNameChange}
                  />
                  <span className="help-block">{this.state.error}</span>
                </div>
                <button className="btn btn-primary btn-lg" onClick={this.onCreateMeeting}>Create</button>
                {choose}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = HostSignUpView;