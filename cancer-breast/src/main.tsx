import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider, theme } from 'antd'

const themeTokens = {
    colorText: '#120338',
    colorBgContainer: '#fff',
    colorBgLayout: '#120338',
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider
            theme={{
                token: themeTokens,
                components: {
                    Layout: {
                        headerBg: '#520339'
                    },
                },
                algorithm: theme.defaultAlgorithm,
            }}
        >
            <App/>
        </ConfigProvider>
    </StrictMode>,
)
