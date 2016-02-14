var React = require('react');

var MeetingSelectionComponent = React.createClass({
  render: function() {
    var self = this;
    var select;
    if (self.props.meetings && self.props.meetings.length > 0) {
      select = (
          <div className="form-group">
            <label>{self.props.label}</label>
            <div className="well">
              {self.props.meetings.map(function(meeting) {
                return <a
                  key={meeting.token}
                  onClick={self.props.meetingSelectionCallback.bind(null, meeting.token)}
                  className="btn btn-default btn-lg btn-block"
                  role="button"
                >{meeting.name}</a>;
              })}
            </div>
          </div>
      );
    } else {
      select = (
        <p>There no meetings being hosted at the moment</p>
      );
    }
    return (
      <div>{select}</div>
    );
  }
});

module.exports = MeetingSelectionComponent;