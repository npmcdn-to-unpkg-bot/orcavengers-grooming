var React = require('react');
var Cookies = require('cookies-js');

var RallySpyView = React.createClass({
  componentDidMount: function() {
    window.location.href = '/meeting/' + Cookies.get('meeting_token') + '/voting_report';
  },
  render: function() {
    return (
      <div>
      </div>
    );
  }
});

module.exports = RallySpyView;