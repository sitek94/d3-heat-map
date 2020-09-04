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

const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

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
  const colors = [
    '#d73027', // red - very dark
    '#f46d43', // red - dark
    '#fdae61', // red - light
    '#fee090', // red - very light
    '#ffffbf', // Neutral color - whitish
    '#e0f3f8', // blue - very light
    '#abd9e9', // blue - Light
    '#74add1', // blue - dark
    '#4575b4', // blue - very dark
  ];

  // Variance constants 
  const [minVariance, maxVariance] = extent(data, vValue);
  const varianceAmplitude = maxVariance - minVariance;
  const varianceStep = varianceAmplitude / colors.length;
  const varianceDomain = [minVariance, maxVariance];

  // Construct variance treshold
  const varianceTreshold = [];
  for (let i = 1; i < colors.length; i++) {
    // Calculate and round the value
    const value = minVariance + (varianceStep * i);
    const roundedValue = Math.round(value * 1000) / 1000;
    // Push the value to treshold array
    varianceTreshold.push(roundedValue);
  }
  
  // Color scale
  const colorScale = scaleThreshold()
  .domain(varianceTreshold)
  .range(colors.reverse());

  // Margins 
  const margin = { top: 90, right: 20, bottom: 150, left: 120 };

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

  // Append legend
  svg.append('g')
    .attr('transform', `translate(120,${height - 100})`)
    .call(colorLegend, {
      colorScale,
      treshold: varianceTreshold,
      height: 30,
      width: 300,
      xDomain: varianceDomain
    });

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
      .attr('x', d => xScale(xValue(d)))
      .attr('y', d => yValue(d) * cellHeight)
      .attr('fill', d => colorScale(vValue(d)));

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

// Legend component
const colorLegend = (selection, props) => {
  const {
    colorScale,
    width,
    height,
    xDomain
  } = props;

  // X scale
  const xScale = d3.scaleLinear()
  .domain(xDomain)
  .range([0, width]);

  // X axis
  const xAxis = axisBottom(xScale)
    .tickSize(40)
    .tickValues(colorScale.domain())
    .tickFormat(format('.2f'))
    .tickPadding(10);

  // Append legend container to provided selection element
  const container = selection.append('g').call(xAxis);

  // Remove domain line
  container.select('.domain').remove();

  // Construct dataset, important when working with threshold scales
  const dataset = colorScale.range()
    .map(color => {
      // For each color I need to have an array of first and second number
      // Sth like this [ [-6, -5], [-5, -4], [-4, -3], [-2, -1] ]
      // Nice explanation of all this:
      // https://stackoverflow.com/questions/48161257/understanding-invertextent-in-a-threshold-scale
      const d = colorScale.invertExtent(color);

      if (d[0] == null) d[0] = xScale.domain()[0];
      if (d[1] == null) d[1] = xScale.domain()[1];

      return d;
    });

  container.selectAll('rect')
    .data(dataset)
  .enter().insert('rect', '.tick')
    .attr('x', d => xScale(d[0]))
    .attr('height', height)
    .attr('width', d => xScale(d[1]) - xScale(d[0]))
    .attr('fill', d => colorScale(d[0]));

  // container.append('text')
  //   .attr('fill', '#000')
  //   .attr('font-weight', 'bold')
  //   .attr('text-anchor', 'start')
  //   .attr('y', -6)
  //   .text('Percentage of stops that involved force');
}

// Fetch data
json(url)
  .then(data => {

    // Fix months to represent each month in 0-11 format
    data.monthlyVariance.forEach(d => {
      d.month--;
    })
    
    render(data);
  })
  // Catch errors
  .catch(error => {
    console.log("Something went wrong when fetching the data. Error: ", error);
  })


  


 