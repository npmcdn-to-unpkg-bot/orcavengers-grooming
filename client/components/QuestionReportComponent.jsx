var React = require('react');
var _ = require('lodash');

var QuestionReportComponent = React.createClass({
  getInitialState: function() {
    return {expanded: false};
  },
  onClick: function() {
    this.setState({expanded: !this.state.expanded})
  },
  componentDidUpdate: function() {
    msnry.layout();
  },
  render: function() {
    var legend;
    if (this.state.expanded) {
      legend = (
        <div>
          {this.props.question.options.map(function(option, index) {
            var selected = this.props.answers.reduce(function(prev, answer) {
              return prev + (answer.answer == option.name ? 1 : 0);
            }, 0);
            return (
              <div>
                <span key={index}>{option.name}: {selected}/{this.props.answers.length}</span>
                <div className="well well-sm">
                  <p>{option.hint}</p>
                </div>
              </div>
            );
          }.bind(this))}
        </div>
      );
    }
    return (
      <div className={"grid-item" + (this.state.expanded?' expanded':'')}>
        <div className="panel panel-primary grid-item-content" onClick={this.onClick}>
          <div className="panel-heading">{this.props.question.text}</div>
          <div className="panel-body">
            <table className="table table-striped">
              <tbody>
              {this.props.answers.map(function(answer) {
                return <tr key={answer.name}>
                  <td>{answer.name}</td>
                  <td>{answer.answer}</td>
                </tr>
              })}
              </tbody>
            </table>
            {legend}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = QuestionReportComponent;