import {FC, useContext, useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import {SummaryStatistics, TabProps} from "../types";
import useContainerSize from "../hooks/resizeHook";
import {Col, Form, Row, Select, theme} from "antd";
import {SchemeSwitcherContext} from "../providers/SchemeSwitcherContext";
import {normalizeLabel, prepareOptions} from "../util/common";
import {DIMENSIONS} from "../util/constant";

const margin = {top: 150, right: 30, bottom: 180, left: 70};

export const BoxPlot: FC<TabProps> = ({data}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const {containerRef, dimensions: containerDimensions} = useContainerSize();

    const [categoryKey, setCategoryKey] = useState<string>("Age_Group");
    const [valueKey, setValueKeyKey] = useState<string>("Breast_Density");

    const {useToken} = theme;
    const {token} = useToken();
    const {scheme} = useContext(SchemeSwitcherContext)

    useEffect(() => {
        if (!svgRef.current || !tooltipRef.current) return;

        const normalizedVal = normalizeLabel(valueKey);
        const normalizedCat = normalizeLabel(categoryKey);

        const {width, height} = containerDimensions;

        const svg = d3.select(svgRef.current);
        const aggregatedData = d3.rollup(data.rows, v => v.length, d => d[categoryKey], d => d[valueKey]);

        const summaryStats: SummaryStatistics[] = Array.from(aggregatedData, ([key, valueMap]) => {
            const counts = Array.from(valueMap.values());
            counts.sort(d3.ascending);

            const q1 = d3.quantile(counts, 0.25) ?? 0;
            const median = d3.quantile(counts, 0.5) ?? 0;
            const q3 = d3.quantile(counts, 0.75) ?? 0;
            const iqr = q3 - q1;
            const min = Math.max(d3.min(counts) ?? 0, q1 - 1.5 * iqr);
            const max = Math.min(d3.max(counts) ?? 0, q3 + 1.5 * iqr);

            return {key, q1, median, q3, iqr, min, max, values: counts};
        }) as SummaryStatistics[];

        svg.selectAll("*").remove();
        const xScale = d3.scaleBand()
            .domain(summaryStats.map(d => d.key) as string[])
            .range([margin.left, width - margin.right])
            .padding(0.4);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(summaryStats, d => d.max) ?? 100])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const colorScale = d3.scaleOrdinal(scheme);

        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-45)");

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale));

        const tooltip = d3.select(tooltipRef.current).style("position", "fixed");

        svg.selectAll(".whisker")
            .data(summaryStats)
            .enter()
            .append("line")
            .attr("x1", d => xScale(d.key)! + xScale.bandwidth() / 2)
            .attr("x2", d => xScale(d.key)! + xScale.bandwidth() / 2)
            .attr("y1", d => yScale(d.min))
            .attr("y2", d => yScale(d.max))
            .attr("stroke", token.colorBorder);

        svg.selectAll(".box")
            .data(summaryStats)
            .enter()
            .append("rect")
            .attr("x", d => xScale(d.key)!)
            .attr("y", d => yScale(d.q3))
            .attr("width", xScale.bandwidth())
            .attr("height", d => yScale(d.q1) - yScale(d.q3))
            .attr("fill", d => colorScale(d.key))
            .attr("opacity", 0.5)
            .attr("stroke", "black").on("mouseover", function (event, d) {
            tooltip.style("display", "block")
                .style("opacity", 1)
                .html(`
                        <strong>${d.key}</strong><br>
                        Min: ${d.min} <br>
                        Q1: ${d.q1} <br>
                        Median: ${d.median} <br>
                        Q3: ${d.q3} <br>
                        Max: ${d.max}
                    `)
                .style("left", `${event.clientX + 10}px`)
                .style("top", `${event.clientY - 30}px`);
        }).on("mousemove", function (event) {
            tooltip
                .style("left", `${event.clientX + 10}px`)
                .style("top", `${event.clientY - 30}px`);
        })
            .on("mouseleave", function () {
                tooltip.style("opacity", 0);
            }).selectAll(".median-line")
            .data(summaryStats)
            .enter()
            .append("line")
            .attr("x1", d => xScale(d.key)!)
            .attr("x2", d => xScale(d.key)! + xScale.bandwidth())
            .attr("y1", d => yScale(d.median))
            .attr("y2", d => yScale(d.median))
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        const jitterWidth = 10;
        svg.selectAll(".points")
            .data(data.rows)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[categoryKey] as string)! + Math.random() * jitterWidth - jitterWidth / 2)
            .attr("cy", d => yScale(aggregatedData.get(d[categoryKey])?.get(d[valueKey]) ?? 0))
            .attr("r", 4)
            .attr("fill", d => colorScale(d[categoryKey] as string))
            .attr("stroke", "black");

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height - margin.bottom + 70)
            .attr("fill", token.colorText)
            .text(normalizedCat);

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", margin.left / 3)
            .attr("transform", "rotate(-90)")
            .attr("fill", token.colorText)
            .text(`Frequency of ${normalizedVal}`);

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .attr("fill", token.colorText)
            .text(`Boxplot of ${normalizedVal} by ${normalizedCat}`);

    }, [categoryKey, valueKey, containerDimensions, data.rows, scheme, token.colorBorder, token.colorText]);

    const onSelectCatChange = (value: string) => {
        setCategoryKey(value)
    }
    const onSelectValChange = (value: string) => {
        setValueKeyKey(value)
    }

    return (
        <Row ref={containerRef} style={{width: "100%", minHeight: 700, maxHeight: 700, position: "relative"}}>
            <Col span={24}>
                <Form name="boxplot-parallel-select" layout="inline">
                    <Form.Item<string>
                        label="Select Risk Categories"
                        name="risk-boxplot-select-cat"
                        initialValue={categoryKey}
                    >
                        <Select
                            onChange={onSelectCatChange}
                            placeholder="Select Risk Factors"
                            options={prepareOptions(DIMENSIONS)}
                        />
                    </Form.Item>
                    <Form.Item<string>
                        label="Select Risk Frequency"
                        name="risk-boxplot-select-val"
                        initialValue={valueKey}
                    >
                        <Select
                            style={{minWidth: 150}}
                            onChange={onSelectValChange}
                            placeholder="Select Risk Factors"
                            options={prepareOptions(DIMENSIONS)}
                        />
                    </Form.Item>

                </Form>
            </Col>
            <Col span={24}>
                <svg ref={svgRef} width={containerDimensions.width} height={containerDimensions.height}
                     viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}/>
            </Col>
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
        </Row>
    );
};
