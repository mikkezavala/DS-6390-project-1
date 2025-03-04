import {FC} from "react";
import {TabProps} from "../types";
import {Card, Col, Row} from "antd";
import {HeatMap} from "./HeatMap";


export const TabTwo: FC<TabProps> = ({data}) => {
    return (<>
        <Row gutter={16}>
            <Col sm={24} lg={12}>
                <Card title="Variable Correlation" variant="borderless">
                    <HeatMap data={data}/>
                </Card>
            </Col>
        </Row>
    </>);
}