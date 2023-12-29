let margin = {top: 70, right: 20, bottom: 20, left: 20};

    // Adjust width and height
    let width = 450 - margin.left - margin.right;
    let height = 450 - margin.top - margin.bottom;

    let svg = d3.select("#graph1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);
d3.csv("Data/data.csv",


       

            var slider = document.getElementById("myRange");
            slider.oninput = function() {
                var filteredData = data.filter(function(d) {
                    return d.year <= slider.value;
                });

                redrawGraph(filteredData);
            }

    