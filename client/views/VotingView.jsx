var React = require('react');
var VotingQuestionComponent = require('./../components/VotingQuestionComponent.jsx');
var VotingStore = require('../stores/VotingStore.js');
var ActionTypes = require('../Actions.js').ActionTypes;
var doAction = require('../Actions.js').doAction;

var VotingView = React.createClass({
  getInitialState: function() {
    return VotingStore.getData();
  },
  onChange: function() {
    this.setState(VotingStore.getData());
  },
  componentDidMount: function() {
    VotingStore.addListener(this.onChange);

    doAction(ActionTypes.VOTING_INIT, {
      meeting_token: this.props.params.meeting_token,
      person_token: this.props.params.person_token
    });
  },

  componentWillUnmount: function() {
    VotingStore.removeListener(this.onChange);
  },

  onNewAnswerSelected: function(question_index, answer_index) {
    doAction(ActionTypes.VOTING_NEW_ANSWER, {
      question_index: question_index,
      answer_index: answer_index
    });
  },

  onNewPointSelected: function(point_index) {
    doAction(ActionTypes.VOTING_NEW_POINT, {
      point_index: point_index
    });
  },

  render: function() {
    var point_options = this.state.rubic.point_scale.map(function(point) {
      return {
        name: point.toString(),
        hint: ''
      }
    });
    point_options.push({name: '?', hint: ''});
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body">
                {this.state.rubic.questions.map(function(question, index) {
                  return <VotingQuestionComponent
                    key={index}
                    question={question.text}
                    options={question.options}
                    activeIndex={this.state.status.answers[index]}
                    buttonClickedCallback={this.onNewAnswerSelected.bind(null, index)}
                  />;
                }.bind(this))}

                <VotingQuestionComponent
                  question="Overall, what will be your point estimate?"
                  options={point_options}
                  activeIndex={this.state.status.point_index}
                  buttonClickedCallback={this.onNewPointSelected}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = VotingView;