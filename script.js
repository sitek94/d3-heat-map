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
  const margin = { top: 90, right: 20, bottom: 80, left: 120 };

  // Inner dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Cell dimensions
  const cellWidth = innerWidth * 12 / data.length;
  const cellHeight = innerHeight / 12;

  // X scale
  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);  
  
  // X axis
  const xAxis = axisBottom(xScale)
    .tickFormat(format(''))
    .tickPadding(15);  

  // Y scale
  const yScale = scaleBand()
  .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  .range([innerHeight, 0]);

  // Get month name from a number
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

  // Append y axis
  container.append('g').call(yAxis)
    .attr('id', 'y-axis')
    .attr('class', 'axis')
      // Remove domain line
      .select('.domain').remove();  

  // Append x axis
  container.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`)
    .attr('id', 'x-axis')
    .attr('class', 'axis')
      // Remove domain line
      .select('.domain').remove();

  // Cells
  container.selectAll('rect').data(data).enter()
    .append('rect')
      .attr('class', 'cell')
      // Dimensions
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      // Position
      .attr('x', (d) => xScale(xValue(d)))
      .attr('y', d => yValue(d) * cellHeight);

    // Title
  container.append('text')
  .attr('id', 'title')
  .attr('class', 'description')
  .attr('y', -60)
  .text('Monthly Global Land-Surface Temperature');

  // Description
  container.append('text')
    .attr('id', 'description')
    .attr('class', 'description')
    .attr('y', -30)
    .text('1753 - 2015: base temperature 8.66℃');
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