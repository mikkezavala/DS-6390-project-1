import {StrictMode, useMemo, useState} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {App} from './App.tsx'
import {ConfigProvider, theme} from 'antd'
import {BrowserRouter} from 'react-router-dom'
import {ThemeSwitcherContext} from "./providers/ThemeSwitcherContext";
import {ThemeSwitcherProps} from "./types";


export const AppWrapper = () => {
    const [themeMode, setThemeMode] = useState<ThemeSwitcherProps>({
        themeCode: "dark",
        themeAlgorithm: theme.darkAlgorithm,
        themeSwitcher: () => {}
    });

    const toggleTheme: any = (mode: string) => {
        const themeAlgorithm = mode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm
        setThemeMode(() => {
            return {
                ...themeMode,
                themeAlgorithm,
                themeCode: mode,

            } as ThemeSwitcherProps
        });
    }

    const value: ThemeSwitcherProps = useMemo(() => ({
        ...themeMode,
        themeSwitcher: toggleTheme
    }), [themeMode])

    return (
        <ThemeSwitcherContext.Provider value={value}>
            <ConfigProvider theme={{
                components: {
                    Layout: {
                        headerBg: '#520339',
                        headerColor: '#520339'
                    },
                    Menu: {
                        darkItemBg: '#520339',
                        darkItemSelectedBg: '#7a0178'
                    },
                },
                algorithm: themeMode.themeAlgorithm,
                token: {
                    colorPrimary: '#7a0178',
                }
            }}>
                <BrowserRouter basename="/DS-6390-project-1">
                    <App/>
                </BrowserRouter>
            </ConfigProvider>
        </ThemeSwitcherContext.Provider>);
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppWrapper/>
    </StrictMode>,
)
