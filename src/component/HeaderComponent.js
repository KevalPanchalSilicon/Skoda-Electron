// import { DownOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Layout, Popover, Badge } from "antd";
import { InfoIcon, BellIcon, DownArrowIcon, CompanySettingIcon, ReportsIconNew } from "../config/IconsConfig";
import { observer } from "mobx-react";
import logo from "../images/logo.png";
import useStore from "../store";
import { Link, useHistory } from "react-router-dom";
import Avatar from "antd/lib/avatar/avatar";
import userPic from "../images/user.png";
import NotificationComponent from '../page/notification/index';
import { useState } from "react";
import ChangePassword from "../page/ChangePassword";

const HeaderComponent = observer((props) => {
	const {
		AUTH: { company, doLogout, user, checkPrivileges }
	} = useStore();

	const [editProfileModal, seteditProfileModal] = useState(false);
	const [notificationModal, setNotificationModal] = useState(false);

	const openEditProfileModal = () => {
		seteditProfileModal(true);
	}
	const closeEditProfileModal = () => {
		seteditProfileModal(false);
	}

	const openNotificationModal = () => {
		setNotificationModal(true);
	}
	const closeNotificationModal = () => {
		setNotificationModal(false);
	}

	const history = useHistory();

	// call logout function
	const Logout = () => {
		doLogout();
		history.replace("/");
	};

	const ProfilePopup = (
		<div className="profile_popup">
			<ul>
				<li>
					<Link onClick={() => { openEditProfileModal() }} to="/">Change Password</Link>
				</li>
				<li>
					<Link onClick={Logout} to="/">
						Logout
					</Link>
				</li>
			</ul>
		</div>
	);
	return (
		<Layout.Header className="site__header">

			<div className="navLogo">
				<Link to="/dashboard" className="logo_wrapper">
					<img
						className="logo"
						alt=""
						src={company ? company.branding.logo : logo}
					/>
				</Link>
			</div>
			<div className="rightHeader">
				<div className="d-flex align-items-center">
					{props.collapsed ? (
						<Button
							className="trigger toggle_btn toggle_right"
							onClick={() => {
								props.setCollapsed(false);
							}}
						>
							<span></span>
							<span></span>
							<span></span>
						</Button>
					) : (
						<Button
							className="trigger toggle_btn"
							onClick={() => {
								props.setCollapsed(true);
							}}
						>
							<span></span>
							<span></span>
							<span></span>
						</Button>
					)}
				</div>
				<div className="header_right">
					{
						checkPrivileges('#21#') &&
						<div className="notificcation_head">
							<span className="head_right_icon" onClick={() => history.push('/administration/company-settings')}>
								<CompanySettingIcon />
							</span>
						</div>
					}
					{
						(checkPrivileges('#51001#') || checkPrivileges('#52001#') || checkPrivileges('#53001#') || checkPrivileges('#54001#') || checkPrivileges('#55001#')) &&
						<div className="notificcation_head">
							<span className="head_right_icon" onClick={() => history.push('/reports')}>
								<ReportsIconNew />
							</span>
						</div>
					}
					<div className="notificcation_head">
						<Popover
							placement="bottomRight"
							title="Information"
							trigger="click"
						>

							<Badge showZero count={user && user.info_cnt}>
								<span className="head_right_icon">
									<InfoIcon />
								</span>
							</Badge>
						</Popover>
					</div>
					{
						checkPrivileges('#51005#') &&
						<div className="notificcation_head">
							<Badge showZero count={user && user.notifications_cnt} onClick={() => { openNotificationModal() }}>
								<span className="head_right_icon">
									<BellIcon />
								</span>
							</Badge>
							<NotificationComponent visible={notificationModal} close={closeNotificationModal} />
						</div>
					}
					<Popover
						placement="bottomRight"
						content={ProfilePopup}
						trigger="click"
					>
						<div className="notificcation_head">
							<div className="user_profile_sb">
								<Avatar src={user ? user.avatar_url : userPic} />
								<div className="user_name_arrow">
									<div className="user_name_role">
										<span className="side_user_name" title={user.name}>{user && user.name}</span>
										<span className="side_user_desig" title={user.email}>
											{user && user.email}
										</span>
									</div>
									<div className="profile_arrow">
										<DownArrowIcon />
									</div>
								</div>
							</div>
						</div>
					</Popover>
				</div>
			</div>
			<ChangePassword visible={editProfileModal} close={closeEditProfileModal} />
		</Layout.Header >
	);
});

export default HeaderComponent;
