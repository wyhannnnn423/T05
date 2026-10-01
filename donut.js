// donut.js

const widthDonut = 400;
const heightDonut = 400;
const marginDonut = 20;

const radius = Math.min(widthDonut, heightDonut) / 2 - marginDonut;

const svgDonut = d3.select("#donut-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${widthDonut} ${heightDonut}`)
    .append("g")
    .attr("transform", `translate(${widthDonut / 2},${heightDonut / 2})`);

d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv").then(function(data) {

    const columns = Object.keys(data[0]);
    const categoryKey = columns[0];
    const valueKey = columns[1];

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d[categoryKey]))
        .range(["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"]);

    const pie = d3.pie()
        .value(d => +d[valueKey])
        .sort(null);
    const data_ready = pie(data);

    const arcGenerator = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius);

    svgDonut.selectAll("path")
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", d => color(d.data[categoryKey]))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.9);

    // ADDED: Two-line text labels showing both Category and Exact Value
    const text = svgDonut.selectAll("text")
        .data(data_ready)
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "white")
        .style("font-weight", "bold");

    text.append("tspan")
        .attr("x", 0)
        .attr("y", "-0.2em")
        .text(d => d.data[categoryKey]);

    text.append("tspan")
        .attr("x", 0)
        .attr("y", "1.2em")
        .text(d => Math.round(d.data[valueKey])); // Show the exact number

}).catch(function(error) {
    console.log("Error loading the Donut Chart data.", error);
});