d3.csv("Data/netflix_titles_cleaned.csv").then(data => {
    // Calculate the ratio of TV Shows to Movies
    let tvShows = data.filter(d => d.type === "TV Show").length;
    let movies = data.filter(d => d.type === "Movie").length;

    let margin = {top: 70, right: 20, bottom: 20, left: 20};

    // Adjust width and height
    let width = 450 - margin.left - margin.right;
    let height = 450 - margin.top - margin.bottom;

    // Create the pie chart
    let dataset = [
        {type: "TV Shows", value: tvShows},
        {type: "Movies", value: movies}
    ];
    let pie = d3.pie().value(d => d.value)(dataset);
    let arc = d3.arc().innerRadius(100).outerRadius(Math.min(width, height) / 2); // Set innerRadius to create a donut chart

    let svg = d3.select("#graph1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);

    svg.selectAll("path")
        .data(pie)
        .enter().append("path")
        .attr("fill", (d, i) => i === 0 ? "#FCA391" : "#D3283C")
        .attr("d", arc)
        .append("title") // Add tooltip
        .text(d => `${d.data.type}: ${d.data.value}`);

    // Add title
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-200px")
        .style("font-size", "1.5em")
        .style("fill", "red")
        .text("TV Shows vs Movies");

}).catch(console.error);