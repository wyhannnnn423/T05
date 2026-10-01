// bar.js

const marginBar = { top: 40, right: 20, bottom: 60, left: 60 };
const widthBar = 600 - marginBar.left - marginBar.right;
const heightBar = 400 - marginBar.top - marginBar.bottom;

const svgBar = d3.select("#bar-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${widthBar + marginBar.left + marginBar.right} ${heightBar + marginBar.top + marginBar.bottom}`)
    .append("g")
    .attr("transform", `translate(${marginBar.left},${marginBar.top})`);

d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv").then(function(data) {

    const columns = Object.keys(data[0]);
    const categoryCol = columns[0];
    const valueCol = columns[1];

    data.forEach(d => {
        d[valueCol] = +d[valueCol];
    });

    const x = d3.scaleBand()
        .domain(data.map(d => d[categoryCol]))
        .range([0, widthBar])
        .padding(0.3);

    svgBar.append("g")
        .attr("transform", `translate(0,${heightBar})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", "12px");

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[valueCol])])
        .range([heightBar, 0]);

    svgBar.append("g")
        .call(d3.axisLeft(y));

    // Plot the bars
    svgBar.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d[categoryCol]))
        .attr("y", d => y(d[valueCol]))
        .attr("width", x.bandwidth())
        .attr("height", d => heightBar - y(d[valueCol]))
        .attr("fill", "#4CAF50")
        .style("opacity", 0.9);

    // ADDED: Direct Data Labels on top of the bars to reduce cognitive load
    svgBar.selectAll(".data-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "data-label")
        .attr("x", d => x(d[categoryCol]) + x.bandwidth() / 2)
        .attr("y", d => y(d[valueCol]) - 8) // Slightly above the bar
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(d => Math.round(d[valueCol])); // Show the exact number

    // Axis labels
    svgBar.append("text")
        .attr("text-anchor", "middle")
        .attr("x", widthBar / 2)
        .attr("y", heightBar + marginBar.bottom - 15)
        .text(categoryCol);

    svgBar.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -marginBar.left + 15)
        .attr("x", -heightBar / 2)
        .text(valueCol);

}).catch(function(error) {
    console.log("Error loading the Bar Chart CSV data.", error);
});