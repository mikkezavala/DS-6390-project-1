import {BreastCancerRow} from "../types";

export const normalize = (data: BreastCancerRow, keys: string[]): string => {
    return keys.map(key => {
        const value = `c${data[key]}`;
        return value.toString().trim().replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase()
    }).join("-");
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

export const isDarkMode = (themeCode: string) => {
    return themeCode === "dark";
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

export const correlation = (data: BreastCancerRow[], xVar: string, yVar: string) => {
    const xCategories = [...new Set(data.map(d => d[xVar]))];
    const yCategories = [...new Set(data.map(d => d[yVar]))];

    const table: Record<string, Record<string, number>> = {};
    xCategories.forEach(x => {
        table[x] = {};
        yCategories.forEach(y => table[x][y] = 0);
    });

    data.forEach(row => {
        if (row[xVar] && row[yVar]) table[row[xVar]][row[yVar]]++;
    });

    let chi2 = 0, total = 0;
    const rowTotals: Record<string, number> = {};
    const colTotals: Record<string, number> = {};

    xCategories.forEach(x => {
        rowTotals[x] = Object.values(table[x]).reduce((a, b) => a + b, 0);
        total += rowTotals[x];
    });

    yCategories.forEach(y => {
        colTotals[y] = <number>xCategories.reduce((sum, x) => <number>sum + table[x][y], 0);
    });

    xCategories.forEach(x => {
        yCategories.forEach(y => {
            const expected = (rowTotals[x] * colTotals[y]) / total;
            if (expected > 0) {
                chi2 += ((table[x][y] - expected) ** 2) / expected;
            }
        });
    });

    const k = Math.min(xCategories.length, yCategories.length);
    return Math.sqrt(chi2 / (total * (k - 1)));
};

export const correlationMatrix = (data: BreastCancerRow[], variables: string[]) =>
    variables.flatMap(xVar =>
        variables.map(yVar => ({
            x: xVar,
            y: yVar,
            correlation: xVar === yVar ? 1 : correlation(data, xVar, yVar)
        }))
    );