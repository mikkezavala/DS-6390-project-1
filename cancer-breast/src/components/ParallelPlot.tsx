import * as d3 from "d3";
import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {BreastCancerRow, ParallelPlotProps} from "../types";
import {normalize, normalizeLabel, prepareOptions} from "../util/common";
import {AGE_ORDER} from "../util/constant";
import useContainerSize from "../hooks/resizeHook";
import {Col, Form, Row, Select} from "antd";
import {ThemeSwitcherContext} from "../providers/ThemeSwitcherContext";
import {SchemeSwitcherContext} from "../providers/SchemeSwitcherContext";


const margin = {top: 50, right: 0, bottom: 50, left: 150};
const transition = {
    enter: 500,
    leave: 100,
}
const ParallelPlot: React.FC<ParallelPlotProps> = ({data}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const {themeCode} = useContext(ThemeSwitcherContext)
    const textColor = themeCode === 'light' ? 'black' : 'white';
    const strokeOff = themeCode === 'dark' ? '#484848' : 'lightgrey';
    const {scheme} = useContext(SchemeSwitcherContext)

    // Resize on Re-Render
    const {containerRef, dimensions: containerDimensions} = useContainerSize();

    const dimensions = [
        "Race_Ethnicity",
        "Age_Group",
        "Breast_Density",
        "Hormone_Replacement_Therapy",
        "Breast_Cancer_History",
        "BMI_Group",
        "Age_First_Birth"
    ]
    const [activeDimensions, setActiveDimension] = useState<string[]>(dimensions.slice(0, 4))
    const initialColor = activeDimensions?.[0]?.toString() || "Race_Ethnicity";

    const sortedData = useMemo(() => {
        return data?.rows.sort((a, b) => AGE_ORDER.indexOf(b.Age_Group) - AGE_ORDER.indexOf(a.Age_Group))
    }, [data]);

    const colorScale = d3.scaleOrdinal(scheme)
        .domain(Array.from(new Set(data.rows.map(d => d[initialColor]?.toString().trim() ?? "Unknown"))));

    useEffect(() => {

        if (sortedData.length === 0) return;
        const {width, height} = containerDimensions;
        // Let's prepare some variables
        const svg = d3.select(svgRef.current);
        const scales: { [key: string]: d3.ScalePoint<string> } = {};


        // Helper functions, sadly they need to be computed in rendering
        const line = d3.line<[number, number]>()
            .x(([x]) => x)
            .y(([, y]) => y);


        const highlight = (_: any, d: BreastCancerRow) => {
            const classSelector = `.${normalize(d, activeDimensions)}`;
            const field = (d as BreastCancerRow)[initialColor].toString() ?? "Unknown";

            d3.selectAll(".line")
                .transition().duration(transition.enter)
                .style("stroke", strokeOff)
                .style("opacity", 0.15)
                .style("stroke-opacity", 0.1);

            d3.selectAll(classSelector)
                .style("cursor", "pointer")
                .transition().duration(transition.enter)
                .style("stroke", colorScale(field))
                .style("stroke-width", 4)
                .style("stroke-opacity", 1.5);
        }

        const doNotHighlight = () => {
            d3.selectAll(".line")
                .transition().duration(transition.leave)
                .style("stroke", d => colorScale((d as BreastCancerRow)[initialColor].toString() ?? "Unknown"))
                .style("opacity", 1)
                .style("stroke-width", 4)
                .style("stroke-opacity", 1);
        }

        const xScale = d3.scalePoint()
            .domain(activeDimensions)
            .range([margin.left, width - margin.right]);

        activeDimensions.forEach(dim => {
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
            .attr("class", d => `line ${normalize(d, activeDimensions)}`)
            .attr("fill", "none")
            .attr("stroke", d => colorScale(d[initialColor]?.toString() ?? "Unknown"))
            .attr("stroke-opacity", 0.9)
            .attr("stroke-width", 1.5)
            .attr("d", d => {
                const mappedValues: [number, number][] = activeDimensions.map(dim => [
                    xScale(dim)!,
                    scales[dim]((d as Record<string, any>)[dim]?.toString() ?? "")!
                ]);
                return line(mappedValues) ?? "";
            })
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight);

        activeDimensions.forEach(dim => {
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

    }, [sortedData, containerDimensions, textColor, activeDimensions, scheme, initialColor, colorScale]);

    const onSelectChange = (value: string[]) => {
        setActiveDimension(value)
    }

    return (
        <Row ref={containerRef} style={{width: "100%", height: "100%", maxHeight: "500px", position: "relative"}}>
            <Col span={24}>
                <Form name="risk-parallel-select">
                    <Form.Item<string>
                        label="Select Risk"
                        name="risk-parallel-select-field"
                        initialValue={activeDimensions}
                    >
                        <Select
                            allowClear
                            mode="multiple"
                            style={{width: '80%'}}
                            onChange={onSelectChange}
                            placeholder="Select Risk Factors"
                            options={prepareOptions(dimensions)}
                        />
                    </Form.Item>
                </Form>
            </Col>
            <Col span={24}>
                <svg ref={svgRef} width={containerDimensions.width} height={containerDimensions.height}
                     viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}/>
            </Col>
        </Row>);
};

export default ParallelPlot;
