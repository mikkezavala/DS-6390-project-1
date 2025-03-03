import * as d3 from "d3"
import Barchart from "./components/Barchart";
import React, {useEffect, useMemo, useState} from 'react';
import {Card, Col, Divider, Layout, Row, theme} from 'antd';

import {BreastCancerData, BreastCancerRow} from "./types";
import ParallelPlot from "./components/ParallelPlot";
import {AGE_ORDER} from "./util/constant";

const {Header, Content} = Layout;


const App: React.FC = () => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const [data, setData] = useState<BreastCancerData>({meta: {count: 0}, rows: []} as BreastCancerData);

    useEffect(() => {
        d3.csv("assets/risk_factors_reduced_named.csv").then((csvData) => {
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
        <Layout>
            <Header style={{color: "#fff0f6"}}>
                <div className="demo-logo"/>
                Breast Cancer Research Visualization
            </Header>
            <Content style={{padding: '0 20px'}}>
                <Row gutter={10}>
                    <Col span={12}>
                        <Card title="Card title" variant="borderless">
                            <Barchart data={chartData}/>
                        </Card>
                    </Col>
                    <Divider orientation="left">Responsive</Divider>
                    <Col span={24}>
                        <Card title="Card title" variant="borderless">
                            <ParallelPlot data={chartData}/>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default App;