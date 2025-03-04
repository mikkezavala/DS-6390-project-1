import {StrictMode, useCallback, useMemo, useState} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {App} from './App.tsx'
import {ConfigProvider, theme} from 'antd'
import {BrowserRouter} from 'react-router-dom'
import {ThemeSwitcherContext} from "./providers/ThemeSwitcherContext";
import {SchemeSwitcherProps, ThemeSwitcherProps} from "./types";
import {SchemeSwitcherContext} from "./providers/SchemeSwitcherContext";
import {SCHEME_MODE_CONFIG} from "./util/components";
import {COLOR_VALUES} from "./util/constant";
import {isDarkMode} from "./util/common";


export const AppWrapper = () => {
    const [themeMode, setThemeMode] = useState<ThemeSwitcherProps>({
        themeCode: "dark",
        themeAlgorithm: theme.darkAlgorithm,
        themeSwitcher: () => {
        }
    });

    const [schemeMode, schemeSwitcher] = useState<SchemeSwitcherProps>({
        schemeSwitcher: (_: string) => {
        },
        scheme: Object.values(SCHEME_MODE_CONFIG)[0],
        schemeCode: Object.keys(SCHEME_MODE_CONFIG)[0],
    });

    const toggleTheme: any = useCallback((mode: string) => {
        const themeAlgorithm = mode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm
        setThemeMode(() => {
            return {
                ...themeMode,
                themeAlgorithm,
                themeCode: mode,
            } as ThemeSwitcherProps
        });
    }, [themeMode]);

    const toggleSchemeMode = useCallback((schemeCode: string) => {
        schemeSwitcher({
            ...schemeMode,
            schemeCode: schemeCode,
            scheme: SCHEME_MODE_CONFIG[schemeCode],
        } as SchemeSwitcherProps);
    }, [schemeMode]);

    const value: ThemeSwitcherProps = useMemo(() => ({
        ...themeMode,
        themeSwitcher: toggleTheme
    }), [themeMode, toggleTheme])

    const schemeValue: SchemeSwitcherProps = useMemo(() => ({
        ...schemeMode,
        schemeSwitcher: toggleSchemeMode,
    }), [schemeMode, toggleSchemeMode])

    return (
        <ThemeSwitcherContext.Provider value={value}>
            <SchemeSwitcherContext.Provider value={schemeValue}>
                <ConfigProvider theme={{
                    components: {
                        Layout: {
                            headerBg: COLOR_VALUES.dark.bgColor,
                            headerColor: COLOR_VALUES.dark.bgColor
                        },
                        Menu: {
                            darkItemBg: COLOR_VALUES.dark.bgColor,
                            darkItemSelectedBg: COLOR_VALUES.dark.bgSelected
                        },
                        Tabs: {
                            itemSelectedColor: isDarkMode(themeMode.themeCode) ? '#ffadd2' : '#520339',
                        }
                    },
                    algorithm: themeMode.themeAlgorithm,
                    token: {
                        colorPrimary: COLOR_VALUES.primary,
                    }
                }}>
                    <BrowserRouter basename="/DS-6390-project-1">
                        <App/>
                    </BrowserRouter>
                </ConfigProvider>
            </SchemeSwitcherContext.Provider>
        </ThemeSwitcherContext.Provider>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppWrapper/>
    </StrictMode>,
)
