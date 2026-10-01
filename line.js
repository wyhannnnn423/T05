// line.js

const marginLine = { top: 40, right: 20, bottom: 60, left: 60 };
const widthLine = 600 - marginLine.left - marginLine.right;
const heightLine = 400 - marginLine.top - marginLine.bottom;

const svgLine = d3.select("#line-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${widthLine + marginLine.left + marginLine.right} ${heightLine + marginLine.top + marginLine.bottom}`)
    .append("g")
    .attr("transform", `translate(${marginLine.left},${marginLine.top})`);

d3.csv("data/Ex5_ARE_Spot_Prices.csv").then(function(data) {

    // Automatically detect the columns (Year and Price)
    const columns = Object.keys(data[0]);
    const yearCol = columns[0];
    const priceCol = columns[1];

    // Convert values to numbers
    data.forEach(d => {
        d[yearCol] = +d[yearCol];
        d[priceCol] = +d[priceCol];
    });

    // Filter valid data
    const cleanData = data.filter(d => !isNaN(d[yearCol]) && !isNaN(d[priceCol]));

    // X axis (Years)
    const x = d3.scaleLinear()
        .domain(d3.extent(cleanData, d => d[yearCol]))
        .range([0, widthLine]);

    // Format the x-axis ticks to remove commas from years (e.g., 2020 instead of 2,020)
    svgLine.append("g")
        .attr("transform", `translate(0,${heightLine})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Y axis (Price)
    const y = d3.scaleLinear()
        .domain([0, d3.max(cleanData, d => d[priceCol])])
        .range([heightLine, 0]);

    svgLine.append("g")
        .call(d3.axisLeft(y));

    // Define the line generator
    const lineGenerator = d3.line()
        .x(d => x(d[yearCol]))
        .y(d => y(d[priceCol]));

    // Draw the line
    svgLine.append("path")
        .datum(cleanData)
        .attr("fill", "none")
        .attr("stroke", "#FF9800") // Orange color
        .attr("stroke-width", 2.5)
        .attr("d", lineGenerator);

    // Axis labels
    svgLine.append("text")
        .attr("text-anchor", "middle")
        .attr("x", widthLine / 2)
        .attr("y", heightLine + marginLine.bottom - 15)
        .text(yearCol);

    svgLine.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -marginLine.left + 15)
        .attr("x", -heightLine / 2)
        .text(priceCol);

}).catch(function(error) {
    console.log("Error loading the Line Chart CSV data.", error);
});