// Define a row converter
var rowConverter = function(d) {
    return {
        genres: String(d["genres"]),
        title: String(d["title"]),
        country: String(d["country"]) 
    };
}

d3.csv("Data/netflix_titles_cleaned.csv", rowConverter).then(function(data) {
    var counts = {};
    data.forEach(function(d) {
        var genre = d.genres.trim();  
        if (!counts[genre]) {
            counts[genre] = 0;
        }
        counts[genre]++;
    });

    



    var countsArray = Object.keys(counts).map(function(genre) {
        return { genre: genre, count: counts[genre] };
    });


    var fullData = countsArray.sort(function(a, b) {
        return b.count - a.count;
    });
    var num = 5;
    var fullData = countsArray; 
    countsArray = fullData.slice(0, num);
    updateData();

    const button = d3.select("#Addingbutton");
    button.on("click", function() {
        if (num < fullData.length) {
            num++;
            countsArray = fullData.slice(0, num);
            updateData();
          }
        
    });

    const buttonRM = d3.select("#Removebutton");
    buttonRM.on("click", function() {
        if (num >1) {
            num--;
            countsArray = fullData.slice(0, num);
            updateData();
          }
        
    });




    function updateData() {

        d3.select("#graph4").select("svg").remove();

        var width = 550;
        var height = 350;
        var margin = { top: 50, right: 70, bottom: 50, left: 250 };

        var svg = d3.select("#graph4")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var yScale = d3.scaleBand()
            .domain(countsArray .map(function(d) { return d.genre; }))
            .range([0, height])
            .padding(0.2);

        // Create the y-axis
        svg.append("g")
            .call(d3.axisLeft(yScale).tickSizeOuter(0));

        var xScale = d3.scaleLinear()
            .domain([0, d3.max(countsArray , function(d) { return d.count; })])
            .range([0, width]);

        // Create the x-axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).tickSizeOuter(0));

        svg.selectAll("rect")
            .data(countsArray)
            .enter()
            .append("rect")
            .attr("y", function(d) { return yScale(d.genre); })
            .attr("x", 0)
            .attr("height", yScale.bandwidth())
            .attr("width", function(d) { return xScale(d.count); })
            .attr("fill", "red");

            // Append value to the SVG in front of each bar
        svg.selectAll(".bar-label")  // Select based on the class "bar-label"
            .data(countsArray)
            .enter()
            .append("text")
            .attr("class", "bar-label")  // Add the class "bar-label" to the text elements
            .text(function(d) { return d.count; })  // Set the text to the count
            .attr("y", function(d) { return yScale(d.genre) + yScale.bandwidth() / 2; })  // Position the text in the middle of the bar
            .attr("x", function(d) { return xScale(d.count) + 3; })  // Position the text slightly to the right of the end of the bar
            .attr("text-anchor", "start")  // Anchor the text at the start (left)
            .attr("dominant-baseline", "middle")  // Vertically align the text in the middle
            .attr("fill", "white")  // Set the text color to blue
            .attr("font-size", "17px"); 

        svg.selectAll("g g.tick text")
            .style("font-size", "13px")
            .attr("fill", "Ivory");
        svg.selectAll("g path.domain")
            .attr("stroke", "white");       

        svg.append("text")
            .attr("x", width / 2 )
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .attr("fill", "red")  
            .style("font-size", "20px") 
            
            .text("Top 10 genres");
        }
});