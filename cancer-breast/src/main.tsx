import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import {ConfigProvider, theme} from 'antd'
import {BrowserRouter} from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
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
            algorithm: theme.darkAlgorithm,

        }}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </ConfigProvider>
    </StrictMode>,
)
