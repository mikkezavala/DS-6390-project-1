import {Button, Card, Col, Row, Statistic, StatisticProps} from "antd";
import {DataTable} from "../components/DataTable";
import {useCsvData} from "../hooks/useData";
import CountUp from 'react-countup';
import {useMemo} from "react";
import {calculateStats} from "../util/common";
import {AGE_ORDER, BMI_ORDER, DS_LINK, DS_LINK_DOCS, GUTTER_SIZE} from "../util/constant";
import {LinkOutlined} from "@ant-design/icons";


const buildLink = (title: string, target: string) => {
    return (
        <Button type="link" variant="link" color="pink" href={target} icon={<LinkOutlined/>}
                target="_blank">{` ${title} `}</Button>
    );
}

export const DataSet = () => {
    const [data, loading, error] = useCsvData('/DS-6390-project-1/assets/risk_factors_reduced_named.csv');
    const formatter: StatisticProps['formatter'] = (value) => (
        <CountUp end={value as number} separator=","/>
    );

    const stats = useMemo(() => {
        return calculateStats(data);
    }, [data]);

    if (loading || !stats) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>${error}</div>
    }

    const ageStats = Object.entries(stats.ageGroup).sort(([a], [b]) =>
        AGE_ORDER.indexOf(a) - AGE_ORDER.indexOf(b)
    );

    const bmiStats = Object.entries(stats.bmi).sort(([a], [b]) => BMI_ORDER.indexOf(a) - BMI_ORDER.indexOf(b));

    return (
        <Row gutter={GUTTER_SIZE}>
            <Col span={24}>
                <Card variant="borderless"
                      actions={[buildLink("Source", DS_LINK), buildLink("Documentation", DS_LINK_DOCS)]}>
                    <Card.Meta description={<Statistic title="Records in Data Set" value={data.meta.count}
                                                       formatter={formatter}/>}/>
                    <p>
                        This risk factors dataset may be useful to people interested in exploring the distribution of
                        breast cancer risk factors in US women. The dataset includes information from 6,788,436
                        mammograms in the BCSC between January 2005 and December 2017. The dataset includes participant
                        characteristics previously shown to be associated with breast cancer risk including age,
                        race/ethnicity, family history of breast cancer, age at menarche, age at first birth, breast
                        density, use of hormone replacement therapy, menopausal status, body mass index, history of
                        biopsy, and history of breast cancer.
                    </p>
                </Card>
            </Col>
            <Col span={12}>
                <Card title="Age Groups Distribution">
                    <Row gutter={GUTTER_SIZE}>
                        {ageStats.map(([category, count]) => (
                            <Col span={6} key={category}>
                                <Statistic title={category} value={count} formatter={formatter}/>
                            </Col>
                        ))}
                    </Row>
                </Card>
            </Col>
            <Col span={12}>
                <Row gutter={[16, 70]}>
                    <Col span={24}>
                        <Card title="BMI Groups Distribution">
                            <Row gutter={GUTTER_SIZE}>
                                {bmiStats.map(([category, count]) => (
                                    <Col span={6} key={category}>
                                        <Statistic title={category} value={count} formatter={formatter}/>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card title="Cancer History Distribution">
                            <Row gutter={GUTTER_SIZE}>
                                <Col span={12}>
                                    <Statistic title="Yes" value={stats.breastCancerHistory["Yes"]}
                                               formatter={formatter}/>
                                </Col>
                                <Col span={12}>
                                    <Statistic title="No" value={stats.breastCancerHistory["No"]}
                                               formatter={formatter}/>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Card variant="borderless">
                    <DataTable data={data}/>
                </Card>
            </Col>
        </Row>
    )

}
