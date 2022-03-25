import React, { useState, useEffect } from "react";
import { Form, Button, Drawer, Row, Alert, Tooltip, Tabs } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { InfoCircleOutlined } from "@ant-design/icons";

const WidgetComponent = observer((props) => {
	const [form] = Form.useForm();
	const { TabPane } = Tabs;
	const {
		ManageRoleStore,
		ManageRoleStore: { EditWidgetData, widgetValues },
	} = useStore();
	const [saving, setSaving] = useState();
	const [commonError, setCommonError] = useState(null);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);

		var actions = {};
		var actionsString = "";
		if (data.privileges) {
			data.privileges.map((menuItem) => {
				menuItem.widget && menuItem.widget.map((subItem) => {
					if (subItem.is_selected === 1) {
						if (!actions[menuItem.id]) {
							actions[menuItem.id] = [];
						}
						actions[menuItem.id].push(subItem.id);
						actionsString += "#" + subItem.id;
					}
					return null;
				});
				return null;
			});
			if (actionsString === "") {
				setCommonError("Please select at-least one widget.");
				setSaving(false)
			} else {
				data.widgets = actionsString + "#";
				data.id = widgetValues.id;
				EditWidgetData(data)
					.then((data) => {
						close();
						vsmNotify.success({
							message: data.STATUS.NOTIFICATION[0],
						});
					})
					.catch((e) => {
						if (e.errors) {
							form.setFields(e.errors);
						}
					})
					.finally(() => setSaving(false));
			}
		}
	};

	// set the form values to edit
	useEffect(() => {
		if (widgetValues && props.visible) {
			ManageRoleStore.getWidgets(widgetValues.widgets).then((data) => {
				form.setFieldsValue({
					privileges: data.list.data,
				});
			});
		}
	}, [ManageRoleStore, widgetValues, form, props]);


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setCommonError(null);
	};
	return widgetValues ? (
		<Drawer
			className="editModal tabModal"
			title="Widget"
			width="80%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Cancel
				</Button>,
				<Button
					key="1"
					// disabled={disabled}
					form="widgetForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<Form
				form={form}
				id="widgetForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			// onChange={handleChange}
			>
				<Row>
					{commonError && (
						<Alert
							style={{ marginBottom: 15 }}
							message={commonError}
							type="error"
							showIcon
						/>
					)}
					<Form.List name="privileges">
						{(fields) => {
							return (
								<Tabs tabPosition="left">
									{fields &&
										fields.map((field) => {
											var value = form.getFieldValue("privileges")[field.key];
											return (
												<TabPane tab={value.name} key={value.id}>
													<div className="user_general_widget_wrap">
														{value.widget && value.widget.map((subItem, subIndex) => {
															return (
																<div
																	key={subItem.id}
																	className={`${subItem.is_selected === 1 ? "user_general_widget selected_wigdet" : "user_general_widget"}`}
																	onClick={() => {
																		var temp = form.getFieldValue(
																			"privileges"
																		);
																		temp[field.key].widget[subIndex].is_selected = temp[field.key].widget[subIndex].is_selected === 1 ? 0 : 1
																		form.setFieldsValue({
																			privileges: temp,
																		});
																	}}
																>
																	<div className="user_widget">
																		<div className="user_widget_img">
																			<img
																				src={subItem.image}
																				alt={subItem.name}
																			/>
																		</div>
																		<div className="user_widget_content">
																			<div className="widget_name">
																				{subItem.name}
																			</div>
																			<div className="widget_tooltip">
																				<Tooltip title={subItem.description}>
																					<InfoCircleOutlined className="ml-10" />
																				</Tooltip>
																			</div>
																		</div>
																	</div>
																</div>
															);
														})}
													</div>
												</TabPane>
											);
										})}
								</Tabs>
							);
						}}
					</Form.List>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default WidgetComponent;
