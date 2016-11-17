'use strict';

import * as d3Obj from 'd3';
import * as d3_selection from 'd3-selection';
import 'd3-selection-multi';
var d3 = Object.assign({}, d3Obj);

console.log(d3);

var svg = d3.select('#visualization svg');
svg.append('circle')
  .attrs({
    'r': 40,
    'cx': 100,
    'cy': 100
  })
  .style('fill', 'purple');
