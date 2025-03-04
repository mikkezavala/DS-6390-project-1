import * as d3 from "d3";
import {FC, useContext, useEffect, useRef, useState} from "react";
import useContainerSize from "../hooks/resizeHook";
import {BreastCancerRow, SunBurstCoords, SunBurstHierarchy, SunburstProps} from "../types";
import {Col, Form, Row, Select, Tag} from "antd";
import {normalizeLabel, prepareOptions} from "../util/common";
import {SchemeSwitcherContext} from "../providers/SchemeSwitcherContext";

const Sunburst: FC<SunburstProps> = ({data}) => {
    const {scheme} = useContext(SchemeSwitcherContext)
    const svgRef = useRef<SVGSVGElement | null>(null);
    const {containerRef, dimensions: containerDimensions} = useContainerSize();

    const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
    const [percentage, setPercentage] = useState<Record<string, number>>({});
    const sequenceOptions = [
        "Race_Ethnicity",
        "Age_Group",
        "Breast_Density",
        "Hormone_Replacement_Therapy",
        "Breast_Cancer_History",
        "BMI_Group",
        "Age_First_Birth"
    ]
    const [activeSequence, setActiveSequence] = useState<string[]>(sequenceOptions.slice(0, 3))

    useEffect(() => {
        if (!data.rows.length) return;

        const width = containerDimensions.width;
        const radius = width / 2;

        const buildHierarchy = (rows: BreastCancerRow[]) => {
            const root: SunBurstHierarchy = {name: "root", children: [] as any, value: 0};
            rows.forEach(row => {
                let currentLevel = root.children;
                const sequence = activeSequence.reduce((curr: string[], next) => {
                    curr.push(row[next].toString());
                    return curr
                }, []).filter(Boolean)
                sequence.forEach((name, i) => {
                    let existing = currentLevel.find((d: any) => d.name === name);
                    if (!existing) {
                        existing = {name, children: []};
                        currentLevel.push(existing);
                    }
                    if (i === sequence.length - 1) {
                        existing.value = (existing.value || 0) + row.Count;
                    }
                    currentLevel = existing.children;
                });
            });
            return d3.hierarchy(root).sum(d => d.value);
        };

        const root = buildHierarchy(data.rows);
        const partition = d3.partition<SunBurstHierarchy>().size([2 * Math.PI, radius]);
        partition(root);

        const arc = d3.arc<SunBurstCoords>()
            .startAngle(d => d.x0!)
            .endAngle(d => d.x1!)
            .innerRadius(d => d.y0!)
            .outerRadius(d => d.y1!);

        const svg = d3.select(svgRef.current);
        const color = d3.scaleOrdinal(scheme);

        svg.selectAll("*").remove();
        svg.attr("viewBox", `${-radius} ${-radius} ${width} ${width}`)
            .style("font", "12px sans-serif");

        const path = svg.append("g")
            .selectAll("path")
            .data(root.descendants().filter(d => d.depth))
            .join("path")
            .attr("fill", d => color(d.data.name))
            .attr("d", arc as any)
            .attr("stroke", "#fff")
            .style("cursor", "pointer")
            .on("mouseenter", function (_, d) {
                const sequence = d.ancestors().reverse().slice(1).map(d => d.data.name);
                percentage[d.data.name] = parseFloat(((100 * d.value!) / root.value!).toFixed(2));

                setBreadcrumbs(sequence);
                setPercentage(percentage);
                path.transition().duration(200)
                    .attr("fill-opacity", node => (sequence.includes(node.data.name) ? 1.0 : 0.3));
            })
            .on("mouseleave", () => {
                setBreadcrumbs([])
                setPercentage({});
                path.transition().duration(200).attr("fill-opacity", 1);
            });

    }, [data, containerDimensions, activeSequence, percentage, scheme]);

    const onSelectChange = (value: string[]) => {
        setActiveSequence(value)
    }

    const breadcrumbSizing = {
        height: 20,
        marginBottom: 20
    }
    const svgSizing = {
        width: containerDimensions.width,
        height: containerDimensions.height - (breadcrumbSizing.height + breadcrumbSizing.marginBottom) - 100,
        viewBoxHeight: containerDimensions.height - 50
    }

    return (
        <Row>
            <Col span={24}>
                <Form name="seq-cat-select">
                    <Form.Item<string>
                        label="Select Category"
                        name="seq-cat-select-item"
                        initialValue={activeSequence}
                    >
                        <Select
                            allowClear
                            mode="multiple"
                            style={{width: '80%'}}
                            onChange={onSelectChange}
                            placeholder="Select Risk Factors"
                            options={prepareOptions(sequenceOptions)}
                        />
                    </Form.Item>
                </Form>
            </Col>
            <Col span={24} style={{marginBottom: breadcrumbSizing.marginBottom, height: breadcrumbSizing.height}}>
                {activeSequence.length == 0 ?
                    <Tag color="magenta">Select Risk Factors</Tag> : breadcrumbs.map((crumb, index) => (
                        <Tag key={`crumb-${index}`}
                             color="magenta">{`${normalizeLabel(activeSequence[index])}: ${crumb}`}{percentage?.[crumb] &&
                            <b>{` - ${percentage[crumb]}%`}</b>}</Tag>
                    ))}
            </Col>
            <Col span={24} ref={containerRef} style={{width: "100%", minHeight: 727}}>
                <svg ref={svgRef} width={svgSizing.width} height={svgSizing.viewBoxHeight}
                     viewBox={`0 0 ${svgSizing.width} ${svgSizing.viewBoxHeight}`}/>
            </Col>
        </Row>
    );
};

export default Sunburst;
