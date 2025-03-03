import {Outlet} from 'react-router-dom';
import {Layout} from 'antd';
import {Header} from "./Header";

//#fff0f6
const MainLayout = () => {
    return (
        <Layout>
            <Header/>
            <Layout.Content style={{padding: '10px 20px'}}>
                <Outlet/>
            </Layout.Content>
        </Layout>
    );
}

export default MainLayout;