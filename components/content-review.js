const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class ContentReview extends D3Component {

  initialize(node, props) {
    const text = this.text = d3.select(node).append('text')
        .attr('dy', '.35em')
        .text('Select an answer')
        .style('visibility', 'hidden');
  }

  update(props) {
    if (props.correctanswer == props.givenanswer) {
        this.text
            .style('visibility', 'visible')
            .style('color', 'green')
            .text("Correct!");
    }
    else {
        this.text
            .style('visibility', 'visible')
            .style('color', 'red')
            .text("Incorrect, try again.");
    }
  }
}

module.exports = ContentReview;
