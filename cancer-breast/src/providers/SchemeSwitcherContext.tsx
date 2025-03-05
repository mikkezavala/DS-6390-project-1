import {createContext} from 'react';
import {SchemeSwitcherProps} from "../types";
import {SCHEME_MODE_CONFIG} from "../util/components";


export const SchemeSwitcherContext = createContext<SchemeSwitcherProps>({
    schemeSwitcher: (_: string) => {},
    schemeCode: Object.keys(SCHEME_MODE_CONFIG)[0],
    scheme: Object.values(SCHEME_MODE_CONFIG)[0]
});
