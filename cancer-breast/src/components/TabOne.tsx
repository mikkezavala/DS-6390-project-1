import {FC} from "react";

import Barchart from "./Barchart";
import SequenceSunburst from "./SequenceSunburst";
import ParallelPlot from "./ParallelPlot";

import {Card, Col, Divider, Row} from "antd";
import {TabProps} from "../types";


export const TabOne: FC<TabProps> = ({data}) => {
    return (
        <>
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
            <Divider style={{margin: '2px 0'}}/>
            <Row gutter={16}>
                <Col sm={24} lg={24}>
                    <Card title="Multi-Dimensional View of Breast Cancer Risk Contributors"
                          variant="borderless">
                        <ParallelPlot data={data}/>
                    </Card>
                </Col>
            </Row>
        </>
    );
}