const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');


class CustomD3Component extends D3Component {


  constructor(props) {
    super(props);

    this.state = {
      animation: 0
    }

    // Main: Hyper / Hypo / Iso
    this.shootHyper = this.shootHyper.bind(this);
    this.shootHypo = this.shootHypo.bind(this);
    this.shootIso = this.shootIso.bind(this);

    // Bits: Hyper / Hypo / Iso
    this.shootBits = this.shootBits.bind(this);
    this.shootBitsHyper = this.shootBitsHyper.bind(this);
    this.shootBitsIso = this.shootBitsIso.bind(this);

    this.update = this.update.bind(this);
    this.disappear = this.disappear.bind(this);
    this.stopAnimation = this.stopAnimation.bind(this);

    this.setExtracellularText = this.setExtracellularText.bind(this);
    this.bloodSizeChange = this.bloodSizeChange.bind(this);
    this.setArrowsBackground = this.setArrowsBackground.bind(this);
  }

  initialize(node, props) {
    console.log("initialized");

    const svg = this.svg = d3.select(node).append('svg').style('border-radius', '10px');

    /*svg.on("mouseover", function() { svg.style("background-color", 'blue'); })
      .on("mouseout", function(){ svg.style("background-color", 'lightblue'); }); */

    const g = svg.append('g');



    const backrect = g.append('rect')
      .attr('width', 400)
      .attr('height', 400)
      .attr('fill', 'lightblue');
    //.on("mouseover", function() { extracellular.style('visibility', 'visible'); } )
    //.on("mouseout", function(){ extracellular.style('visibility', 'visible');} );//hidden

    const extracellular = g.append('text')
      .attr('id', 'extracellular')
      .attr('x', 15)
      .attr('y', 375)
      .attr('dy', '.5em')
      .style('font-size', '24pt')
      .text("Extracellular Fluid")
      .style('fill', 'blue');
    //.style('visibility', 'hidden');

    this.blob = g.append('ellipse')
      .attr('cx', 200)
      .attr('cy', 200)
      .style('fill', 'darkred')
      .style('stroke', 'red')
      .style('stroke-width', '3')
      .attr('rx', 80)
      .attr('ry', 55)
    //.on("mouseover", function() { bloodcell.style('visibility', 'visible'); } )
    //.on("mouseout", function(){ bloodcell.style('visibility', 'visible');} );//hidden

    const img = g.append('svg:image')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 400)
      .attr('height', 400)
      .attr('id', 'arrows')
      .attr('href', 'components/img/none.png');

    const bloodcell = g.append('text')
      .attr('x', 147)
      .attr('y', 200)
      .attr('dy', '.35em')
      .style('fill', 'white')
      .style('font-size', '12pt')
      .text("Red Blood Cell");
    //.style('visibility', 'hidden');

    this.path = g.append('path');

    this.bits;
  }

  setExtracellularText(text) {
    document.getElementById('extracellular').innerHTML = text;
  }

  setArrowsBackground(img) {
    document.getElementById('arrows').setAttribute("href", "components/img/" + img);
  }

  // Hypertonic beans
  shootBitsHyper(x, y, targetX, targetY, sizeChange) {
    let blobX = Math.random(400);
    let blobY = targetY;

    if (this.blob.attr('rx') > 30 && this.blob.attr('ry') > 30) {
      let dot = this.svg.append('circle')
        .attr('cy', y)
        .attr('cx', x)
        .style('fill', 'red')
        .attr('r', 7)
        .attr('fill-opacity', '1');

      // Above/below the blob direction
      const higher = dot.attr('cy') < blobY;

      let xSlope = parseInt((targetX - dot.attr('cx')) / 50);
      let ySlope = parseInt((targetY - dot.attr('cy')) / 50);

      var newrx = parseInt(this.blob.attr('rx')) - 1;
      var newry = parseInt(this.blob.attr('ry')) - 2;

      if (newrx < 8) {
        newrx = 8;
      }
      if (newry < 6) {
        newry = 6;
      }

      if (this.state.animation == 2 && sizeChange == true) {
        this.bloodSizeChange(-7);
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
            this.disappear(dot, -2);
            clearInterval(path);
          }
        } else {
          if (parseInt(dot.attr('cy')) < parseInt(blobY) + 20) {
            this.disappear(dot, -2);
            clearInterval(path);
          }
        }
      }, 40);

      var shootCount = 0;
    }
  }

  // Hypotonic shoot
  shootBits(x, y) {

    let blobX = 7 + parseInt(this.blob.attr('cx')) + Math.random() * 5;
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

  shootBitsIso(x, y) {

  }


  // Disappear bean
  disappear(dot, valueChange) {
    let bean = setInterval(() => {
      if (dot.attr('fill-opacity') > 0) {
        dot.attr('fill-opacity', dot.attr('fill-opacity') - 0.01);
      } else {
        dot.remove();
        clearInterval(bean);

        if (this.state.animation == 1 && valueChange > 0) {//|| 
          //(this.state.animation == 2 && valueChange < 0)) {
          this.bloodSizeChange(valueChange);
        }
      }
    }, 10
    );
  }

  // Size down
  bloodSizeChange(valueChange) {
    this.blob.attr('rx', parseInt(this.blob.attr('rx')) + valueChange)
      .attr('ry', parseInt(this.blob.attr('ry')) + valueChange);
  }

  // Main Animations

  // Blood cell grows bigger
  shootHypo() {
    for (var i = 0; i < 3; i++) {
      let x = 80 + (80 * i) - 5 + (Math.random() * 10);
      this.shootBits(x, 0 - 5 + (Math.random() * 10));
      this.shootBits(x, 380 + (Math.random() * 10));
    }
  }

  // Blood cell gets smaller
  shootHyper() {
    let sizechange = true; // Only reduce size once, instead of 6 times
    for (var i = 0; i < 2; i++) {
      let x = 180 + Math.random(40);
      let y = 180 + Math.random(40);

      let targetX = 0;

      if (i == 1) {
        targetX = 400;
        x += 20;
      }
      this.shootBitsHyper(x, y - 10 + Math.random(20), targetX, 0, sizechange);
      sizechange = false;
      this.shootBitsHyper(x, y - 10 + Math.random(20), targetX, 200, sizechange);
      this.shootBitsHyper(x, y - 10 + Math.random(20), targetX, 400, sizechange);
    }
  }

  // Blood cell size doesn't change, but dots go back and forth
  shootIso() {
    this.shootHypo();
    this.shootHyper();
  }

  stopAnimation() {
    this.svg.selectAll('circle').remove();
    clearInterval(this.shoot);
    this.blob.attr('rx', 80)
      .attr('ry', 55)
      .attr('cx', 200)
      .attr('cy', 200);
  }

  // Hypotonic: entering circle
  // Hypertonic: leaving circle
  update(props) {
    if (props.value == 3) {
      // this is because for some reason it's setting the visualization to disappear when in between 2 different sections
      // 
      return;
    }

    this.setState({ animation: props.value });
    // Isotonic
    if (props.value == 0) {
      this.setExtracellularText('3. <tspan fill="grey">Iso</tspan>tonic Solution');
      this.setArrowsBackground('isotonic.png');
      this.stopAnimation();
      this.shootIso();
      this.shoot = setInterval(this.shootIso, 4000);
    }
    // Hypotonic
    if (props.value == 1) {
      this.setExtracellularText('1. <tspan fill="green">Hypo</tspan>tonic Solution');
      this.setArrowsBackground('hypotonic.png');
      this.stopAnimation();
      this.shootHypo();
      this.shoot = setInterval(this.shootHypo, 4000);
    }
    // Hypertonic
    if (props.value == 2) {
      this.setExtracellularText('2. <tspan fill="red">Hyper</tspan>tonic Solution');
      this.setArrowsBackground('hypertonic.png');
      this.stopAnimation();
      this.shootHyper();
      this.shoot = setInterval(this.shootHyper, 4000);
    }

    // Original view
    if (props.value == 4) {
      this.setExtracellularText('Extracellular Fluid');
      this.setArrowsBackground('none.png');
      this.stopAnimation();
    }



    // Stopped
    if (props.value == 3) {
      //this.setExtracellularText('');
      //this.svg.style('visibility', 'hidden');
      //this.stopAnimation();
    }
    if (props.value < 3) {
      //this.svg.style('visibility', 'visible');
    }
  }

}



module.exports = CustomD3Component;