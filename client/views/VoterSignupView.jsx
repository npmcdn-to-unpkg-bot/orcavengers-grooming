var React = require('react');
var SignUpStore = require('../stores/SignUpStore.js');
var ActionTypes = require('../Actions.js').ActionTypes;
var doAction = require('../Actions.js').doAction;
var MeetingSelectionComponent = require('./../components/MeetingSelectionComponent.jsx');

var VoterSignUpView = React.createClass({
  getInitialState: function() {
    return SignUpStore.getData();
  },
  handleMeetingSelection: function(meeting_token) {
    doAction(ActionTypes.SIGN_UP_ADD_PERSON, {
      meeting_token: meeting_token,
      name: this.state.new_person_name
    });
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

  onNameInputChange: function(event) {
    this.setState({
      new_person_name: event.target.value
    });
  },

  existsYesHandler: function(){
    SignUpStore.goToMeetingAsVoter(this.state.person_exist_data.meeting_token, this.state.person_exist_data.person_token);
  },

  existsNoHandler: function(){
    window.location.reload();
  },

  render: function() {
    var panel_body;
    if (!this.state.person_exist_data){
      panel_body = (
        <div className="panel-body">
          <div className={'form-group' + (this.state.error ? ' has-error' : '')}>
            <label htmlFor="name">Input your name</label>
            <input type="text" className="form-control" id="name" placeholder="Joe"
                   value={this.state.new_person_name}
                   onChange={this.onNameInputChange}/>
            <span className="help-block">{this.state.error}</span>
          </div>
          <MeetingSelectionComponent
            label="Then select the meeting you want to join"
            meetingSelectionCallback={this.handleMeetingSelection}
            meetings={this.state.meetings}
          />
        </div>
      );
    }else{
      panel_body=(
        <div className="panel-body">
          <p>There's already a {this.state.person_exist_data.name} in this meeting, do you want to join as this person?</p>
          <button className="btn btn-primary btn-lg btn-block" onClick={this.existsYesHandler}>Yes</button>
          <button className="btn btn-primary btn-lg btn-block" onClick={this.existsNoHandler}>No</button>
        </div>
      );
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="panel panel-default">
              {panel_body}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = VoterSignUpView;