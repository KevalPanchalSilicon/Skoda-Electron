import React, { useState } from "react";
import { Menu, Drawer } from "antd";
import { observer } from "mobx-react";
import { Link, useLocation } from "react-router-dom";
// import FavIcon from "../images/icons/fav-icon.png";
import useStore from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Banner_img from "../images/login-bg.png";

const SidebarComponent = observer((props) => {
	const {
		AUTH: { company, menu },
	} = useStore();
	const location = useLocation();
	const [openKeys, setOpenKeys] = useState([]);

	const onOpenChange = keys => {
		const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
		if (latestOpenKey !== undefined && latestOpenKey) {
			setOpenKeys([latestOpenKey]);
		}
		else {
			setOpenKeys(keys);
		}
	};

	// iterate the menu items
	const AppMenu = (menu_item, open = []) => {
		return menu_item
			? menu_item
				// .sort((a, b) => (a.sequence_no >= b.sequence_no ? 1 : -1))
				.map((item) => {
					if (item.submenu) {
						return (

							<Menu.SubMenu
								key={item.name + item.id}
								// icon={<div className="menu_icon"> {icons[item.id]}</div>}
								title={item.name}
								expandIcon={
									<div className="submenu_arrow">
										{/* <RightArrowIcon /> */}
									</div>
								}
							>
								{AppMenu(item.submenu, [...open, item.name + item.id])}

							</Menu.SubMenu>
						);
					} else {
						if (
							location.pathname.includes(item.controller) &&
							openKeys.length <= 0
						) {
							if (open.length === 0) {
								open.push(item.controller);
							}
							setOpenKeys(open);
						}
						return (
							<Menu.Item
								key={item.controller}
							// title={item.name}
							// icon={<div className="menu_icon"> {icons[item.id]}</div>}
							>
								{/* <Tooltip title={item.name}> */}
								<span>{item.name}</span>
								<Link to={item.controller} onClick={() => close()} />
								{/* </Tooltip> */}
							</Menu.Item>
						);
					}
				})
			: null;
	};

	const close = () => {
		props.setCollapsed(false);
	};

	return (
		<Drawer
			className="mainMenuDrawer"
			// title="View Closure Inquiry"
			width="100%"
			visible={props.collapsed}
			placement="left"
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
		>
			<div className="menuWrapper" style={{ backgroundImage: `url(${company ? company.branding.hero_image : Banner_img})`, }}>
				<Menu
					theme="light"
					mode="inline"
					openKeys={openKeys}
					onOpenChange={onOpenChange}
					defaultOpenKeys={openKeys}
				// selectedKeys={location.pathname}
				>
					{AppMenu(menu)}
				</Menu>
			</div>
			{/* </Layout.Sider> */}
		</Drawer>
	);
});

export default SidebarComponent;
