import {Gutter} from "antd/es/grid/row";

export const BMI_ORDER = ["10-24.99", "25-29.99", "30-34.99", "35+"];
export const AGE_ORDER = ["18-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80-84", ">85"];
export const COLUMNS = [
    {title: 'Year', dataIndex: 'Year', key: 'Year'},
    {title: 'Age Group', dataIndex: 'Age_Group', key: 'Age_Group'},
    {title: 'Race Ethnicity', dataIndex: 'Race_Ethnicity', key: 'Race_Ethnicity'},
    {title: 'First Degree History', dataIndex: 'First_Degree_History', key: 'First_Degree_History'},
    {title: 'Age Menarche', dataIndex: 'Age_Menarche', key: 'Age_Menarche'},
    {title: 'Age First Birth', dataIndex: 'Age_First_Birth', key: 'Age_First_Birth'},
    {title: 'Breast Density', dataIndex: 'Breast_Density', key: 'Breast_Density'},
    {
        title: 'Hormone Replacement Therapy',
        dataIndex: 'Hormone_Replacement_Therapy',
        key: 'Hormone_Replacement_Therapy'
    },
    {title: 'Menopause Status', dataIndex: 'Menopause_Status', key: 'Menopause_Status'},
    {title: 'BMI Group', dataIndex: 'BMI_Group', key: 'BMI_Group'},
    {title: 'Biopsy History', dataIndex: 'Biopsy_History', key: 'Biopsy_History'},
    {title: 'Breast Cancer History', dataIndex: 'Breast_Cancer_History', key: 'Breast_Cancer_History'},
    {title: 'Count', dataIndex: 'Count', key: 'Count'},
];


export const GUTTER_SIZE: Gutter = [16, 16] as Gutter

export const DS_LINK_DOCS: string = "https://www.bcsc-research.org/index.php/datasets/rf/documentation"
export const DS_LINK: string = "https://www.bcsc-research.org/index.php/datasets/rf"
