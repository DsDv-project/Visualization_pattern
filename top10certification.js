// Load the CSV file
d3.csv("Data/netflix_titles_cleaned.csv").then(function(data) {

    var select = d3.select("#countrySelect");

    select.selectAll("option")
           
    var countries = ["Total",...new Set(data.map(d => d.principal_country))];


    select.selectAll("option")
        .data(countries)
        .enter()
        .append("option")
        .text(d => d);

    var margin = {top: 60, right: 30, bottom: 30, left: 70},
        width = 560 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#graph5").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    function updategraph() {

    svg.selectAll("*").remove();
    var selectedCountry = d3.select("#countrySelect").property("value");

    var filteredData = selectedCountry === "Total" ? data : data.filter(d => d.principal_country === selectedCountry);

    var counts = {};
    filteredData.forEach(function(d) {
        var age = d.age_certification.trim();  // Remove leading and trailing spaces
        if (!counts[age]) {
            counts[age] = 0;
        }
        counts[age]++;
    });

    // Convert 'counts' to an array of objects
    var countsArray = Object.keys(counts).map(function(age) {
        return { age: age, count: counts[age] };
    });

    // Sort the array by count in descending order and take the top 10
    countsArray.sort(function(a, b) {
        return b.count - a.count;
    });
    countsArray = countsArray.slice(0, 10);

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.2);
    var y = d3.scaleLinear()
        .range([height, 0]);


    x.domain(countsArray.map(function(d) { return d.age; }));
    y.domain([0, d3.max(countsArray, function(d) { return d.count; })]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.append("g")
        .call(d3.axisLeft(y).tickSizeOuter(0)); 

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll(".bar")
        .data(countsArray)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.age); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return height - y(d.count); })
        .attr("fill", function(d) { return color(d.age); });

    // Add text labels above the bars
    svg.selectAll(".text")
        .data(countsArray)
        .enter()
        .append("text")
        .attr("class","label")
        .attr("x", (function(d) { return x(d.age) + x.bandwidth() - 31 ; }  ))
        .attr("y", function(d) { return y(d.count) - 10; })
        .attr("text-anchor", "start")  // Anchor the text at the start (left)
        .attr("dominant-baseline", "middle") 
        .text(function(d) { return d.count; })
        .attr("fill", "white")
        .attr("font-size", "15px"); 

    svg.selectAll("g g.tick text")
        .style("font-size", "10px")
        .attr("fill", "Ivory");
    svg.selectAll("g path.domain")
        .attr("stroke", "white");    

    svg.append("text")
        .attr("x", width / 2 )
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("fill", "red")  
        .style("font-size", "20px") 
         
        .text("Top 10 age certifications");


    }

    updategraph();
    window.addEventListener("countryChanged", function() {
        updategraph();
    });
});