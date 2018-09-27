import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 30, left: 50, right: 100, bottom: 30 }
var height = 300 - margin.top - margin.bottom
var width = 700 - margin.left - margin.right

// Add your svg
var svg = d3
  .select('#chart-1')
  .enter()
  .append('svg')
  .attr('class', 'chart-1')

// Create a time parser (see hints)

// Create your scales

// Create a d3.line function that uses your scales

// Read in your housing price data

// Write your ready function

function ready(datapoints) {
  // Convert your months to dates
  // Get a list of dates and a list of prices
  // Group your data together
  // Draw your lines
  // Add your text on the right-hand side
  // Add your title
  // Add the shaded rectangle
  // Add your axes
}
