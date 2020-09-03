const {
  json,
  select,
  scaleOrdinal,
  scaleLinear,
  scaleTime,
  axisBottom,
  axisLeft,
  extent,
  format
} = d3;

const width = 1000;
const height = document.documentElement.clientHeight;

const svg = select('svg')
  .attr('height', height)
  .attr('width', width);
    

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const render = sourceData => {

  const data = sourceData.monthlyVariance;
console.log(data);
  const xValue = d => d.year;
  const xAxisLabel = 'Time';
  
  const yValue = d => d.month;
  
  const margin = { top: 60, right: 40, bottom: 88, left: 105 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);

  
  const yScale = scaleOrdinal()
    .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    .range([1,2,3,4,5]);


  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xAxis = axisBottom(xScale)
    .tickFormat(format(''))
    .tickSize(-innerHeight)
    .tickPadding(15);
  
  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);
  
  const yAxisG = g.append('g').call(yAxis);
  
  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);
  
  xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', 80)
      .attr('x', innerWidth / 2)
      .attr('fill', 'black')
      .text(xAxisLabel);
 
};

// Fetch data
json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(data => {
    console.log(data);

    data.monthlyVariance.forEach(d => {
      d.month = months[d.month - 1]
    });

   

    render(data);
  })