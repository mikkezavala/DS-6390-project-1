import {Outlet} from 'react-router-dom';
import {Layout} from 'antd';
import {Header} from "./Header";

const MainLayout = () => {
    return (
        <Layout>
            <Header/>
            <Layout.Content style={{padding: '10px 20px', minHeight: '100vh'}}>
                <Outlet/>
            </Layout.Content>
        </Layout>
    );
}

export default MainLayout;