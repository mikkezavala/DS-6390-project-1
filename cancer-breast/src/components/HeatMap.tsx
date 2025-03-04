import {FC, useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import {TabProps} from "../types";
import {DIMENSIONS} from "../util/constant";
import {correlationMatrix, normalizeLabel, prepareOptions} from "../util/common";
import useContainerSize from "../hooks/resizeHook";
import {Col, Form, Row, Select, theme} from "antd";


const margin = {top: 5, right: 20, bottom: 180, left: 100};

export const HeatMap: FC<TabProps> = ({ data }) => {
    const { useToken } = theme;
    const svgRef = useRef<SVGSVGElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    const { token } = useToken();
    const { containerRef, dimensions: containerDimensions } = useContainerSize();

    const [activeDimensions, setActiveDimension] = useState<string[]>(DIMENSIONS.slice(0, 4))

    const corrMatrix = correlationMatrix(data.rows, activeDimensions);

    useEffect(() => {
        if (!svgRef.current || !tooltipRef.current) return;

        const { width, height } = containerDimensions;
        const svg = d3.select(svgRef.current);

        svg.selectAll("*").remove();
        const xScale = d3.scaleBand().domain(activeDimensions).range([margin.left, width - margin.right]).padding(0.05);
        const yScale = d3.scaleBand().domain(activeDimensions).range([margin.top, height - margin.bottom]).padding(0.05);
        const colorScale = d3.scaleSequential(d3.interpolateBuPu).domain([0, 1]);
        const tooltip = d3.select(tooltipRef.current).style("display", "none");

        svg.append("g").attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale)
                .tickSize(0)
                .tickFormat(d => normalizeLabel(d.toString()))
            ).selectAll("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-25)");

        svg.append("g").attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale)
                .tickSize(0)
                .tickFormat(d => normalizeLabel(d.toString()))
            ).select(".domain").remove();

        svg.selectAll("rect").data(corrMatrix).join("rect")
            .attr("x", d => xScale(d.x)!)
            .attr("y", d => yScale(d.y)!)
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("fill", d => colorScale(d.correlation))
            .attr("stroke", token.colorBorder)
            .on("mouseover", function (event, d) {
                const label = `${d.x} - ${d.y}: ${d.correlation.toFixed(2)}`
                d3.select(this)
                    .style("opacity", 1)
                    .attr("fill", token.colorPrimary)
                    .style("cursor", "pointer");

                tooltip
                    .style("display", "block")
                    .html(normalizeLabel(label))
                    .style("left", `${event.pageX - 20}px`)
                    .style("top", `${event.pageY - 200}px`);
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", `${event.pageX - 20}px`)
                    .style("top", `${event.pageY - 200}px`);
            })
            .on("mouseleave", function () {
                d3.select(this)
                    .style("opacity", 1)
                    .attr("fill", d => colorScale((d as any).correlation));

                tooltip.style("display", "none");
            });
    }, [activeDimensions, containerDimensions, corrMatrix, token]);

    const onSelectChange = (value: string[]) => {
        setActiveDimension(value)
    }

    return (
        <Row ref={containerRef} style={{width: "100%", height: "100%", minHeight: 500, maxHeight: 700}}>
            <Col span={24}>
                <Form name="heatmap-parallel-select">
                    <Form.Item<string>
                        label="Select Risk Categories"
                        name="risk-parallel-select-field"
                        initialValue={activeDimensions}
                    >
                        <Select
                            allowClear
                            mode="multiple"
                            style={{width: '80%'}}
                            onChange={onSelectChange}
                            placeholder="Select Risk Factors"
                            options={prepareOptions(DIMENSIONS)}
                        />
                    </Form.Item>
                </Form>
            </Col>
            <Col span={24}>
                <svg ref={svgRef} width={containerDimensions.width} height={containerDimensions.height - 50}
                     viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height - 50}`}/>
                <div ref={tooltipRef}
                     style={{
                         color: token.colorTextBase,
                         position: "absolute",
                         background: token.colorBgElevated,
                         padding: token.paddingSM,
                         borderRadius: token.borderRadius,
                         display: "none",
                         pointerEvents: "none",
                     }}
                />
            </Col>

        </Row>
    );
};
