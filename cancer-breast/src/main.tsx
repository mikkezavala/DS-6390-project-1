import {StrictMode, useMemo, useState} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {App} from './App.tsx'
import {ConfigProvider, theme} from 'antd'
import {BrowserRouter} from 'react-router-dom'
import {ThemeSwitcherContext} from "./providers/ThemeSwitcherContext";


export const AppWrapper = () => {
    const [themeMode, setThemeMode] = useState<any>(() => theme.darkAlgorithm)

    const toggleTheme: any = (mode: string) => {
        const themeMode = mode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm
        setThemeMode(() => themeMode)
    }

    const value = useMemo(() => ({
        themeMode,
        toggleTheme
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
                    }
                },
                algorithm: themeMode,
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
