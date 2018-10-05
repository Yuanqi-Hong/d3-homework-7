import * as d3 from 'd3'

// I'll give you margins/height/width
let margin = { top: 100, left: 50, right: 50, bottom: 30 }
let height = 500 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

// And grabbing your container
let container = d3.select('#chart-4')

// Create your scales
let xPositionScale = d3.scaleLinear().range([0, width])
let yPositionScale = d3.scaleLinear().range([height, 0])

let labels = ['Extremely Cold', 'Cold', 'Normal', 'Hot', 'Extremely Hot']
let labelPositionScale = d3
  .scalePoint()
  .domain(labels)
  .range([0, width])

// Create your line/area generator
// ref: https://bl.ocks.org/mbostock/3035090
let line = d3
  .line()
  .defined(d => d)
  .x(d => xPositionScale(d.diff))
  .y(d => yPositionScale(d.freq))
let area = d3
  .area()
  .defined(line.defined())
  .x(line.x())
  .y1(line.y())
  .y0(yPositionScale(0))

// Read in your data, then call ready
d3.tsv(require('./climate-data.tsv'))
  .then(ready)
  .catch(err => console.log(err))

// Write your ready function
function ready(datapoints) {
  for (let i = 0; i < datapoints.length; i++) {
    if (+datapoints[i].year <= 1980) {
      datapoints[i].period = '1951 to 1980'
    } else if (+datapoints[i].year <= 1993) {
      datapoints[i].period = '1983 to 1993'
    } else if (+datapoints[i].year <= 2004) {
      datapoints[i].period = '1994 to 2004'
    } else if (+datapoints[i].year <= 2015) {
      datapoints[i].period = '2005 to 2015'
    }
  }

  let diffs = datapoints.map(d => +d.diff)
  xPositionScale.domain(d3.extent(diffs))

  // get the range of diffs for coloring purpose
  // console.log('extent of diffs looks like', d3.extent(diffs))

  let freqs = datapoints.map(d => +d.freq)
  yPositionScale.domain(d3.extent(freqs))

  let nested = d3
    .nest()
    .key(d => d.period)
    .entries(datapoints)

  container
    .selectAll('.temp-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'temp-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .each(function(d) {
      let svg = d3.select(this)

      // extremely cold
      svg
        .append('path')
        .datum(d.values.filter(d => d.diff <= -3.6))
        .attr('d', area)
        .attr('fill', '#234A9F')
        .attr('opacity', 0.5)

      // cold
      svg
        .append('path')
        .datum(d.values.filter(d => d.diff >= -3.6 && d.diff <= -1.2))
        .attr('d', area)
        .attr('fill', '#00ACEA')
        .attr('opacity', 0.5)

      // normal
      svg
        .append('path')
        .datum(d.values.filter(d => d.diff >= -1.2 && d.diff <= 1.2))
        .attr('d', area)
        .attr('fill', '#5F676B')
        .attr('opacity', 0.5)

      // hot
      svg
        .append('path')
        .datum(d.values.filter(d => d.diff >= 1.2 && d.diff <= 3.6))
        .attr('d', area)
        .attr('fill', '#EA5627')
        .attr('opacity', 0.5)

      // extremely hot
      svg
        .append('path')
        .datum(d.values.filter(d => d.diff >= 3.6))
        .attr('d', area)
        .attr('fill', '#ED1C24')
        .attr('opacity', 0.5)

      // base
      svg
        .append('path')
        .attr('id', 'base-path')
        .datum(datapoints.filter(d => d.period == '1951 to 1980'))
        .attr('d', area)
        .attr('fill', 'lightgray')
        .attr('opacity', 0.7)
        .lower()

      // x axis labels
      labels.forEach(d => {
        svg
          .append('text')
          .attr('id', d)
          .text(d)
          .style('font-size', '10px')
          .attr('x', labelPositionScale(d))
          .attr('y', height)
          .attr('dy', 15)
          .attr('text-anchor', 'middle')
      })

      // add grids
      let xAxis = d3.axisBottom(xPositionScale).tickValues([-3.6, -1.2, 1.2, 3.6]).tickFormat('')
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis.tickSize(-height))

      // adjust the labels' dx
      svg.select("text[id='Extremely Cold']").attr('dx', 10)
    })

  container.select('#base-path').remove()
}
