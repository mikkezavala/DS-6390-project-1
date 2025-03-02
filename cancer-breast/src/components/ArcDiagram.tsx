import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { BreastCancerData } from "../types";

interface ArcDiagramProps {
    data: BreastCancerData[];
}

const ArcDiagram: React.FC<ArcDiagramProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("Breast Density");

    useEffect(() => {
        if (data.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 900, height = 500;
        const margin = 100;

        // ** Define Categories for Selection **
        const categories = ["Breast Density", "Menopause Status", "BMI Group"];

        // ** Nodes = All unique values from Age Group + Selected Category **
        const nodes = Array.from(
            new Set([...data.map(d => d["Age Group"]), ...data.map(d => d[selectedCategory as keyof BreastCancerData])])
        ).map(category => ({ id: category }));

        // ** Links = Connections between Age Group ↔ Selected Category **
        const links = data.map(d => ({
            source: d["Age Group"],
            target: d[selectedCategory as keyof BreastCancerData],
            strength: 1 // Simple count-based strength
        })).filter(link => link.source && link.target);

        // ** X-Axis Layout Scale **
        const x = d3.scalePoint()
            .domain(nodes.map(d => d.id))
            .range([margin, width - margin]);

        // ** Colors for Categories **
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(categories);

        // ** Draw Arcs (Links) **
        svg.selectAll("path")
            .data(links)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", d => colorScale(selectedCategory))
            .attr("stroke-width", 1.5)
            .attr("d", d => {
                const x1 = x(d.source as string);
                const x2 = x(d.target as string);
                return `M${x1},${height} A${Math.abs(x2 - x1) / 2},${Math.abs(x2 - x1) / 2} 0 0,1 ${x2},${height}`;
            });

        // ** Draw Nodes **
        svg.selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("cx", d => x(d.id))
            .attr("cy", height)
            .attr("r", 8)
            .attr("fill", d => d.id && d.id.startsWith("Age") ? "#ff6b6b" : "#69b3a2") // ✅ Safe check
            .on("mouseover", function (event, d) {
                d3.select(this).attr("fill", "#FFD700"); // Highlight node
                svg.selectAll("path")
                    .attr("stroke", link => (link.source === d.id || link.target === d.id) ? "#FFD700" : colorScale(selectedCategory));
            })
            .on("mouseout", function (_, d) {
                d3.select(this).attr("fill", d.id && d.id.startsWith("Age") ? "#ff6b6b" : "#69b3a2"); // ✅ Safe check
                svg.selectAll("path").attr("stroke", colorScale(selectedCategory));
            });

        // ** Labels for Nodes **
        svg.selectAll("text")
            .data(nodes)
            .join("text")
            .attr("x", d => x(d.id))
            .attr("y", height + 20)
            .attr("text-anchor", "middle")
            .text(d => d.id)
            .style("font-size", "12px");

    }, [data, selectedCategory]); // **Re-renders when data or category changes**

    return (
        <div>
            <div>
                <label>Select Category:</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="Breast Density">Breast Density</option>
                    <option value="Menopause Status">Menopause Status</option>
                    <option value="BMI Group">BMI Group</option>
                </select>
            </div>
            <svg ref={svgRef} width={900} height={500} />
        </div>
    );
};

export default ArcDiagram;
