import {Avatar, Layout, Menu} from "antd";
import {Link} from "react-router-dom";
import ribbon from '/src/assets/ribbon.png'

export const Header = () => {
    return (
        <Layout.Header style={{display: 'flex', alignItems: 'center'}}>
            <div style={{color: "#fff", marginRight: 10}}>
                <Avatar src={<img src={ribbon} alt="avatar"/>}/>
                Breast Cancer Research
            </div>
            <Menu
                theme="dark"
                mode="horizontal"
                color="#fff"
                style={{flex: 1, minWidth: 0}}

            >
                <Menu.Item key="nav-1">
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="nav-22">
                    <Link to="/team">Team</Link>
                </Menu.Item>
            </Menu>
        </Layout.Header>
    );
}