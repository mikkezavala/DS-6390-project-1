import * as d3 from "d3";
import {FC, useEffect, useRef, useState} from "react";
import useContainerSize from "../hooks/resizeHook";
import {BreastCancerRow, SunBurstCoords, SunBurstHierarchy, SunburstProps} from "../types";
import {Flex, Tag} from "antd";

const Sunburst: FC<SunburstProps> = ({data}) => {
    const {containerRef, dimensions: containerDimensions} = useContainerSize();
    const svgRef = useRef<SVGSVGElement | null>(null);

    const [percentage, setPercentage] = useState<Record<string, number>>({});
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);


    useEffect(() => {
        if (!data.rows.length) return;

        const width = containerDimensions.width;
        const radius = width / 2;

        const buildHierarchy = (rows: BreastCancerRow[]) => {
            const root: SunBurstHierarchy = {name: "root", children: [] as any, value: 0};
            rows.forEach(row => {
                let currentLevel = root.children;
                const sequence = [row.Race_Ethnicity, row.Age_Group, row.Breast_Density].filter(Boolean);
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
        const color = d3.scaleOrdinal(d3.schemeRdPu[3]);

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

    }, [data, containerDimensions]);

    const breadcrumbSizing = {
        height: 40,
        marginBottom: 20
    }
    const svgSizing = {
        width: containerDimensions.width,
        height: 500 - (breadcrumbSizing.height < 0 ? 0: breadcrumbSizing.height),
        viewBoxHeight: 500
    }

    return (
        <div ref={containerRef} style={{width: "100%", maxHeight: "500px"}}>
            <Flex gap="4px" style={{marginBottom: breadcrumbSizing.marginBottom}}>
                {breadcrumbs.length == 0 ? <Tag color="magenta">Hover the plot</Tag> : breadcrumbs.map((crumb, index) => (
                    <Tag key={`crumb-${index}`} color="magenta">{crumb} {percentage?.[crumb] &&
                        <span style={{fontWeight: "bold"}}>{`${percentage[crumb]}%`}</span>}</Tag>
                ))}
            </Flex>
            <Flex>
                <svg ref={svgRef} width={svgSizing.width} height={svgSizing.height}
                     viewBox={`0 0 ${svgSizing.width} ${svgSizing.viewBoxHeight}`}/>
            </Flex>
        </div>
    );
};

export default Sunburst;
