import * as d3 from 'd3'

// Set up margin/height/width
let margin = { top: 25, left: 25, right: 15, bottom: 25 }
let height = 110 - margin.top - margin.bottom
let width = 110 - margin.left - margin.right

// I'll give you the container
let container = d3.select('#chart-2')

// Create your scales
let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create d3.line functions that use your scales
let line_jp = d3
  .line()
  .x(d => xPositionScale(d.Age))
  .y(d => yPositionScale(d.ASFR_jp))

let line_us = d3
  .line()
  .x(d => xPositionScale(d.Age))
  .y(d => yPositionScale(d.ASFR_us))

// Read in your data
d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => console.log(err))

// Build your ready function that draws lines, axes, etc
function ready(datapoints) {
  let ages = datapoints.map(d => d.Age)
  xPositionScale.domain(d3.extent(ages))

  let nested = d3
    .nest()
    .key(d => d.Year)
    .entries(datapoints)

  container
    .selectAll('.fertility-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'fertility-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .each(function(d) {
      let svg = d3.select(this)

      let jpFertilities = d.values.map(d => +d.ASFR_jp)
      let usFertilities = d.values.map(d => +d.ASFR_us)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', line_jp)
        .attr('fill', 'lightblue')
        .attr('opacity', 0.6)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', line_us)
        .attr('fill', 'pink')
        .attr('opacity', 0.9)
        .lower()

      svg
        .append('text')
        .text(d.key)
        .attr('font-size', 14)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('dy', -10)

      svg
        .append('text')
        .text(d3.sum(usFertilities).toFixed(2))
        .attr('font-size', 12)
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('dx', 25)
        .attr('dy', -10)
        .attr('fill', 'pink')

      svg
        .append('text')
        .text(d3.sum(jpFertilities).toFixed(2))
        .attr('font-size', 12)
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('dx', 25)
        .attr('dy', 5)
        .attr('fill', 'lightblue')

      let xAxis = d3.axisBottom(xPositionScale)
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis.ticks(5))

      let yAxis = d3.axisLeft(yPositionScale)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis.ticks(4))
    })
}

export { xPositionScale, yPositionScale, line_us, line_jp, width, height }
