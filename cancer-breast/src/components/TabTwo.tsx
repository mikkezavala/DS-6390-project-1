import {FC} from "react";
import {TabProps} from "../types";
import {Card, Col, Row} from "antd";
import {HeatMap} from "./HeatMap";
import {BoxPlot} from "./Boxplot";


export const TabTwo: FC<TabProps> = ({data}) => {

    return (
        <>
            <Row gutter={16}>
                <Col span={24}>
                    <Card title="Distribution" variant="borderless">
                        <BoxPlot data={data}/>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card title="Variable Correlation" variant="borderless">
                        <HeatMap data={data}/>
                    </Card>
                </Col>
            </Row>
        </>
    );
}