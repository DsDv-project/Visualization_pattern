d3.csv("Data/netflix_titles_cleaned.csv").then(data => {
    var select = d3.select("#countrySelects1");

    
           
    var countries = ["Total",...new Set(data.map(d => d.principal_country))];


    select.selectAll("option")
        .data(countries)
        .enter()
        .append("option")
        .text(d => d);

    select.on("change", function() {
            var selectedCountry = this.value;
            var filteredData = selectedCountry === "Total" ? data : data.filter(d => d.principal_country === selectedCountry);
            drawChart(filteredData, selectedCountry);
        });
    drawChart(data,"Total");

    function drawChart(data,country) {
    d3.select("#graph1").html(""); 
    // Calculate the ratio of TV Shows to Movies
    let tvShows = data.filter(d => d.type === "TV Show").length;
    let movies = data.filter(d => d.type === "Movie").length;
    let total = tvShows + movies;

    let margin = {top: 70, right: 20, bottom: 20, left: 20};

    // Adjust width and height
    let width = 450 - margin.left - margin.right;
    let height = 450 - margin.top - margin.bottom;

    // Create the pie chart
    let dataset = [
        {type: "TV Shows", value: tvShows, percentage: (tvShows / total * 100).toFixed(2)},
        {type: "Movies", value: movies, percentage: (movies / total * 100).toFixed(2)}
    ];
    let pie = d3.pie().value(d => d.value)(dataset);
    let arc = d3.arc().innerRadius(100).outerRadius(Math.min(width, height) / 2); 

    let svg = d3.select("#graph1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);

        let arcGenerator = d3.arc().innerRadius(100).outerRadius(Math.min(width, height) / 2);
        let arcHover = d3.arc().innerRadius(100).outerRadius(Math.min(width, height) / 2 + 10); 

        
        
        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("font-size", "20px")
            .style("background", "rgba(0, 0, 0, 0.7)") 
            .style("border", "1px solid white") 
            .style("border-radius", "5px") 
            .style("padding", "10px") 
            .text("a simple tooltip");

        svg.selectAll("slices")
            .data(pie)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d) { return d.data.type === "TV Shows" ? "#FCA391":"#D3283C"; }) 
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
            .on("mouseover", function(event, d) {      
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('d', arcHover);
                tooltip.html("Type: " + d.data.type + "<br>Value: " + d.data.value + "<br>Percentage: " + d.data.percentage + "%")
                    .style("visibility", "visible");
            })
            .on("mousemove", function(event) {
                return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('d', arcGenerator);
                tooltip.style("visibility", "hidden");
            });
            
    

    // Add title
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-200px")
        .style("font-size", "25px")
        .style("fill", "red")
        .text(`TV Shows vs Movies ${country === "Total" ? "" : "of " + country}`);

        
        }
}).catch(console.error);