import {useContext} from "react";
import {Link} from "react-router-dom";
import {Avatar, Dropdown, Layout, Menu, MenuProps, Space, Switch} from "antd";
import {ThemeSwitcherContext} from "../providers/ThemeSwitcherContext";
import {DownOutlined, MoonFilled, SunFilled} from "@ant-design/icons";
import {COLOR_SCHEMES} from "../util/components";
import {SchemeSwitcherContext} from "../providers/SchemeSwitcherContext";

import ribbon from '/src/assets/ribbon.png'

export const Header = () => {
    const {themeSwitcher} = useContext(ThemeSwitcherContext)
    const {schemeCode, schemeSwitcher} = useContext(SchemeSwitcherContext)

    const onChange = (checked: boolean) => {
        const theme = checked ? "dark" : "light";
        themeSwitcher(theme);
    }

    const onSchemeChange: MenuProps['onClick'] = (evt: any) => {
        const scheme = evt.key
        schemeSwitcher(scheme);
    }

    const schemeLabel = (COLOR_SCHEMES?.find(color => color?.key == schemeCode) as any)?.label;

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
            <Space wrap>
                <Dropdown.Button
                    type="primary"
                    icon={<DownOutlined/>}
                    onClick={(evt) => {
                        evt.preventDefault()
                    }}
                    menu={{
                        selectable: true,
                        items: COLOR_SCHEMES,
                        onClick: onSchemeChange,
                        defaultSelectedKeys: [schemeCode],
                    }}
                >
                    {schemeLabel && schemeLabel || "Select Color Scheme"}
                </Dropdown.Button>
                <Switch
                    onChange={onChange}
                    defaultChecked
                    checkedChildren={<MoonFilled/>}
                    unCheckedChildren={<SunFilled/>}
                />
            </Space>
        </Layout.Header>
    );
}
