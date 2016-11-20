'use strict';

import * as d3Obj from 'd3';
import * as d3_selection from 'd3-selection';
import 'd3-selection-multi';
import voterDataTemplate from './voterData';
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
          d.clinton = parseInt(d.clinton);
          d.trump = parseInt(d.trump);
          d.others = parseInt(d.others);
          d.vep = parseInt(d.vep);
          d.votesCast = (d.clinton + d.trump + d.others);
          d.noVote = d.vep - d.votesCast;
          d.turnoutPct = (100 * d.votesCast / d.vep).toFixed(2);
          d.noVotePct = (100 * d.noVote / d.vep).toFixed(2);
          d.clintonPct = (100 * d.clinton / d.vep).toFixed(2);
          d.trumpPct = (100 * d.trump / d.vep).toFixed(2);
          d.othersPct = (100 * d.others / d.vep).toFixed(2);
          j.properties.data = d;
        }
      });
    });

    var turnoutScale = d3.scaleLinear()
      .domain(
        [
          d3.min(json.features.filter(j => j.properties.data).map(j => parseFloat(j.properties.data.noVotePct))),
          d3.max(json.features.filter(j => j.properties.data).map(j => parseFloat(j.properties.data.noVotePct)))
        ]
      )
      .range(['#333', '#eee']);

    var mapSvg = d3.select('#visualization svg#map')
      .attr('width', mapWidth)
      .attr('height', mapHeight)
    var g = mapSvg.append('g');

    var maps = {
      doMap: function(g, fn) {
        g.append('g').attr('class', 'statesMap')
          .selectAll('path')
          .data(json.features.filter(f => f.properties.data))
          .enter()
          .append('path')
          .attr('d', path)
          .style('stroke', '#fff')
          .style('stroke-width', '1')
          .style('fill', fn)
          .on('mouseover', stateMouseover)
          .on('mouseout', stateMouseout)
          .on('click', stateClick);
      },

      electoralMap: function(g) {
        this.doMap(g, d => {
          return parseInt(d.properties.data.clinton) <= parseInt(d.properties.data.trump) ? '#900' : '#009';
        });
      },
      pluralityMap: function(g) {
        this.doMap(g, d => {
          let pluralityData = d.properties.data;
          let pluralities = [
            { title: 'clinton', total: pluralityData.clinton, color: '#009' },
            { title: 'trump', total: pluralityData.trump, color: '#900' },
            { title: 'noVote', total: pluralityData.noVote, color: '#999' },
          ];
          pluralities.sort((a, b) => {
            return b.total - a.total;
          });
          return pluralities[0].color;
        });
      },
      turnoutMap: function(g) {
        this.doMap(g, d => {
          return turnoutScale(d.properties.data.noVotePct)
        });
      }
    };

    maps.pluralityMap(g);
    d3.select('ul#mapChoices')
      .append('li')
      .append('a')
      .attr('href', '#')
      .text('Electoral college')
      .on('click', d => { maps.electoralMap(g) })
    d3.select('ul#mapChoices')
      .append('li')
      .append('a')
      .attr('href', '#')
      .text('Turnout')
      .on('click', d => { maps.turnoutMap(g) })
    d3.select('ul#mapChoices')
      .append('li')
      .append('a')
      .attr('href', '#')
      .text('Larget plurality (including non-voters)')
      .on('click', d => { maps.pluralityMap(g) })
  });
});



function stateMouseover(d, i) {
  tooltipDiv.transition()
    .duration(200)
    .style('opacity', '1.0');
  tooltipDiv.html(`${d.properties.data.abbr} [${d.properties.data.ecv}, ${d.properties.data.turnoutPct}%]`)
    .style('left', d3Obj.event.pageX + 'px')
    .style('top', d3Obj.event.pageY + 'px');
}

function stateMouseout(d, i) {
  tooltipDiv.transition()
    .duration(500)
    .style('opacity', 0);
}

function stateClick(d, i) {
  var dataDiv = d3.select('div#voterData')
    .style('display', 'block')
    .style('width', mapWidth + 'px')
    .html(voterDataTemplate(d.properties.data));

  var arc = d3.arc()
    .outerRadius(100)
    .innerRadius(0);
  var labelArc = d3.arc()
    .outerRadius(60)
    .innerRadius(60);
  var pie = d3.pie()
    .sort(null)
    .value(function(pd) { return (pd.pct); });

  var svg = d3.select('svg#pieChart')
    .style('width', 250)
    .style('height', 250)
    .append('g')
    .attr('transform', 'translate(125, 125)');

  var g = svg.selectAll('.arc')
    .data(pie(pcts(d.properties.data)))
    .enter()
    .append('g')
    .attr('class', 'arc');

  g.append('path')
    .attr('d', arc)
    .style('fill', d => { return d.data.color })

  g.append('text')
    .attr('transform', d => 'translate(' + labelArc.centroid(d) + ')')
    .attr('dy', '.2em')
    .attr('fill', 'white')
    .style('text-anchor', 'middle')
    .text(d => d.data.pct + '%');

  function pcts(data) {
    return [
      {
        color: '#999',
        title: 'No vote',
        total: data.noVote,
        pct: data.noVotePct
      },
      {
        color: '#009',
        title: 'Clinton',
        total: data.clinton,
        pct: data.clintonPct
      },
      {
        color: '#900',
        title: 'Trump',
        total: data.trump,
        pct: data.trumpPct
      },
      {
        color: '#090',
        title: 'Others',
        total: data.others,
        pct: data.othersPct
      },
    ];
  }
}





