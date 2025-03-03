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
