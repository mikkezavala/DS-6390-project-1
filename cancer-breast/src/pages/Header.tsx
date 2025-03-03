import {Avatar, Layout, Menu, Switch} from "antd";
import {Link} from "react-router-dom";
import ribbon from '/src/assets/ribbon.png'
import {useContext} from "react";
import {ThemeSwitcherContext} from "../providers/ThemeSwitcherContext";
import {MoonFilled, SunFilled} from "@ant-design/icons";

export const Header = () => {
    const {themeSwitcher} = useContext(ThemeSwitcherContext)
    const onChange = (checked: boolean) => {
        const theme = checked ? "dark" : "light";
        themeSwitcher(theme);
    }
    return (
        <Layout.Header style={{display: 'flex', alignItems: 'center', color: "#fff0f6"}}>
            <div style={{color: "#fff", marginRight: 10}}>
                <Avatar src={<img src={ribbon} alt="avatar"/>}/>
                Breast Cancer Research
            </div>
            <Menu
                theme="dark"
                mode="horizontal"
                color="#fff"
                defaultSelectedKeys={['1']}
                style={{flex: 1, minWidth: 0}}
            >
                <Menu.Item key="nav-1">
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="nav-2">
                    <Link to="/dataset">Data Set Description</Link>
                </Menu.Item>
                <Menu.Item key="nav-3">
                    <Link to="/team">Team</Link>
                </Menu.Item>

            </Menu>
            <Switch
                onChange={onChange}
                defaultChecked
                checkedChildren={<MoonFilled/>}
                unCheckedChildren={<SunFilled/>}
            />
        </Layout.Header>
    );
}
