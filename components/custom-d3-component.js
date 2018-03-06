const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');


class CustomD3Component extends D3Component {


  constructor(props) {
    super(props);

    this.state = {
      'animation': 0 // isotonic = 0, hypertonic = 2, hypotonic = 1, stopanimation = 3
    };

    this.shootHyper = this.shootHyper.bind(this);
    this.shootHypo = this.shootHypo.bind(this);
    this.shootBits = this.shootBits.bind(this);
    this.pulse = this.pulse.bind(this);
    this.update = this.update.bind(this);
    this.disappear = this.disappear.bind(this);
    this.shootBitsHyper = this.shootBitsHyper.bind(this);
    this.stopAnimation = this.stopAnimation.bind(this);
  }

  initialize(node, props) {
    console.log("initialized");
    // const svg = this.svg = d3.select(node).append('svg');
    // svg.attr('viewBox', `0 0 ${size} ${size}`)
    //     .style('width', '100%')
    //     .style('height', 'auto');

    // svg.append('circle')
    //     .attr('r', 20)
    //     .attr('cx', Math.random() * size)
    //     .attr('cy', Math.random() * size);

    const svg = this.svg = d3.select(node).append('svg');

    this.blob = svg.append('ellipse')
      .attr('cx', 200)
      .attr('cy', 200)
      .style('fill', 'red')
      .style('stroke', 'darkred')
      .style('stroke-width', '3')
      .attr('rx', 80)
      .attr('ry', 55);

    this.path = svg.append('path');

    this.bits;
  }

  pulse() {
    console.log("pulse");
    this.blob
      .transition().duration(800)
      .attr('rx', '50')
      .attr('ry', '35')
      .transition().duration(300)
      .attr('rx', '70')
      .attr('ry', '45')
      .on('end', this.pulse);
  }

  shootBitsHyper(x, y, target) {
    let blobX = Math.random(400);
    let blobY = target;

    if (this.blob.attr('rx') > 30 && this.blob.attr('ry') > 30) {
      let dot = this.svg.append('circle')
        .attr('cy', y)
        .attr('cx', x)
        .style('fill', 'blue')
        .attr('r', 7)
        .attr('fill-opacity', '1');

      // Above/below the blob direction
      const higher = dot.attr('cy') < blobY;

      let xSlope = parseInt((blobX - dot.attr('cx')) / 50);
      let ySlope = parseInt((target - dot.attr('cy')) / 50);

      var newrx = parseInt(this.blob.attr('rx')) - 1;
      var newry = parseInt(this.blob.attr('ry')) - 2;

      if (newrx < 8) {
        newrx = 8;
      }
      if (newry < 4) {
        newry = 4;
      }

      // Path
      let path = setInterval(() => {
        let cx = parseInt(dot.attr('cx'));
        let cy = parseInt(dot.attr('cy'));

        let newcx = cx + xSlope;
        let newcy = cy + ySlope;
        dot
          .attr('cx', newcx)
          .attr('cy', newcy);
        if (higher) {
          if (parseInt(dot.attr('cy')) > parseInt(blobY) - 20) {
            this.disappear(dot, - 4);
            clearInterval(path);
          }
        } else {
          if (parseInt(dot.attr('cy')) < parseInt(blobY) + 20) {
            this.disappear(dot, -4);
            clearInterval(path);
          }
        }
      }, 40);

      var shootCount = 0;
    }
  }

  shootBits(x, y) {

    let blobX = parseInt(this.blob.attr('cx')) + -5 + Math.random() * 5;
    let blobY = parseInt(this.blob.attr('cy')) + -5 + Math.random() * 5;
    if (this.blob.attr('rx') < 172 && this.blob.attr('ry') < 147) {
      let dot = this.svg.append('circle')
        .attr('cy', 10 + y)
        .attr('cx', 10 + x)
        .style('fill', 'blue')
        .attr('r', 7)
        .attr('fill-opacity', '1');

      // Above/below the blob
      const higher = dot.attr('cy') < blobY;

      let xSlope = parseInt((blobX - dot.attr('cx')) / 50);
      let ySlope = parseInt((blobY - dot.attr('cy')) / 50);

      // Path
      let path = setInterval(() => {
        let cx = parseInt(dot.attr('cx'));
        let cy = parseInt(dot.attr('cy'));
        dot
          .attr('cx', cx + xSlope)
          .attr('cy', cy + ySlope);
        if (higher) {
          if (parseInt(dot.attr('cy')) > parseInt(blobY) - 20) {
            this.disappear(dot, 4);
            clearInterval(path);
          }
        } else {
          if (parseInt(dot.attr('cy')) < parseInt(blobY) + 20) {
            this.disappear(dot, 4);
            clearInterval(path);
          }
        }
      }, 40);
      this.shootCount = 0;
    }
  }

  // Disappear bean
  disappear(dot, valueChange) {
    let bean = setInterval(() => {
      if (dot.attr('fill-opacity') > 0) {
        dot.attr('fill-opacity', dot.attr('fill-opacity') - 0.01);
      } else {
        dot.remove();
        clearInterval(bean);
        this.shootCount++;
        console.log(this.blob.attr('rx'));
        console.log(this.blob.attr('ry'));
        this.blob.attr('rx', parseInt(this.blob.attr('rx')) + valueChange)
          .attr('ry', parseInt(this.blob.attr('ry')) + valueChange);
      }
    }, 10
    );
  }

  shootHypo() {
    for (var i = 0; i < 3; i++) {
      let x = 80 + (80 * i) - 20 + (Math.random() * 40);
      this.shootBits(x, 0 - 20 + (Math.random() * 40));
      this.shootBits(x, 380 + (Math.random() * 40));
    }
  }

  shootHyper() {
    for (var i = 0; i < 1; i++) {
      let x = 180 + Math.random(40);
      let y = 180 + Math.random(40);
      this.shootBitsHyper(x, y, 0);
      this.shootBitsHyper(x, y - 10 + Math.random(20), 400);
    }
  }

  stopAnimation() {
    this.svg.selectAll('circle').remove();
    clearInterval(this.shoot);
    this.blob.attr('rx', 80)
          .attr('ry', 55);
  }

  // Hypotonic: entering circle
  // Hypertonic: leaving circle

  update(props) {
    if (props.value == 1) {
      this.stopAnimation();
      this.shootHypo();
      this.shoot = setInterval(this.shootHypo, 4000);
    }
    if (props.value == 2) {
      this.stopAnimation();
      this.shootHyper();
      this.shoot = setInterval(this.shootHyper, 4000);
    }
    if (props.value == 3) {
      this.stopAnimation();
    }
  }

}



module.exports = CustomD3Component;