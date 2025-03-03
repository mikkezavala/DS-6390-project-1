import {FC} from "react";
import {BreastCancerRow, DataSetProps} from "../types";
import {Row, Table} from "antd";
import {COLUMNS} from "../util/constant";

export const DataTable: FC<DataSetProps> = ({data}) => {

    return (
        <Row gutter={8}>
            <Table<BreastCancerRow> columns={COLUMNS} dataSource={data.rows}/>
        </Row>
    );
}
