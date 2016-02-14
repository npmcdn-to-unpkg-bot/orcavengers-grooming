var React = require('react');
var ReactDOM = require('react-dom');
var WelcomeView = require('./views/WelcomeView.jsx');
var EventClient = require('./EventClient.js');
var VoterSignupView = require('./views/VoterSignupView.jsx');
var HostSignupView = require('./views/HostSignupView.jsx');
var VotingView = require('./views/VotingView.jsx');
var RedirectView = require('./views/RedirectView.jsx');
var ReportView = require('./views/ReportView.jsx');

var Router = require('react-router').Router;
var Route = require('react-router').Route;
var browserHistory = require('react-router').browserHistory;

require('./index.less');

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={WelcomeView} />
    <Route path="/redirect" component={RedirectView} />
    <Route path="/signup/voter" component={VoterSignupView} />
    <Route path="/signup/host" component={HostSignupView} />
    <Route path="/meeting/:meeting_token/vote_as/:person_token" component={VotingView} />
    <Route path="/meeting/:meeting_token/voting_report" component={ReportView} />
  </Router>
), document.getElementById('app'));