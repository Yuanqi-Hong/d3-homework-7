import * as d3 from 'd3'

// Set up margin/height/width
let margin = { top: 30, left: 50, right: 100, bottom: 30 }
let height = 700 - margin.top - margin.bottom
let width = 700 - margin.left - margin.right

// Add your svg
let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

// Create a time parser (see hints)
let parseTime = d3.timeParse('%B-%d')

// Create your scales
let xPositionScale = d3.scaleLinear().range([0, width])
let yPositionScale = d3.scaleLinear().range([height, 0])
let colorScale = null

// Create a d3.line function that uses your scales
let line = d3
  .line()
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(d.price))

// Read in your housing price data
d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => console.log(err))

// Write your ready function
function ready(datapoints) {
  // Convert your months to dates
  datapoints.forEach(d => (d.datetime = parseTime(d.month)))

  // Get a list of dates and a list of prices
  let datetimes = datapoints.map(d => d.datetime)
  let prices = datapoints.map(d => d.price)

  // Group your data together
  let nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  // Draw your lines
  xPositionScale.domain(d3.extent(datetimes))
  yPositionScale.domain(d3.extent(prices))

  svg
    .selectAll('.price-line')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'price-line')
    .attr('d', d => line(d.values))
    .attr('fill', 'none')
    .attr('stroke', '#333333')
    .attr('stroke-width', 2)
    .lower()

  // Add your text on the right-hand side

  // Add your title
  // Add the shaded rectangle
  // Add your axes
  let xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b %d'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)

  let yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
