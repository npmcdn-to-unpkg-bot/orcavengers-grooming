var React = require('react');
var Link = require('react-router').Link;

var WelcomeView = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="jumbotron">
              <p>Welcome to the meeting</p>
              <div className="well">
                <Link className="btn btn-primary btn-lg btn-block" to="/signup/host" role="button">I am Host</Link>
                <Link className="btn btn-primary btn-lg btn-block" to="/signup/voter" role="button">I am Voter</Link>
              </div>
              <div className="well">
                <h2>http://groom.herokuapp.com</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = WelcomeView