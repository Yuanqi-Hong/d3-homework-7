import * as d3 from 'd3'

// Create your margins and height/width
let margin = { top: 30, left: 50, right: 100, bottom: 30 }
let height = 500 - margin.top - margin.bottom
let width = 500 - margin.left - margin.right

// I'll give you this part!
let container = d3.select('#chart-3')

// Create your scales
let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator
let line = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.income))

// Read in your data


// Create your ready function
