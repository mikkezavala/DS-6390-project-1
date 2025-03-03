import * as d3 from "d3";
import {FC, useEffect, useMemo, useRef, useState} from "react";
import {BarchartProps, BreastCancerRow} from "../types";
import {AGE_ORDER} from "../util/constant";
import useContainerSize from "../hooks/resizeHook";
import {Flex, Form, Select, Tooltip} from "antd";

const Barchart: FC<BarchartProps> = ({data}) => {
    const margin = {top: 30, right: 30, bottom: 120, left: 60};
    const [tooltipContent, setTooltipContent] = useState<string>("");
    const svgRef = useRef<SVGSVGElement | null>(null);
    const {containerRef, dimensions: containerDimensions} = useContainerSize();

    const filterGroups = [
        "Age_Group", "Race_Ethnicity", "Breast_Density"
    ]
    const [activeGroup, setActiveGroup] = useState<string>("Age_Group")

    const groupedData = useMemo(() => {
        const groups = data.rows.reduce((acc, row) => {
            if (!acc[row[activeGroup]]) {
                acc[row[activeGroup]] = {ActiveGroup: row[activeGroup] as string, Count: 0};
            }
            acc[row[activeGroup]].Count += row.Count;
            return acc;
        }, {} as Record<string, { ActiveGroup: string; Count: number }>);
        return Object.values(groups).sort((a, b) => AGE_ORDER.indexOf(a.ActiveGroup) - AGE_ORDER.indexOf(b.ActiveGroup));
    }, [data, activeGroup]);

    useEffect(() => {
        if (groupedData.length === 0) return;
        const {width: containerWidth, height: containerHeight} = containerDimensions;

        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const chart = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .domain(groupedData.map(d => d.ActiveGroup))
            .padding(0.2);

        chart.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        const y = d3.scaleLinear()
            .domain([0, d3.max(groupedData, d => d.Count) ?? 0])
            .nice()
            .range([height, 0]);

        chart.append("g").call(d3.axisLeft(y));
        const colorScale = d3.scaleOrdinal(d3.schemeRdPu[7]).domain(groupedData.map(d => d.ActiveGroup));

        chart.selectAll("rect")
            .data(groupedData)
            .join("rect")
            .attr("x", d => x(d.ActiveGroup)!)
            .attr("width", x.bandwidth())
            .attr("fill", d => colorScale(d.ActiveGroup)!)
            .attr("height", 0)
            .attr("y", height)
            .each(function (d) {
                d3.select(this).attr("data-original-fill", colorScale(d.ActiveGroup)!);
            })
            .on("mouseover", function (_, d) {
                const bar = d3.select(this);

                bar.attr("data-original-fill", bar.attr("fill"))
                    .style("cursor", "pointer")
                    .transition().duration(200)
                    .attr("fill", "purple")
                    .attr("opacity", 0.35);
                setTooltipContent(`Age: ${d.ActiveGroup}, Count: ${d.Count}`);
            }).on("mouseleave", function () {
            const bar = d3.select(this)
            bar.transition().duration(200)
                .attr("fill", bar.attr("data-original-fill"))
                .attr("opacity", 1);
            setTooltipContent("");
        }).transition()
            .duration(800)
            .attr("y", d => y(d.Count))
            .attr("height", d => height - y(d.Count))
            .delay(250);

    }, [data, containerDimensions, groupedData, margin.left, margin.top, margin.right, margin.bottom, containerRef]);

    const onSelectChange = (value: string) => {
        setActiveGroup(value)
    }

    const selectOptions = filterGroups.map(option => {
        return {
            value: option,
            label: option.replace(/_/, " "),
        }
    })

    return (
        <Flex gap="middle" wrap vertical>
            <Form name="cat-select">
                <Form.Item<string>
                    label="Select Category"
                    name="category"
                >
                    <Select
                        style={{width: '50%'}}
                        defaultValue={activeGroup}
                        options={selectOptions}
                        onChange={onSelectChange}
                    />
                </Form.Item>
            </Form>
            <Flex wrap vertical ref={containerRef}
                  style={{width: "100%", maxHeight: containerDimensions.height, position: "relative"}}>
                <Tooltip title={tooltipContent} open={tooltipContent !== ""}>
                    <svg ref={svgRef} width={containerDimensions.width} height={containerDimensions.height}
                         viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}/>
                </Tooltip>
            </Flex>
        </Flex>
    );
};

export default Barchart;
