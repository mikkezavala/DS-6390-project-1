export interface DataMeta {
    count: number;
}

export interface GroupMeta {
    count: number;
    field: string;
}

export interface BreastCancerRow {
    Year: string;
    Age_Group: string;
    Race_Ethnicity: string;
    First_Degree_History: string;
    Age_Menarche: string;
    Age_First_Birth: string;
    Breast_Density: string;
    Hormone_Replacement_Therapy: string;
    Menopause_Status: string;
    BMI_Group: string;
    Biopsy_History: string;
    Breast_Cancer_History: string;
    Count: number;
}

export interface BreastCancerData {
    meta: DataMeta
    rows: BreastCancerRow[]
}

export interface ChartRow {
    count: number;
    yLabel: string;
    xLabel: string;
    fieldGroup: string;
}

export interface BarchartProps {
    data: BreastCancerData;
}