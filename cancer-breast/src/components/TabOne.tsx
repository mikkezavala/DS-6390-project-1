import {FC} from "react";

import Barchart from "./Barchart";
import SequenceSunburst from "./SequenceSunburst";
import ParallelPlot from "./ParallelPlot";

import {Card, Col, Row, Space} from "antd";
import {TabProps} from "../types";


export const TabOne: FC<TabProps> = ({data}) => {
    return (
        <Space wrap size="middle">
            <Row gutter={16}>
                <Col sm={24} lg={12}>
                    <Card title="Age Distribution" variant="borderless" styles={{
                        body: {
                            height: "90%"
                        }
                    }}>
                        <Barchart data={data}/>
                    </Card>
                </Col>
                <Col sm={24} lg={12}>
                    <Card title="Multi-Level Hierarchical Breast Cancer Risk Factors" variant="borderless">
                        <SequenceSunburst data={data}/>
                    </Card>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col sm={24} lg={24}>
                    <Card title="Multi-Dimensional View of Breast Cancer Risk Contributors"
                          variant="borderless">
                        <ParallelPlot data={data}/>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
}