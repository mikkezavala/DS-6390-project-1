import {Card, Col, Divider, Row} from "antd";
import Barchart from "../components/Barchart";
import SequenceSunburst from "../components/SequenceSunburst";
import ParallelPlot from "../components/ParallelPlot";
import {useEffect, useMemo, useState} from "react";
import {BreastCancerData, BreastCancerRow} from "../types";
import * as d3 from "d3";
import {AGE_ORDER} from "../util/constant";


export const Home = () => {
    const [data, setData] = useState<BreastCancerData>({meta: {count: 0}, rows: []} as BreastCancerData);

    useEffect(() => {
        d3.csv("/DS-6390-project-1/assets/risk_factors_reduced_named.csv").then((csvData) => {
            setData({
                meta: {count: csvData?.length || 0}, rows: csvData.map(d => ({
                    Year: d["Year"],
                    Age_Group: d["Age_Group"],
                    Race_Ethnicity: d["Race_Ethnicity"],
                    First_Degree_History: d["First_Degree_History"],
                    Age_Menarche: d["Age_Menarche"],
                    Age_First_Birth: d["Age_First_Birth"],
                    Breast_Density: d["Breast_Density"],
                    Hormone_Replacement_Therapy: d["Hormone_Replacement_Therapy"],
                    Menopause_Status: d["Menopause_Status"],
                    BMI_Group: d["BMI_Group"],
                    Biopsy_History: d["Biopsy_History"],
                    Breast_Cancer_History: d["Breast_Cancer_History"],
                    Count: +d.Count || 0,
                })) as BreastCancerRow[]
            });
        });
    }, []);

    const chartData = useMemo(() => {
        if (!data || !data.rows) return data;
        return {
            ...data,
            data: [...data.rows].sort((a, b) => AGE_ORDER.indexOf(a.Age_Group) - AGE_ORDER.indexOf(b.Age_Group))
        };
    }, [data]);

    return (
        <>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Age Distribution" variant="borderless">
                        <Barchart data={chartData}/>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Multi-Level Hierarchical Breast Cancer Risk Factors" variant="borderless">
                        <SequenceSunburst data={chartData}/>
                    </Card>
                </Col>

            </Row>
            <Divider style={{margin: '2px 0'}}/>
            <Row gutter={16}>
                <Col span={24}>
                    <Card title="Multi-Dimensional View of Breast Cancer Risk Contributors" variant="borderless">
                        <ParallelPlot data={chartData}/>
                    </Card>
                </Col>
            </Row>
        </>
    );
}