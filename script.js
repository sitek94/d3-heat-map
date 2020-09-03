const {
  json,
  select
} = d3;

const width = 1000;
const height = document.documentElement.clientHeight;

const svg = select('svg')
  .attr('height', height)
  .attr('width', width)
    .append('rect')
      .attr('height', height)
      .attr('width', width)
      .attr('fill', '#ccc');

// Fetch data
json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then(data => {
    console.log(data);
  })