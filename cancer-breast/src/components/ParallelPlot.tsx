import * as d3 from "d3";
import React, {useContext, useEffect, useMemo, useRef} from "react";
import {BreastCancerRow, ParallelPlotProps} from "../types";
import {normalize, normalizeLabel} from "../util/common";
import {AGE_ORDER} from "../util/constant";
import useContainerSize from "../hooks/resizeHook";
import {Flex} from "antd";
import {ThemeSwitcherContext} from "../providers/ThemeSwitcherContext";


const margin = {top: 50, right: 0, bottom: 50, left: 150};
const ParallelPlot: React.FC<ParallelPlotProps> = ({data}) => {
    const initialColor = "Race_Ethnicity"
    const svgRef = useRef<SVGSVGElement | null>(null);

    const {themeCode} = useContext(ThemeSwitcherContext)
    const textColor = themeCode === 'light' ? 'black' : 'white';

    // Resize on Re-Render
    const {containerRef, dimensions: containerDimensions} = useContainerSize();

    const colorScale = d3.scaleOrdinal(d3.schemePaired)
        .domain(Array.from(new Set(data.rows.map(d => d[initialColor]?.toString().trim() ?? "Unknown"))));

    const sortedData = useMemo(() => {
        return data?.rows.sort((a, b) => AGE_ORDER.indexOf(b.Age_Group) - AGE_ORDER.indexOf(a.Age_Group))
    }, [data]);

    useEffect(() => {
        if (sortedData.length === 0) return;
        const {width, height} = containerDimensions;
        // Let's prepare some variables
        const svg = d3.select(svgRef.current);
        const scales: { [key: string]: d3.ScalePoint<string> } = {};
        const dimensions = ["Race_Ethnicity", "Age_Group", "Hormone_Replacement_Therapy", "Breast_Density"];

        // Helper functions, sadly they need to be computed in rendering
        const line = d3.line<[number, number]>()
            .x(([x]) => x)
            .y(([, y]) => y);

        const highlight = (_: any, d: BreastCancerRow) => {
            const classSelector = `.${normalize(d, ["Race_Ethnicity", "Age_Group"])}`;

            d3.selectAll(".line")
                .transition().duration(350)
                .style("stroke", "lightgrey")
                .style("opacity", 0.15)
                .style("stroke-opacity", 0.1);

            d3.selectAll(classSelector)
                .style("cursor", "pointer")
                .transition().duration(150)
                .style("stroke", colorScale(d[initialColor] ?? "Unknown"))
                .style("stroke-width", 4)
                .style("stroke-opacity", 1.5);
        }

        const doNotHighlight = () => {
            d3.selectAll(".line")
                .transition().duration(500)
                .style("stroke", d => colorScale((d as BreastCancerRow)[initialColor] ?? "Unknown"))
                .style("opacity", 1)
                .style("stroke-width", 4)
                .style("stroke-opacity", 1);
        }

        const xScale = d3.scalePoint()
            .domain(dimensions)
            .range([margin.left, width - margin.right]);

        dimensions.forEach(dim => {
            const uniqueValues = Array.from(new Set(
                sortedData.map(d => d[dim as keyof BreastCancerRow]?.toString().trim())
            ));
            scales[dim] = d3.scalePoint()
                .domain(uniqueValues)
                .range([height - margin.bottom, margin.top]);
        });

        svg.selectAll("*").remove();
        svg.append("g")
            .selectAll("path")
            .data(sortedData)
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
                .attr("y", margin.top - 40)
                .attr("x", -5)
                .attr("text-anchor", "end")
                .text(normalizeLabel(dim))
                .style("font-size", "14px")
                .style("fill", textColor);
        });

    }, [sortedData, containerDimensions, colorScale, textColor]);

    return (
        <Flex ref={containerRef} style={{width: "100%", height: "100%", maxHeight: "500px", position: "relative"}}>
            <svg ref={svgRef} width={containerDimensions.width} height={containerDimensions.height}
                 viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}/>
        </Flex>
    );
};

export default ParallelPlot;
