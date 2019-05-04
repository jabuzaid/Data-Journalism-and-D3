// Joe j. Abuzaid //
// UC Berkeley Data Analytics Bootcamp: UCBSAN201811DATA2 //
// 2018-2019 //

// @TODO: YOUR CODE HERE
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our scatter plot, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import data 
d3.csv("assets/data/data.csv", function(err, healthdata) {
  if (err) throw err;
 
  // console.log(healthdata);

 // Step 1: Parse Data/Cast as numbers
 healthdata.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare= +d.healthcare;  
  });

// Step 2: Create scale functions
var xLinearScale = d3.scaleLinear()
  .domain([d3.min(healthdata, d => d.poverty)-0.5, d3.max(healthdata, d => d.poverty)+0.5, 30])
  .range([0, width]);

var yLinearScale = d3.scaleLinear()
  .domain([d3.min(healthdata, d => d.healthcare)-1, d3.max(healthdata, d => d.healthcare)+1.1])
  .range([height, 0]);
  
// Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//Append axes to the chart
chart.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chart.append("g")
  .call(leftAxis);

//Create Circles
var circlesGroup = chart.selectAll("circle").data(healthdata).enter();
  
var cTip=circlesGroup
  .append("circle")  
  .classed("stateCircle", true)
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "15")
  .attr("opacity", ".5");
  
//Create text labels with state abbreviation for each circle
circlesGroup.append("text")
  .classed("stateText", true)
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.healthcare))
  .attr("stroke", "teal")
  .attr("font-size", "10px")
  .text(d => d.abbr)
    
  
//Initialize tool tip

var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
  });

//Create tooltip in the chart
cTip.call(toolTip);

//Create event listeners to display and hide the tooltip
cTip.on("mouseover", function(d) {
  d3.select(this).style("stroke", "black")
  toolTip.show(d, this);
})
  //on mouseout event
  .on("mouseout", function(d, index) {
    d3.select(this).style("stroke", "blue")
    .attr("r", "10")
    toolTip.show(d);
  });

	// //Append the bottom axis.
	// chart.append("g")
	// .attr("transform", `translate(0, ${chartHeight})`)
	// .call(bottomAxis);

  // //Append the left axis.
  // chart.append("g")
  // .call(leftAxis);

// Create Y-axis and X-axis labels
chart.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text("Lacks Healthcare (%)");

chart.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
.attr("class", "axisText")
.text("In Poverty (%)");
    
});