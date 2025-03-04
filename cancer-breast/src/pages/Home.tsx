import {Suspense, useMemo} from "react";
import {Tabs} from "antd";

import {AGE_ORDER} from "../util/constant";
import {useCsvData} from "../hooks/useData";
import {Loading} from "../components/Loading";
import {TabOne} from "../components/TabOne";
import {TabTwo} from "../components/TabTwo";


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
            <Tabs items={[
                {
                    key: "1",
                    label: 'Analysis Data Set',
                    children: <TabOne data={chartData}/>,
                },
                {
                    key: "2",
                    label: 'Variable Analysis',
                    children: <TabTwo data={chartData}/>,
                }
            ]}/>
        </Suspense>
    );
}
