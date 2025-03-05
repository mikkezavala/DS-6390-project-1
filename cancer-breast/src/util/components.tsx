import {MenuProps} from "antd";
import {FormatPainterOutlined} from "@ant-design/icons";
import * as d3 from "d3";

const SCHEME_VARIANT = 6
export const SCHEME_MODE_CONFIG: Record<string, any> = {
    "schemeRdPu": d3.schemeRdPu[SCHEME_VARIANT],
    "schemePRGn": d3.schemePRGn[SCHEME_VARIANT],
    "schemePiYG": d3.schemePiYG[SCHEME_VARIANT],
    "schemePuOr": d3.schemePuOr[SCHEME_VARIANT],
    "schemePaired": d3.schemePaired,
    "schemeSpectral": d3.schemeSpectral[SCHEME_VARIANT],
    "schemeTableau10": d3.schemeTableau10,
}
export const COLOR_SCHEMES: MenuProps['items'] = [
    {
        label: 'Pink Scheme (RdPu)',
        key: 'schemeRdPu',
        icon: <FormatPainterOutlined/>,
    },
    {
        label: 'Purple Scheme (PRGn)',
        key: 'schemePRGn',
        icon: <FormatPainterOutlined/>,
    },
    {
        label: 'Pink Scheme (PiYG)',
        key: 'schemePiYG',
        icon: <FormatPainterOutlined/>,
    },
    {
        label: 'Purple-Orange Scheme (PuOr)',
        key: 'schemePuOr',
        icon: <FormatPainterOutlined/>,
    },
    {
        label: 'Spectral Scheme (schemeSpectral)',
        key: 'schemeSpectral',
        icon: <FormatPainterOutlined/>,
    },
    {
        label: 'Paired Scheme (Paired)',
        key: 'schemePaired',
        icon: <FormatPainterOutlined/>,
    },
    {
        label: 'Tableau Scheme (Tableau10)',
        key: 'schemeTableau10',
        icon: <FormatPainterOutlined/>,
    },
]

