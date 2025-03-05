import {FC} from "react";
import {TabProps} from "../types";
import {Card, Col,Row, Space} from "antd";
import {HeatMap} from "./HeatMap";
import {BoxPlot} from "./Boxplot";


export const TabTwo: FC<TabProps> = ({data}) => {

    return (
        <>
            <Row gutter={16}>
                <Space wrap size="middle">
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
                </Space>
            </Row>
        </>
    );
}