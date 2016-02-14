var React = require('react');

var RedirectView = React.createClass({
  componentDidMount: function(){
    setTimeout(function(){
      window.location.href = '/';
    }, 5000);
  },
  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="jumbotron">
              <p>The meeting you were in no longer exists, will redirect you to home page shortly.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RedirectView;