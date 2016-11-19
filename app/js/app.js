'use strict';

import * as d3Obj from 'd3';
import * as d3_selection from 'd3-selection';
import 'd3-selection-multi';
var d3 = Object.assign({}, d3Obj);

var mapWidth = 800,
    mapHeight = 2.0 * (mapWidth / 3.0);



var projection = d3.geoAlbersUsa()
  .translate([Math.floor(mapWidth/2), Math.floor(mapHeight/2)])
  .scale([mapWidth * 1.3]);

var path = d3.geoPath().projection(projection);

var tooltipDiv = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

var voterData = d3.select('div#voterData');

d3.json('/data/us-states.json', function(json) {
  d3.csv('/data/2016Results.csv', function(err, data) {

    data.forEach(d => {
      json.features.forEach(j => {
        if (d.state == j.properties.name) {
          j.properties.data = d;
        }
      });
    });

    var mapSvg = d3.select('#visualization svg#map')
      .attr('width', mapWidth)
      .attr('height', mapHeight)
      .style('border', '1px solid #aaa');
    var g = mapSvg.append('g');

    g.append('g').attr('class', 'statesMap')
      .selectAll('path')
	    .data(json.features.filter(f => f.properties.data))
	    .enter()
	    .append('path')
	    .attr('d', path)
	    .style('stroke', '#fff')
	    .style('stroke-width', '1')
	    .style('fill', (d, i) => {
        return parseInt(d.properties.data.clinton) <= parseInt(d.properties.data.trump) ? '#900' : '#009';
      })
      .on('mouseover', stateMouseover)
      .on('mouseout', stateMouseout)
      .on('click', stateClick);

  });
});



function stateMouseover(d, i) {
  console.log(d3Obj.event.pageX, d3Obj.event.pageY);
  tooltipDiv.transition()
    .duration(200)
    .style('opacity', '1.0');
  tooltipDiv.html(`${d.properties.data.abbr} [${d.properties.data.ecv}]`)
    .style('left', d3Obj.event.pageX + 'px')
    .style('top', d3Obj.event.pageY + 'px');
}

function stateMouseout(d, i) {
  // console.log('mouseout', d, i);
  tooltipDiv.transition()
    .duration(500)
    .style('opacity', 0);
}

function stateClick(d, i) {
  console.log('click', d, i);
}





