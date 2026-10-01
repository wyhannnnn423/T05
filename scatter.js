// scatter.js

// 1. Set up dimensions and margins for the SVG canvas
const marginScatter = { top: 40, right: 40, bottom: 60, left: 60 };
const widthScatter = 600 - marginScatter.left - marginScatter.right;
const heightScatter = 400 - marginScatter.top - marginScatter.bottom;

// 2. Append SVG to the specific div container
const svgScatter = d3.select("#scatter-plot")
    .append("svg")
    .attr("viewBox", `0 0 ${widthScatter + marginScatter.left + marginScatter.right} ${heightScatter + marginScatter.top + marginScatter.bottom}`)
    .append("g")
    .attr("transform", `translate(${marginScatter.left},${marginScatter.top})`);

// 3. Load and process the CSV data
d3.csv("data/Ex5_TV_energy.csv").then(function(data) {

    // Automatically detect the correct column names by searching for keywords
    const columns = Object.keys(data[0]);
    const starCol = columns.find(c => c.toLowerCase().includes("star"));
    const energyCol = columns.find(c => c.toLowerCase().includes("energy"));

    // Format data: Convert string values to numbers using the detected columns
    data.forEach(d => {
        d.StarRating = +d[starCol];
        d.EnergyConsumption = +d[energyCol];
    });

    // Filter out rows with missing or invalid data
    const cleanData = data.filter(d => !isNaN(d.StarRating) && !isNaN(d.EnergyConsumption));

    // 4. Create X and Y scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(cleanData, d => d.StarRating)])
        .range([0, widthScatter]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(cleanData, d => d.EnergyConsumption)])
        .range([heightScatter, 0]);

    // 5. Add the X and Y axes to the SVG
    svgScatter.append("g")
        .attr("transform", `translate(0,${heightScatter})`)
        .call(d3.axisBottom(x));

    svgScatter.append("g")
        .call(d3.axisLeft(y));

    // 6. Plot the data points (dots)
    svgScatter.selectAll("circle")
        .data(cleanData)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.StarRating))
        .attr("cy", d => y(d.EnergyConsumption))
        .attr("r", 4) // Radius of the dot
        .style("fill", "#2196F3") // Blue color
        .style("opacity", 0.6);

    // 7. Add axis labels
    svgScatter.append("text")
        .attr("text-anchor", "middle")
        .attr("x", widthScatter / 2)
        .attr("y", heightScatter + marginScatter.bottom - 15)
        .text("Star Rating");

    svgScatter.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -marginScatter.left + 15)
        .attr("x", -heightScatter / 2)
        .text("Energy Consumption (kWh)");

}).catch(function(error) {
    console.log("Error loading the CSV file.", error);
});