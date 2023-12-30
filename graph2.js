var margin = {top: 20, right: 30, bottom: 70, left: 50},
width = 1400 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#graph2")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("Data/data.csv",


function(d){
  return { year : d.year, movies : d.movies, tv_shows : d.tv_shows }
}).then(function(data) {

  var slider = document.getElementById("myRange");
  slider.oninput = function() {
    var filteredData = data.filter(function(d) {
      return d.year <= slider.value;
    });

    redrawGraph(filteredData);
  }

  
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width ]);
  var allYears = data.map(function(d) { return d.year; });

    svg.append("g")
        .attr("transform", "translate(0," + height +")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")).tickValues(allYears))
        .selectAll("text, line") 
        .attr("stroke", "white")
        .style("font-size", "16px")
        .attr("fill", "white");

  svg.selectAll(".domain")
    .attr("stroke", "white");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([ 0, d3.max(data, function(d) { return Math.max(d.movies, d.tv_shows); })])
    .range([ height, 0 ]);
  svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text, line") 
      .attr("stroke", "white")
      .style("font-size", "16px") 
      .attr("fill", "white");

  svg.selectAll(".domain")
      .attr("stroke", "white");

  // Add the lines
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.year) })
      .y(function(d) { return y(d.movies) })
    )
  
  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle") 
    .attr("class", "dot") 
    .attr("cx", function(d) { return x(d.year) })
    .attr("cy", function(d) { return y(d.movies) })
    .attr("r", 5)
    .style("fill", "red")
    .append("title") // Tooltip here
    .text(function(d) { return 'Year: ' + d.year + ', Movies: ' + d.movies; });;

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.year) })
      .y(function(d) { return y(d.tv_shows) })
    )
  svg.selectAll(".dot2")
    .data(data)
    .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot2") // Assign a class for styling
    .attr("cx", function(d) { return x(d.year) })
    .attr("cy", function(d) { return y(d.tv_shows) })
    .attr("r", 5)
    .style("fill", "white")
    .append("title") // Tooltip here
    .text(function(d) { return 'Year: ' + d.year + ', Movies: ' + d.movies; });;


  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height -20)
    .style("fill", "white")
    .style("font-size", "20px")
    .text("Year");

  // Add Y axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(0)")
    .attr("y", 30)
    .attr("x", 100)
    .style("fill", "white")
    .style("font-size", "20px")
    .text("Count");

});

function redrawGraph(data) {
  // Clear the SVG
  svg.selectAll("*").remove();

  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width ]);
  
  var allYears = data.map(function(d) { return d.year; });

  svg.append("g")
        .attr("transform", "translate(0," + height +")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")).tickValues(allYears))
        .selectAll("text, line") 
        .attr("stroke", "white")
        .style("font-size", "16px")
        .attr("fill", "white");
  svg.selectAll(".domain")
    .attr("stroke", "white");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([ 0, d3.max(data, function(d) { return Math.max(d.movies, d.tv_shows); })])
    .range([ height, 0 ]);
  svg.append("g")
      .call(d3.axisLeft(y).tickFormat(d3.format("d")))
      .selectAll("text, line") 
      .attr("stroke", "white")
      .style("font-size", "16px") 
      .attr("fill", "white");

  svg.selectAll(".domain")
      .attr("stroke", "white");

  
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.year) })
      .y(function(d) { return y(d.movies) })
      
    )
  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle") 
    .attr("class", "dot") 
    .attr("cx", function(d) { return x(d.year) })
    .attr("cy", function(d) { return y(d.movies) })
    .attr("r", 5)
    .style("fill", "red")
    .append("title") // Tooltip here
    .text(function(d) { return 'Year: ' + d.year + ', Movies: ' + d.movies; });;
  
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function(d) { return x(d.year) })
      .y(function(d) { return y(d.tv_shows) })
    )
  svg.selectAll(".dot2")
    .data(data)
    .enter().append("circle") 
    .attr("class", "dot2") 
    .attr("cx", function(d) { return x(d.year) })
    .attr("cy", function(d) { return y(d.tv_shows) })
    .attr("r", 5)
    .style("fill", "white")
    .append("title") // Tooltip here
    .text(function(d) { return 'Year: ' + d.year + ', Movies: ' + d.tv_shows; });;

  
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height -20)
    .style("fill", "white")
    .style("font-size", "20px")
    .text("Year");

  // Add Y axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(0)")
    .attr("y", 30)
    .attr("x", 100)
    .style("fill", "white")
    .style("font-size", "20px")
    .text("Count");
  

  
    
}