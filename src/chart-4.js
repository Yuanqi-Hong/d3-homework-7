import * as d3 from 'd3'

// I'll give you margins/height/width
let margin = { top: 100, left: 10, right: 10, bottom: 30 }
let height = 500 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

// And grabbing your container
let container = d3.select('#chart-4')

// Create your scales
let xPositionScale = d3.scaleLinear().range([0, width])
let yPositionScale = d3.scaleLinear().range([height, 0])

// Create your area generator
let line = d3
  .line()
  .x(d => xPositionScale(d.diff))
  .y(d => yPositionScale(d.freq))

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
  
  console.log('datapoints look like', datapoints)

  let diffs = datapoints.map(d => +d.diff)
  xPositionScale.domain(d3.extent(diffs))

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

      console.log('d looks like', d)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('fill','black')



    })

}
