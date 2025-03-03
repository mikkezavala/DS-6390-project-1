import {createContext} from 'react';
import {theme} from "antd";

export const ThemeSwitcherContext = createContext({
    // @ts-expect-error disable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toggleTheme: (mode: string) => {},
    themeMode: theme.darkAlgorithm,

});