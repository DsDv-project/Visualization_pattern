d3.csv("Data/netflix_titles_cleaned.csv").then(function(data) {
    console.log(data); 

    var select = d3.select("#countrySelect");

    select.selectAll("option")
           
    var countries = ["Total",...new Set(data.map(d => d.principal_country))];


    select.selectAll("option")
        .data(countries)
        .enter()
        .append("option")
        .text(d => d);

    
        var width = 500;
        var height = 400;
        var radius = Math.min(width, height) / 2;

        var svg = d3.select("#piechart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    

    // Function to update the chart
    function updateChart() {

        svg.selectAll("*").remove();

        var selectedCountry = d3.select("#countrySelect").property("value");
        console.log(selectedCountry);

        // Filter data for the selected country
        var filteredData = selectedCountry === "Total" ? data : data.filter(d => d.principal_country === selectedCountry);

        const counts = {
            "Kids": 0,
            "Older Kids": 0,
            "Teens": 0,
            "Adults": 0,
        };

        filteredData.forEach(function(d) {
            if (d.target_ages === "Kids") {
                counts["Kids"] += 1;
            } else if (d.target_ages === "Older Kids") {
                counts["Older Kids"] += 1;
            } else if (d.target_ages === "Teens") {
                counts["Teens"] += 1;
            } else if (d.target_ages === "Adults") {
                counts["Adults"] += 1;
            }
        });

        const pieData = [
            { "target_ages": "Kids", "count": counts["Kids"] },
            { "target_ages": "Older Kids", "count": counts["Older Kids"] },
            { "target_ages": "Teens", "count": counts["Teens"] },
            { "target_ages": "Adults", "count": counts["Adults"] }
        ];



        var color = d3.scaleSequential(d3.interpolateReds).domain([0,3])


    // Map categories to numbers
    var categories = ["Kids", "Older Kids", "Teens", "Adults"];
    var categoryToNumber = {};
        categories.forEach(function(category, i) {
            categoryToNumber[category] = i;
    });


    var pie = d3.pie()
        .value(function(d) { return d.count; });

    var data_ready = pie(pieData);

    var arc = d3.arc()
        .innerRadius(radius * 0.5)  // This makes it a donut chart
        .outerRadius(radius * 0.8);

    var outerArc = d3.arc()  // This is used for the labels
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "white")
        .style("font-size", "20px")
        .style("background", "rgba(0, 0, 0, 0.7)") // semi-transparent black
        .style("border", "1px solid white") // white border
        .style("border-radius", "5px") // rounded corners
        .style("padding", "10px") // space between text and border
        .text("a simple tooltip");


    svg.selectAll('slices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d) { return color(categoryToNumber[d.data.target_ages]); })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
            .on("mouseover", function(d) {
                tooltip.html("Ages: " + d.data.target_ages + "<br>Count: " + d3.format(".1%")(d.data.count / d3.sum(pieData, function(d) { return d.count; })))
                    .style("visibility", "visible");
            })
            .on("mouseover", function(event, d) {      
                tooltip.html("Ages: " + d.data.target_ages + "\n" + "<br>Count: " + d3.format(".1%")(d.data.count / d3.sum(pieData, function(d) { return d.count; })))
                    .style("visibility", "visible");
            })
            .on("mousemove", function(event) {
                return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            })
            .on("mouseout", function() {
                tooltip.style("visibility", "hidden");
            });

        
        // Add lines connecting the labels to the slices
        svg.selectAll('polylines')
            .data(data_ready)
            .enter()
            .append('polyline')
            .attr("stroke", "red")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
                var posA = arc.centroid(d); // line insertion in the slice
                var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
                var posC = outerArc.centroid(d); // Label position = almost the same as posB
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                if (d.data.target_ages === 'Older Kids') {  // Replace 'YourLabel' with the label of the slice you want to change
                    posC[0] = radius * 0.55 * (midangle < Math.PI ? -1 : 1); // Change the direction of the line
                } else {
                    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // Keep the original direction of the line
                }
                return [posA, posB, posC]
            });
        
        // Add labels outside the pie chart
        svg.selectAll('sliceLabels')
            .data(data_ready)
            .enter()
            .append('text')
            .text(function(d) { return d.data.target_ages; })
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                if (d.data.target_ages === 'Older Kids') {  // Replace 'YourLabel' with the label of the slice you want to change
                    pos[0] = radius * 0.99 * (midangle < Math.PI ? -1 : 1); // Change the direction of the label
                } else {
                    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1); // Keep the original direction of the label
                }
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end');
            })
            .style('fill', 'white');
        }
        updateChart();
        // Add event listener for select element
        select.on("change", function() {
            updateChart();
        
            // Dispatch a custom event
            var event = new CustomEvent("countryChanged");
            window.dispatchEvent(event);
        });
    }).catch(function(error) {
            console.log(error);
        });