var React = require('react');
var _ = require('lodash');

var VotingQuestionComponent = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <label>{this.props.question}</label>
        <div className="btn-group btn-group-justified" role="group">
          {this.props.options.map(function(option, index) {
            return <a key={index}
                      type="button"
                      className={'btn btn-default radio-btn' + (this.props.activeIndex == index?' active':'')}
                      onClick={this.props.buttonClickedCallback.bind(null, index)}
            >{option.name}</a>;
          }.bind(this))}
        </div>
        <span
          className="help-block">{_.isNil(this.props.activeIndex) ? '' : this.props.options[this.props.activeIndex].hint}</span>
      </div>
    );
  }
});

module.exports = VotingQuestionComponent;