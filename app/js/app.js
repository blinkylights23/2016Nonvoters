'use strict';

import * as d3Obj from 'd3';
import * as d3_selection from 'd3-selection';
import 'd3-selection-multi';
var d3 = Object.assign({}, d3Obj);

console.log(d3);


d3.csv('/data/2016Results.csv', function(err, data) {
  var ecvScale = d3.scaleLinear()
    .domain([3, 55])
    .range([10, 50]);

  var svg = d3.select('#visualization svg');
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attrs({
      r: d => ecvScale(d.ecv)/2,
      cx: (d, i) => 120 + ((i % 10) * 120),
      cy: (d, i) => 100 + (Math.floor(i/10) * 100),
      fill: (d, i) => { return parseInt(d.clinton) <= parseInt(d.trump) ? 'red' : 'blue'; }
    });
  svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attrs({
      x: (d, i) => 120 + ((i % 10) * 120),
      y: (d, i) => 135 + (Math.floor(i/10) * 100),
      'text-anchor': 'middle',
      'font-family': 'sans-serif',
      fill: 'black'
    })
    .text(d => `${d.abbr}(${d.ecv})`);
});
