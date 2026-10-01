// donut.js

// 1. Set up dimensions for the Donut Chart
const widthDonut = 400;
const heightDonut = 400;
const marginDonut = 20;

// The radius of the pieplot is half the width or half the height (smallest one)
const radius = Math.min(widthDonut, heightDonut) / 2 - marginDonut;

// 2. Append SVG object to the specific div
const svgDonut = d3.select("#donut-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${widthDonut} ${heightDonut}`)
    .append("g")
    .attr("transform", `translate(${widthDonut / 2},${heightDonut / 2})`);

// 3. Load the CSV data
d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv").then(function(data) {

    // Automatically detect column headers from the CSV
    const columns = Object.keys(data[0]);
    const categoryKey = columns[0]; // First column (e.g., Screen Type)
    const valueKey = columns[1]; // Second column (e.g., Energy Consumption)

    // 4. Set the color scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d[categoryKey]))
        .range(["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"]);

    // 5. Compute the position of each group on the pie
    const pie = d3.pie()
        .value(d => +d[valueKey])
        .sort(null);
    const data_ready = pie(data);

    // 6. Shape helper to build arcs
    const arcGenerator = d3.arc()
        .innerRadius(radius * 0.5) // This makes it a donut instead of a pie
        .outerRadius(radius);

    // 7. Build the slices
    svgDonut.selectAll("path")
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", d => color(d.data[categoryKey]))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.9);

    // 8. Add text labels
    svgDonut.selectAll("text")
        .data(data_ready)
        .enter()
        .append("text")
        .text(d => d.data[categoryKey])
        .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "white")
        .style("font-weight", "bold");

}).catch(function(error) {
    console.log("Error loading the Donut Chart data.", error);
});