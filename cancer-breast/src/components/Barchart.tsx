import * as d3 from "d3";
import {FC, useEffect, useMemo, useRef} from "react";
import {BarchartProps} from "../types";
import {AGE_ORDER} from "../util/constant";

const Barchart: FC<BarchartProps> = ({data}) => {

    const margin = {top: 30, right: 30, bottom: 70, left: 60};
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const svgRef = useRef<SVGSVGElement | null>(null);

    const groupedData = useMemo(() => {
        const groups = data.rows.reduce((acc, row) => {
            if (!acc[row.Age_Group]) {
                acc[row.Age_Group] = {Age_Group: row.Age_Group, Count: 0};
            }
            acc[row.Age_Group].Count += row.Count;
            return acc;
        }, {} as Record<string, { Age_Group: string; Count: number }>);
        return Object.values(groups).sort((a, b) => AGE_ORDER.indexOf(a.Age_Group) - AGE_ORDER.indexOf(b.Age_Group));
    }, [data]);

    useEffect(() => {
        if (groupedData.length === 0) return;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const chart = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .domain(groupedData.map(d => d.Age_Group))
            .padding(0.2);

        chart.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        const y = d3.scaleLinear()
            .domain([0, d3.max(groupedData, (d) => d.Count) ?? 0])
            .nice()
            .range([height, 0]);

        chart.append("g").call(d3.axisLeft(y));

        const bars = chart.selectAll("rect")
            .data(groupedData)
            .join("rect")
            .attr("x", d => x(d.Age_Group)!)
            .attr("width", x.bandwidth())
            .attr("fill", "#69b3a2")
            .attr("height", 0)
            .attr("y", height);

        bars.transition()
            .duration(800)
            .attr("y", (d) => y(d.Count))
            .attr("height", (d) => height - y(d.Count))
            .delay(250);

    }, [data]);

    return <svg ref={svgRef} width={700} height={400}/>;
};

export default Barchart;
