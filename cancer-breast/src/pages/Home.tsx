import {Suspense, useMemo} from "react";
import {Card, Col, Divider, Row} from "antd";
import Barchart from "../components/Barchart";
import SequenceSunburst from "../components/SequenceSunburst";
import ParallelPlot from "../components/ParallelPlot";

import {AGE_ORDER} from "../util/constant";
import {useCsvData} from "../hooks/useData";
import {Loading} from "../components/Loading";


export const Home = () => {
    const [data, loading, error] = useCsvData('/DS-6390-project-1/assets/risk_factors_reduced_named.csv');

    const chartData = useMemo(() => {
        if (!loading && !error || !data || !data.rows) return data;
        return {
            ...data,
            data: [...data.rows].sort((a, b) => AGE_ORDER.indexOf(a.Age_Group) - AGE_ORDER.indexOf(b.Age_Group))
        };
    }, [data, error, loading]);

    return (
        <Suspense fallback={<Loading/>}>
            <Row gutter={16}>
                <Col sm={24} lg={12}>
                    <Card title="Age Distribution" variant="borderless">
                        <Barchart data={chartData}/>
                    </Card>
                </Col>
                <Col sm={24} lg={12}>
                    <Card title="Multi-Level Hierarchical Breast Cancer Risk Factors" variant="borderless">
                        <SequenceSunburst data={chartData}/>
                    </Card>
                </Col>
            </Row>
            <Divider style={{margin: '2px 0'}}/>
            <Row gutter={16}>
                <Col sm={24} lg={24}>
                    <Card title="Multi-Dimensional View of Breast Cancer Risk Contributors" variant="borderless">
                        <ParallelPlot data={chartData}/>
                    </Card>
                </Col>
            </Row>
        </Suspense>
    );
}
