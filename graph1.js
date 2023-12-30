d3.csv("Data/netflix_titles_cleaned.csv").then(data => {
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

        
        
        svg.selectAll("path")
            .data(pie)
            .enter().append("path")
            .attr("fill", (d, i) => i === 0 ? "#FCA391" : "#D3283C")
            .attr("d", arcGenerator)
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .transition()
                    .attr("d", arcHover)
                    .duration(200);
        
            
                d3.select("#tooltip")
                    
                    .transition()
                    .duration(100)
                    .style("opacity", 1)
                    .style("left", event.pageX + 5 + "px")
                    .style("top", event.pageY + 5 + "px")
                    .style("opacity", 1)
                    .select("#value")
                    .text(d.data.value);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .attr("d", arcGenerator)
                    .duration(500);
        
                d3.select("#tooltip")
                    .style("opacity", 0);
            })
            .append("title")
            .text(d => `${d.data.type}: ${d.data.value}`);
    

    // Add title
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-200px")
        .style("font-size", "1.5em")
        .style("fill", "red")
        .text("TV Shows vs Movies");

        

}).catch(console.error);