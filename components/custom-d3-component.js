const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

class CustomD3Component extends D3Component {


  constructor(props) {
    super(props);

    this.state = {
      animation: 0,
      state: 2
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

    this.playGame = this.playGame.bind(this);
    this.startGame = this.startGame.bind(this);

    //this.gameLoop = this.gameLoop.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.rotate = this.rotate.bind(this);

    this.addSolution = this.addSolution.bind(this);
  }

  initialize(node, props) {
    console.log("initialized");

    const svg = this.svg = d3.select(node).append('svg').style('border-radius', '10px');

    /*svg.on("mouseover", function() { svg.style("background-color", 'blue'); })
      .on("mouseout", function(){ svg.style("background-color", 'lightblue'); }); */

    const g = svg.append('g').attr('id', 'g');



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
      .attr('id', 'redBloodCell')
      .attr('dy', '.35em')
      .style('fill', 'white')
      .style('font-size', '12pt')
      .text("Red Blood Cell");
    //.style('visibility', 'hidden');

    this.path = g.append('path');

    let that = this;

    // Game controls
    // Add start button
    const startbutton = g.append('rect')
      .attr('width', 370)
      .attr('height', 120)
      .attr('x', 15)
      .attr('y', 140)
      .attr('class', 'game game1')
      .style('rx', 5)
      .style('ry', 5)
      .style('cursor', 'pointer')
      .attr('stroke', 'black')
      .attr('fill', 'beige')
      .style('display', 'none')
      .on('click', function () { that.startGame(); })

    g.append('text')
      .attr('id', 'startButton')
      .attr('x', 130)
      .attr('y', 195)
      .attr('dy', '.5em')
      .style('font-size', '24pt')
      .style('pointer-events', 'none')
      .text('Play Game')
      .attr('class', 'game game1')
      .style('fill', 'blue')
      .style('display', 'none');

    // Game started
    g.append('text')
      .attr('id', 'score')
      .attr('x', 10)
      .attr('y', 30)
      .attr('dy', '.5em')
      .style('font-size', '24pt')
      .style('pointer-events', 'none')
      .text('Score: 0')
      .attr('class', 'game game2')
      .style('fill', 'green').style('display', 'none');

    g.append('text')
      .attr('id', 'time')
      .attr('x', 10)
      .attr('y', 80)
      .attr('dy', '.5em')
      .style('font-size', '24pt')
      .style('pointer-events', 'none')
      .text('Time: 20')
      .attr('class', 'game game2')
      .style('fill', 'black').style('display', 'none');

    // Solution buttons
    let xs = [15, 140, 265];
    let ys = [300, 300, 300];
    let ids = ['Hypotonic', 'Isotonic', 'Hypertonic']

    for (var i = 0; i < xs.length; i++) {
      let sol = ids[i];
      g.append('rect')
        .attr('width', 115)
        .attr('height', 80)
        .attr('x', xs[i])
        .attr('y', ys[i])
        .attr('class', 'game game3')
        .attr('id', ids[i])
        .style('rx', 5)
        .style('ry', 5)
        .style('disabled', 'disabled')
        .style('cursor', 'pointer')
        .attr('stroke', 'black')
        .attr('fill', 'beige')
        .style('display', 'none')
        .on('click', function () { that.addSolution(sol); })

      g.append('text')
        .attr('x', xs[i] + 5)
        .attr('y', ys[i] + 20)
        .attr('dy', '.5em')
        .style('font-size', '11pt')
        .style('pointer-events', 'none')
        .text('Add ' + ids[i])
        .attr('class', 'game game2')
        .style('fill', 'black').style('display', 'none');
    }

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

  playGame() {
    document.getElementById('redBloodCell').innerHTML = '';

    let qsa = document.querySelectorAll('.game');

    qsa.forEach(function (x) {
      x.style.display = 'block';
    });

  }

  startGame() {
    if (this.state.gameStarted == true) {
      return;
    }

    document.getElementById('score').innerHTML = 'Score: 0';

    let qsa = document.querySelectorAll('.game');

    qsa.forEach(function (x) {
      x.style.display = 'none';
    });

    let qsa2 = document.querySelectorAll('.game2');

    qsa2.forEach(function (x) {
      x.style.display = 'block';
    });

    qsa2 = document.querySelectorAll('.game3');

    qsa2.forEach(function (x) {
      x.style.display = 'block';
    });

    const that = this;

    let timerFunction = function () {
      that.setState({
        'time': that.state.time - 1
      });
      document.getElementById('time').innerHTML = 'Time: ' + that.state.time;
      if (that.state.time <= 0) {
        that.stopGame('You ran out of time!');
      }
    }

    this.setState({
      'gameStarted': true,
      'time': 20,
      'timeReset': 20,
      'timerFunction': setInterval(timerFunction, 1000),
      'gameScore': 0,
      'lives': 3,
      'state': 2
    });
    this.rotate(this.state.state);
  }


  addSolution(sol) {
    if (!this.state.gameStarted) {
      return;
    }
    console.log(sol);
    console.log('STATE: ' + this.state.state);
    switch (this.state.state) {
      case 1: // Requires hypertonic, blood cell is too large
        if (sol === 'Hypertonic') {
          this.rotate();
          console.log('GOOD');
        }
        else if (sol === 'Hypotonic') {
          this.stopGame('The blood cell burst!');
          console.log('FAIL');
          this.blob.attr('rx', 0)
            .attr('ry', 0);
        }
        break;
      case 2: // Requires hypotonic, blood cell is too small
        if (sol === 'Hypertonic') {
          this.stopGame('The blood cell shriveled up!');

          console.log('FAIL');
          this.blob.attr('rx', 10)
            .attr('ry', 5);
        }
        else if (sol === 'Hypotonic') {
          this.rotate();
          console.log('GOOD');
        }
        break;
      case 3: // Requires isotonic, blood cell is normal sized
        if (sol === 'Hypertonic') {
          this.rotate(2);
          console.log('Now need hypotonic');
        }
        else if (sol === 'Hypotonic') {
          this.rotate(1);
          console.log('Now need hypertonic')
        }
        else if (sol === 'Isotonic') {
          this.rotate();
          console.log('GOOD')
        }
        break;
    }
  }

  // Change the cell to large / small / medium
  rotate(n) {
    let current = this.state.state;

    let arr = [1, 2, 3];
    let ind = arr.indexOf(this.state.state);

    arr.splice(ind, 1);

    var nx = n;

    if (n === undefined) {

      let time = 20 - this.state.gameScore;
      let mintime = 8;
      if (this.state.gameScore > 30) {
        mintime = 7;
      }
      if (this.state.gameScore > 40) {
        mintime = 6;
      }
      if (this.state.gameScore > 50) {
        mintime = 5;
      }
      if (time < mintime) {
        time = mintime;
      }

      nx = arr[Math.floor(Math.random() * 2)];

      this.setState({
        'state': nx,
        'gameScore': this.state.gameScore + 1,
        'time': time
      });
      document.getElementById('time').innerHTML = 'Time: ' + this.state.time;
      document.getElementById('score').innerHTML = 'Score: ' + this.state.gameScore;
    } else {
      this.setState({
        'state': n
      });
      nx = n;
    }
    switch (nx) {
      case 1: // Requires hypertonic
        document.getElementById('redBloodCell').innerHTML = '&nbsp;&nbsp;Too large';
        this.blob.attr('rx', 140)
          .attr('ry', 100);
        break;
      case 2: // Requires hypotonic
        document.getElementById('redBloodCell').innerHTML = '&nbsp;&nbsp;Too small';
        this.blob.attr('rx', 55)
          .attr('ry', 20);
        break;
      case 3: // Requires isotonic
        document.getElementById('redBloodCell').innerHTML = '&nbsp;&nbsp;Just right';
        this.blob.attr('rx', 80)
          .attr('ry', 60);
        break;
    }
  }

  stopGame(message) {
    if (!message) {
      message = 'Game over!';
    }

    clearInterval(this.state.timerFunction);

    this.setState({
      'gameStarted': false,
      'time': 20,
      'timeReset': 20,
      'timerFunction': null,
      'gameScore': 0,
      'lives': 3,
      'state': 2
    });
    let qsa = document.querySelectorAll('.game1');
    document.getElementById('time').innerHTML = message;
    document.getElementById('startButton').innerHTML = 'Play Again';

    this.playGame();

    qsa.forEach(function (x) {
      x.style.display = 'block';
    });
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
    if (props.value == 3 || this.state.gameStarted == true) {
      // this is because for some reason it's setting the visualization to disappear when in between 2 different sections
      // 
      return;
    }
    if (props.value != 5) {
      document.getElementById('redBloodCell').innerHTML = 'Red Blood Cell';
      let qsa = document.querySelectorAll('.game');

      qsa.forEach(function (x) {
        x.style.display = 'none';
      });
    }
    if (props.value == 6) { // Quiz: hide the thing
      this.svg.style('visibility', 'hidden');
    } else {
      this.svg.style('visibility', 'visible');
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

    // Game view
    if (props.value == 5) {
      this.setExtracellularText('');
      this.setArrowsBackground('none.png');
      this.stopAnimation();
      this.playGame();
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