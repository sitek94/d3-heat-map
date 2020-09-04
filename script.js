const {
  json,
  select,
  scaleBand,
  scaleThreshold,
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



const color = {
  red400: '#d73027',
  red300: '#f46d43',
  red200: '#fdae61',
  red100: '#fee090',
  neutral: '#ffffbf',
  blue100: '#e0f3f8',
  blue200: '#abd9e9',
  blue300: '#74add1',
  blue400: '#4575b4',
}

// Render function
const render = (sourceData) => {

  const data = sourceData.monthlyVariance;

  const title = 'Monthly Global Land-Surface Temperature';
  const description = '1753 - 2015: base temperature 8.66℃';

  const { baseTemperature } = sourceData;

  // Value accessors
  const xValue = d => d.year;
  const yValue = d => d.month;
  const vValue = d => d.variance;

  // Color object 
  const color = {
    red400: '#d73027',
    red300: '#f46d43',
    red200: '#fdae61',
    red100: '#fee090',
    neutral: '#ffffbf',
    blue100: '#e0f3f8',
    blue200: '#abd9e9',
    blue300: '#74add1',
    blue400: '#4575b4',
  }
  const colorsLength = Object.keys(color).length;
  const colorValues = Object.values(color);

  // Variance constants 
  const minVariance = min(data, vValue);
  const maxVariance = max(data, vValue);
  const varianceAmplitude = maxVariance - minVariance;
  const varianceStep = varianceAmplitude / colorsLength;

  // Construct variance treshold
  const varianceTreshold = [];
  for (let i = 1; i < colorsLength; i++) {
    // Calculate and round the value
    const value = minVariance + (varianceStep * i);
    const roundedValue = Math.round(value * 1000) / 1000;
    // Push the value to treshold array
    varianceTreshold.push(roundedValue);
  }

  // Color scale
  const colorScale = scaleThreshold()
  .domain(varianceTreshold)
  .range(colorValues);

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
  .attr('class', 'title')
  .attr('y', -60)
  .text(title);

  // Description
  container.append('text')
    .attr('id', 'description')
    .attr('class', 'description')
    .attr('y', -30)
    .text(description);
};

// Fetch data
json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(data => {
    
    data.monthlyVariance.forEach(d => {
      d.month--;
    })

    render(data);
  })
  .catch(error => console.log("Error while loading the data."));