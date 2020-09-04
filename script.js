const {
  json,
  select,
  scaleBand,
  scaleOrdinal,
  scaleLinear,
  scaleTime,
  axisBottom,
  axisLeft,
  extent,
  format,
  timeParse,
  timeFormat,
  min,
  max,
} = d3;

const width = 1400;
const height = document.documentElement.clientHeight;

const svg = select('svg')
  .attr('height', height)
  .attr('width', width);
    

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

  // Bar dimensions
  const barWidth = innerWidth * 12 / data.length;
  const barHeight = innerHeight / 12;

  
  

  

  // x scale
  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);

  console.log(xScale(1760));

  // x axis
  const xAxis = axisBottom(xScale)
    .tickFormat(format(''))
    //.tickSize(-innerHeight)
    .tickPadding(15);  

  // y scale
  const yScale = scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    .range([innerHeight, 0]);

  // Get month name
  const yAxisTickFormat = monthNumber => {
    const parseMonth = timeParse('%m');
    const month = parseMonth(monthNumber);
    return timeFormat('%B')(month);
  }

  // Y axis
  const yAxis = axisLeft(yScale)
    .tickFormat(yAxisTickFormat);

  // Create group container inside svg
  const container = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Title
  container.append('text')
    .attr('id', 'title')
    .attr('y', -60)
    .text('Monthly Global Land-Surface Temperature');

  // Sub title
  container.append('text')
    .attr('id', 'sub-title')
    .attr('y', -30)
    .text('1753 - 2015: base temperature 8.66℃');

  // Y axis
  const yAxisG = container.append('g').call(yAxis)
    .attr('id', 'y-axis')
  
  // Remove y axis domain line
  yAxisG.select('.domain').remove();

  // y axis label
  yAxisG.append('text')
    .attr('id', 'y-axis-label')
    .attr('text-anchor', 'middle')
    .attr('x', -innerHeight / 2)
    .attr('y', -50)
    .attr('transform', 'rotate(-90)')
    .text('GDP in Billions of Dollars');

  // X axis
  const xAxisG = container.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`)
    .attr('id', 'x-axis')
  
  // Remove x axis domain line
  xAxisG.select('.domain').remove();

  // Bars
  container.selectAll('rect').data(data).enter()
    .append('rect')
      .attr('class', 'bar')
      // Dimensions
      .attr('width', barWidth)
      .attr('height', barHeight)
      // Position
      .attr('x', (d) => xScale(xValue(d)))
      .attr('y', d => yValue(d) * barHeight)
};

// Fetch data
json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(data => {
    
   
    data.monthlyVariance.forEach(d => {
      d.month--;
    })

    console.log(data);

    render(data);
  })