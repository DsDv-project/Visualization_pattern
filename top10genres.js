// Define a row converter
d3.csv("Data/netflix_titles_cleaned.csv").then(function(data) {

    var select = d3.select("#countrySelect");

    select.selectAll("option")
           
    var countries = ["Total",...new Set(data.map(d => d.principal_country))];


    select.selectAll("option")
        .data(countries)
        .enter()
        .append("option")
        .text(d => d);

        var width = 550;
        var height = 350;
        var margin = { top: 50, right: 70, bottom: 50, left: 250 };

        var svg = d3.select("#graph4")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let num = 5;
        let counts = {}; // Define counts globally

        function calculateCounts() {
            counts = {};
            var selectedCountry = d3.select("#countrySelect").property("value");
            var filteredData = selectedCountry === "Total" ? data : data.filter(d => d.principal_country === selectedCountry);

            filteredData.forEach(function(d) {
                var genre = d.genres.trim();  
                if (!counts[genre]) {
                    counts[genre] = 0;
                }
                counts[genre]++;
            });
        }

        // Call calculateCounts initially to populate counts
        calculateCounts();

        const button = d3.select("#Addingbutton");
        button.on("click", function() {
            if (num < Object.keys(counts).length) {
                num++;
                updateData();
            }
        });

        const buttonRM = d3.select("#Removebutton");
        buttonRM.on("click", function() {
            if (num > 1) {
                num--;
                updateData();
            }
        });

    function updateData() {

        svg.selectAll("*").remove();
        var selectedCountry = d3.select("#countrySelect").property("value");

        var filteredData = selectedCountry === "Total" ? data : data.filter(d => d.principal_country === selectedCountry);

        var counts = {};
        filteredData.forEach(function(d) {
            var genre = d.genres.trim();  
            if (!counts[genre]) {
                counts[genre] = 0;
            }
            counts[genre]++;
        });
    
        // Convert the counts object to an array and sort it
        countsArray = Object.keys(counts).map(function(genre) {
            return { genre: genre, count: counts[genre] };
        }).sort(function(a, b) {
            return b.count - a.count;
        }).slice(0, num);

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
            
            .text("Kind of genres in Netflix");
        }

    updateData();
        // Add event listener for select element
    window.addEventListener("countryChanged", function() {
    updateData();
});
    }).catch(function(error) {
            console.log(error);
});