import {createContext} from 'react';
import {theme} from "antd";
import {ThemeSwitcherProps} from "../types";

export const ThemeSwitcherContext = createContext<ThemeSwitcherProps>({
    // @ts-expect-error disable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    themeSwitcher: (mode: string) => {},
    themeAlgorithm: theme.darkAlgorithm,
    themeCode: "dark",
});
