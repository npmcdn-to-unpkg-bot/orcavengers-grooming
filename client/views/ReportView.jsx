var React = require('react');
var ReportStore = require('../stores/ReportStore.js');
var ActionTypes = require('../Actions.js').ActionTypes;
var doAction = require('../Actions.js').doAction;
var QuestionReportComponent = require('../components/QuestionReportComponent.jsx');
var Cookies = require('cookies-js');

var ReportView = React.createClass({
  getInitialState: function() {
    return ReportStore.getData();
  },
  onChange: function() {
    this.setState(ReportStore.getData());
  },
  componentDidMount: function() {
    ReportStore.addListener(this.onChange);

    Cookies.set('meeting_token', this.props.params.meeting_token, {expires: 3600});
    doAction(ActionTypes.REPORT_INIT, {meeting_token: this.props.params.meeting_token});
  },
  componentDidUpdate: function() {
    var elem = document.querySelector('.grid');
    if (elem) {
      msnry = new Masonry(elem, {
        percentPosition: true,
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer'
      });
    }
  },

  componentWillUnmount: function() {
    ReportStore.removeListener(this.onChange);
  },

  onRevealClicked: function() {
    doAction(ActionTypes.REPORT_REVEAL);
  },

  onResetClicked: function() {
    doAction(ActionTypes.REPORT_RESET);
  },

  render: function() {
    var panel;
    if (!this.state.meeting_data) {
      return <div></div>;
    }
    var reveal_available = this.state.meeting_data.people.every(function(person) {
      return person.finished || (!person.online);
    });
    if (this.state.meeting_data.show_result) {
      panel = (
        <div>
          <a className="btn btn-lg btn-block btn-primary"
             onClick={this.onResetClicked}
          >Start Over</a>
          <div className="grid">
            <div className="grid-sizer"></div>
            <QuestionReportComponent
              question={{text: 'Point Estimate'}}
              answers={this.state.meeting_data.point_answers}
            />
            {this.state.meeting_data.report.map(function(question, index) {
              return <QuestionReportComponent
                key={index}
                question={question.question}
                answers={question.answers}
              />;
            })}
          </div>
        </div>
      );
    } else if (this.state.meeting_data.people.length <= 0) {
      panel =
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="panel panel-default">
                <div className="panel-body"><p>No one joined this meeting yet.</p></div>
              </div>
            </div>
          </div>
        </div>;
    } else {
      var thinking_people = this.state.meeting_data.people.filter(function(person) {
        return !person.finished && person.online;
      });
      panel = (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="panel panel-default">
                <div className="panel-body">
                  <a className={"btn btn-lg btn-primary btn-block"}
                     onClick={this.onRevealClicked}
                  >Show Result</a>
                  <div className="panel panel-default">
                    <div className={"panel-body" + (thinking_people.length > 10? ' split-2-column':'')}>
                      <p>People still thinking:</p>
                      <table className="table table-striped">
                        <tbody>
                        {thinking_people.map(function(person) {
                          return (
                            <tr key={person.name}>
                              <td>{person.name}</td>
                            </tr>
                          );
                        })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        {panel}
      </div>
    );
  }
});

module.exports = ReportView;
