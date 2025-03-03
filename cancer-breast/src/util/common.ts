import {BreastCancerRow} from "../types";

export const normalize = (data: BreastCancerRow, keys: string[]): string => {
    return keys.map(key =>
        data[key]?.toString().trim().replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase()
    ).join("-");
};

export const prepareOptions = (options: string[]) => {
    return options.map(option => {
        return {
            value: option,
            label: normalizeLabel(option),
        }
    });
}

export const normalizeLabel = (value: string) => {
    return value.replace(/_/g, " ");
}


export const calculateStats = (data: { rows: BreastCancerRow[] }) => {
    if (!data || !data.rows || data.rows.length === 0) {
        return null;
    }

    const ageGroupCounts: { [key: string]: number } = {};
    const bmiGroupCounts: { [key: string]: number } = {};
    const breastCancerHistoryCounts: { [key: string]: number } = {};

    data.rows.forEach((row) => {
        ageGroupCounts[row.Age_Group] = (ageGroupCounts[row.Age_Group] || 0) + 1;
        bmiGroupCounts[row.BMI_Group] = (bmiGroupCounts[row.BMI_Group] || 0) + 1;
        breastCancerHistoryCounts[row.Breast_Cancer_History] = (breastCancerHistoryCounts[row.Breast_Cancer_History] || 0) + 1;
    });

    return {
        ageGroup: ageGroupCounts,
        bmi: bmiGroupCounts,
        breastCancerHistory: breastCancerHistoryCounts,
    };
};

