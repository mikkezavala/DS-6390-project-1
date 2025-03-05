import {useEffect, useState} from "react";
import * as d3 from "d3";
import {BreastCancerData, BreastCancerRow} from "../types";

export const useCsvData = (csvFilePath: string): [BreastCancerData, boolean, string | null] => {
    const [data, setData] = useState<BreastCancerData>({meta: {count: 0}, rows: []});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const csvData = await d3.csv(csvFilePath);
                if (csvData) {
                    setData({
                        meta: {count: csvData.length},
                        rows: csvData.map((d) => ({
                            Year: d['Year'],
                            Age_Group: d['Age_Group'],
                            Race_Ethnicity: d['Race_Ethnicity'],
                            First_Degree_History: d['First_Degree_History'],
                            Age_Menarche: d['Age_Menarche'],
                            Age_First_Birth: d['Age_First_Birth'],
                            Breast_Density: d['Breast_Density'],
                            Hormone_Replacement_Therapy: d['Hormone_Replacement_Therapy'],
                            Menopause_Status: d['Menopause_Status'],
                            BMI_Group: d['BMI_Group'],
                            Biopsy_History: d['Biopsy_History'],
                            Breast_Cancer_History: d['Breast_Cancer_History'],
                            Count: +d.Count || 0,
                        })) as BreastCancerRow[],
                    });
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load CSV data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [csvFilePath]);

    return [data, loading, error];
};
