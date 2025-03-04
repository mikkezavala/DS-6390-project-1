export interface DataMeta {
    count: number;
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

    [key: string]: string | number;
}

export interface BreastCancerData {
    meta: DataMeta
    rows: BreastCancerRow[]
}

export interface BarchartProps {
    data: BreastCancerData;
}

export interface ParallelPlotProps {
    data: BreastCancerData;
}

export interface SunburstProps {
    data: BreastCancerData;
}

export interface SunBurstCoords {
    x0?: number;
    x1?: number;
    y0?: number;
    y1?: number;
}

export interface SunBurstHierarchy {
    name: string;
    value: number;
    children: any;
}

export interface ThemeSwitcherProps {
    themeCode: string;
    themeAlgorithm: any;
    themeSwitcher: (mode: string) => void;
}

export interface SchemeSwitcherProps {
    scheme: string[];
    schemeCode: string;
    schemeSwitcher: (mode: string) => void;
}

export interface DataSetProps {
    data: BreastCancerData;
}

export interface TabProps {
    data: BreastCancerData;
}

export interface SummaryStatistics {
    key: string;
    q1: number;
    q3: number;
    median: number;
    iqr: number;
    min: number;
    max: number;
}