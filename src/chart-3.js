import * as d3 from 'd3'

// Create your margins and height/width
let margin = { top: 30, left: 50, right: 50, bottom: 30 }
let height = 250 - margin.top - margin.bottom
let width = 200 - margin.left - margin.right

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
Promise.all([
  d3.csv(require('./middle-class-income.csv')),
  d3.csv(require('./middle-class-income-usa.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed with', err))

// Create your ready function
function ready([datapoints, datapointsUSA]) {
  let years = datapointsUSA.map(d => d.year)
  xPositionScale.domain(d3.extent(years))

  let nested = d3
    .nest()
    .key(d => d.country)
    .entries(datapoints)

  container
    .selectAll('.income-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'income-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .each(function(d) {
      let svg = d3.select(this)

      // adding USA income line
      svg
        .append('path')
        .datum(datapointsUSA)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#CFCFCF')
        .attr('stroke-width', 2)

      // adding other countries' income lines
      // one for every svg
      svg
        .append('path')
        .datum(d.values)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#A75B7A')
        .attr('stroke-width', 2)

      // adding titles
      svg
        .append('text')
        .attr('font-size', 14)
        .attr('font-weight', 'bold')
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('dy', -15)
        .attr('fill', '#A75B7A')
        .text(d.key)

      // adding USA label
      svg
        .append('text')
        .attr('font-size', 12)
        .attr('x', 0)
        .attr('y', 0)
        .attr('dx', 5)
        .attr('dy', 25)
        .attr('fill', '#A0A0A0')
        .text('USA')

      // adding axes and grids

      let dollarFormat = d => '$' + d3.format(',')(d)

      let xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis.ticks(4).tickSize(-height))

      svg.selectAll('.x-axis path').remove()

      let yAxis = d3.axisLeft(yPositionScale).tickFormat(dollarFormat)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis.ticks(4).tickSize(-width))

      svg.selectAll('.domain').remove()

      svg
        .selectAll('.axis')
        .attr('stroke-dasharray', '3 5')
        .attr('stroke-linecap', 'round')

      svg
        .selectAll('.tick')
        .filter(d => d === 0)
        .remove()
    })
}
