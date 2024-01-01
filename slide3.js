d3.csv("Data/slide3.csv").then(data => {
    // Get the select element
    var select = d3.select("#select");

    // Create options for each title in the data
    select.selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .text(d => d.title); // Assuming 'title' is the column name in your CSV

    // Add event listener for select element
    select.on("change", function() {
        var selectedTitle = this.value;
        var selectedData = data.find(d => d.title === selectedTitle);

    // Display title, country, rating, and description in #slide3
    d3.select("#slide3").html(`
        <p style="color: white;
            margin-top: 80px;
            margin-left: 80px;
            font-size: 60px">Title: ${selectedData.title}</p>
            <hr style="width: 1400px">

        
        <p style="color: white;
            font-size: 20px; 
            margin-top: 10px;
            margin-left: 10px;">* Country: ${selectedData.country}</p>

        
        <p style="color: white;
            font-size: 20px; 
            margin-top: 10px;
            margin-left: 10px;">* Year: ${selectedData.release_year}</p>


        <p style="color: white;
            font-size: 20px; 
            margin-top: 10px;
            margin-left: 10px;">* Director: ${selectedData.director}</p>

        <p style="color: white;
            font-size: 40px; 
            margin-top: 170px;
            margin-left: 20px;">Description: ${selectedData.description}</p>
        
    `);
    });
});