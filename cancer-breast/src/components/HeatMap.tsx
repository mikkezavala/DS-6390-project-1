import {FC, useEffect, useRef} from "react";
import * as d3 from "d3";
import {TabProps} from "../types";
import {DIMENSIONS} from "../util/constant";
import {correlationMatrix} from "../util/common";
import useContainerSize from "../hooks/resizeHook";
import {Col, Form, Row} from "antd";


const margin = {top: 50, right: 20, bottom: 50, left: 100};

export const HeatMap: FC<TabProps> = ({data}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const corrMatrix = correlationMatrix(data.rows, DIMENSIONS);
    const {containerRef, dimensions: containerDimensions} = useContainerSize();

    useEffect(() => {
        if (!svgRef.current) return;

        const {width, height} = containerDimensions;
        const svg = d3.select(svgRef.current);

        svg.selectAll("*").remove();
        const xScale = d3.scaleBand().domain(DIMENSIONS).range([margin.left, width - margin.right]).padding(0.05);
        const yScale = d3.scaleBand().domain(DIMENSIONS).range([margin.top, height - margin.bottom]).padding(0.05);
        const colorScale = d3.scaleSequential(d3.interpolateBuPu).domain([0, 1]);

        svg.append("g").attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickSize(0)).select(".domain").remove();

        svg.append("g").attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale).tickSize(0)).select(".domain").remove();

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "white")
            .style("border", "solid 1px black")
            .style("padding", "5px")
            .style("border-radius", "5px");

        svg.selectAll("rect").data(corrMatrix).join("rect")
            .attr("x", d => xScale(d.x)!)
            .attr("y", d => yScale(d.y)!)
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("fill", d => colorScale(d.correlation))
            .attr("stroke", "white")
            .on("mouseover", function (event, d) {
                d3.select(this).style("stroke", "black").style("opacity", 1);
                tooltip.style("opacity", 1).html(`Correlation: ${d.correlation.toFixed(2)}`)
                    .style("left", (event.pageX + 10))
                    .style("top", (event.pageY - 10));
            })
            .on("mousemove", function (event) {
                tooltip.style("left", (event.pageX + 10))
                    .style("top", (event.pageY - 10));
            })
            .on("mouseleave", function () {
                d3.select(this).style("stroke", "white").style("opacity", 0.8);
                tooltip.style("opacity", 0);
            });

    }, [containerDimensions, corrMatrix]);

    return (
        <Row ref={containerRef} style={{width: "100%", height: "100%", maxHeight: "500px", position: "relative"}}>
            <Col span={24}>
                <Form name="risk-parallel-select">
                    {/*<Form.Item<string>*/}
                    {/*    label="Select Risk"*/}
                    {/*    name="risk-parallel-select-field"*/}
                    {/*    initialValue={activeDimensions}*/}
                    {/*>*/}
                    {/*    <Select*/}
                    {/*        allowClear*/}
                    {/*        mode="multiple"*/}
                    {/*        style={{width: '80%'}}*/}
                    {/*        onChange={onSelectChange}*/}
                    {/*        placeholder="Select Risk Factors"*/}
                    {/*        options={prepareOptions(dimensions)}*/}
                    {/*    />*/}
                    {/*</Form.Item>*/}
                </Form>
            </Col>
            <Col span={24}>
                <svg ref={svgRef} width={containerDimensions.width} height={containerDimensions.height}
                     viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}/>
            </Col>
        </Row>
    );
};
