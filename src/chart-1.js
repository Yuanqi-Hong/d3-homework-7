import * as d3 from 'd3'

// Set up margin/height/width
let margin = { top: 30, left: 50, right: 100, bottom: 30 }
let height = 300 - margin.top - margin.bottom
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
let parseTime = d3.timeParse('%m-%d')

// Create your scales
let xPositionScale = d3.scaleLinear().range([0, width])
let yPositionScale = d3.scaleLinear().range([0, height])

// Create a d3.line function that uses your scales

// Read in your housing price data
d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => console.log(err))

// Write your ready function
function ready(datapoints) {
  // Convert your months to dates
  
  // Get a list of dates and a list of prices
  // Group your data together
  // Draw your lines
  let max = d3.max(datapoints, d => +d.field_goal_attempts)
  // Add your text on the right-hand side
  // Add your title
  // Add the shaded rectangle
  // Add your axes
}
