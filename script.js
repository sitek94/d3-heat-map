const {
  json,
  select,
  scaleOrdinal,
  scaleLinear,
  scaleTime,
  axisBottom,
  axisLeft,
  extent,
  format,
  timeParse,
  min,
  max,
} = d3;

const width = 1000;
const height = document.documentElement.clientHeight;

const svg = select('svg')
  .attr('height', height)
  .attr('width', width);
    

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const render2 = sourceData => {

 

  
  
  
  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);

  
  xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', 80)
      .attr('x', innerWidth / 2)
      .attr('fill', 'black')
      .text(xAxisLabel);
 
};

// Render function
const render = (sourceData) => {

  const data = sourceData.monthlyVariance;

  // Value accessors
  const xValue = (d) => d.year;
  const yValue = (d) => d.month;

  // Margins 
  const margin = { top: 90, right: 20, bottom: 80, left: 100 };

  // Inner dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const barWidth = innerWidth / data.length;

  const parseMonth = timeParse('%m')
  console.log(parseMonth(2));

  // x scale
  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);

  // x axis
  const xAxis = axisBottom(xScale)
    .tickFormat(format(''))
    .tickSize(-innerHeight)
    .tickPadding(15);

  // y scale
  const yScale = scaleTime()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  // y axis
  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)

  // Create group container inside svg
  const container = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Title
  container.append('text')
    .attr('id', 'title')
    .attr('y', -60)
    .text('Gross Domestic Product in United States');

  // Sub title
  container.append('text')
    .attr('id', 'sub-title')
    .attr('y', -30)
    .text('1947-01-01 - 2015-07-01');

  // y axis
  const yAxisG = container.append('g').call(yAxis)
    .attr('id', 'y-axis');

  // y axis label
  yAxisG.append('text')
    .attr('id', 'y-axis-label')
    .attr('text-anchor', 'middle')
    .attr('x', -innerHeight / 2)
    .attr('y', -50)
    .attr('transform', 'rotate(-90)')
    .text('GDP in Billions of Dollars');
    
  // Remove domain line
  yAxisG.select('.domain').remove();

  // Append x axis
  container.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`)
    .attr('id', 'x-axis');

  // Append bars
  container.selectAll('rect').data(data).enter()
    .append('rect')
      .attr('class', 'bar')
      // Dimensions
      .attr('width', barWidth)
      .attr('height', (d) => yScale(0) - yScale(yValue(d)))
      // Position
      .attr('x', (d) => xScale(xValue(d)))
      .attr('y', (d) => yScale(yValue(d)))
};

// Fetch data
json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(data => {
    console.log(data);
   

    render(data);
  })