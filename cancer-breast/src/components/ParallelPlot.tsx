import * as d3 from "d3";
import {useEffect, useRef} from "react";
import {BreastCancerRow, ParallelPlotProps} from "../types";
import {normalize} from "../util/common";


const width = 900;
const height = 500;
const margin = {top: 50, right: 50, bottom: 50, left: 100};

const ParallelPlot: React.FC<ParallelPlotProps> = ({data}) => {
    const initialColor = "Race_Ethnicity"
    const svgRef = useRef<SVGSVGElement | null>(null);

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10)
        .domain(Array.from(new Set(data.rows.map(d => d[initialColor]?.toString().trim() ?? "Unknown"))));

    const highlight = (_: any, d: BreastCancerRow) => {
        const classSelector = `.${normalize(d, ["Race_Ethnicity", "Age_Group"])}`;

        d3.selectAll(".line")
            .transition().duration(350)
            .style("stroke", "lightgrey")
            .style("opacity", 0.15)
            .style("stroke-opacity", 0.1);

        d3.selectAll(classSelector)
            .transition().duration(150)
            .style("stroke", colorScale(d[initialColor] ?? "Unknown"))
            .style("stroke-width", 4)
            .style("stroke-opacity", 1.5);
    }

    const doNotHighlight = () => {
        d3.selectAll(".line")
            .transition().duration(500)
            .style("stroke", d => colorScale((d as BreastCancerRow)[initialColor] ?? "Unknown"))
            .style("stroke-width", 1.5)
            .style("stroke-opacity", 1);
    }

    useEffect(() => {
        if (data.rows.length === 0) return;
        const svg = d3.select(svgRef.current);
        const dimensions = ["Race_Ethnicity", "Age_Group", "Hormone_Replacement_Therapy", "Breast_Density"];
        const xScale = d3.scalePoint()
            .domain(dimensions)
            .range([margin.left, width - margin.right]);

        const scales: { [key: string]: d3.ScalePoint<string> } = {};

        const line = d3.line<[number, number]>()
            .x(([x]) => x)
            .y(([, y]) => y);

        dimensions.forEach(dim => {
            const uniqueValues = Array.from(new Set(
                data.rows.map(d => d[dim as keyof BreastCancerRow]?.toString().trim())
            ));
            scales[dim] = d3.scalePoint()
                .domain(uniqueValues)
                .range([height - margin.bottom, margin.top]);
        });

        svg.selectAll("*").remove();
        svg.append("g")
            .selectAll("path")
            .data(data.rows)
            .join("path")
            .attr("class", d => `line ${normalize(d, ["Race_Ethnicity", "Age_Group"])}`)
            .attr("fill", "none")
            .attr("stroke", d => colorScale(d[initialColor]?.toString() ?? "Unknown"))
            .attr("stroke-opacity", 0.9)
            .attr("stroke-width", 1.5)
            .attr("d", d => {
                const mappedValues: [number, number][] = dimensions.map(dim => [
                    xScale(dim)!,
                    scales[dim]((d as Record<string, any>)[dim]?.toString() ?? "")!
                ]);
                return line(mappedValues) ?? "";
            })
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight);


        dimensions.forEach(dim => {
            svg.append("g")
                .attr("transform", `translate(${xScale(dim)},0)`)
                .call(d3.axisLeft(scales[dim]))
                .append("text")
                .attr("y", margin.top - 10)
                .attr("x", -5)
                .attr("text-anchor", "end")
                .text(dim)
                .style("font-size", "12px")
                .style("fill", "black");
        });

    }, [data]);

    return <svg ref={svgRef} width={900} height={500}/>;
};

export default ParallelPlot;
