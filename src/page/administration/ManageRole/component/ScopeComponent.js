import React, { useState, useEffect } from "react";
import { Form, Button, Drawer, Row, Alert } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Tabs, Checkbox } from "antd";

const ScopeComponent = observer((props) => {
	const [form] = Form.useForm();
	const { TabPane } = Tabs;
	const {
		ManageRoleStore,
		ManageRoleStore: { EditScopeData, scopeValues },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [commonError, setCommonError] = useState(null);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = scopeValues.id;
		var actions = {};
		var actionsString = "";
		if (data.privileges) {
			data.privileges.map((menuItem) => {
				menuItem && menuItem.submenu.map((subItem) => {
					subItem.actions && subItem.actions.map((actionItem) => {
						if (actionItem.is_selected === 1) {
							if (!actions[subItem.id]) {
								actions[subItem.id] = [];
							}
							actions[subItem.id].push(actionItem.id);
							actionsString += "#" + actionItem.id;
						}
						return null;
					});
					if (subItem.is_selected) {
						if (!actions[subItem.id]) {
							actions[subItem.id] = [];
						}
						actions[subItem.id].push(subItem.id);
						actionsString += "#" + subItem.id;
					}
					return null;
				});
				return null;
			});
			if (actionsString === "") {
				setCommonError("It should not be blank.");
			} else {
				data.privileges = actionsString + "#";
				data.id = scopeValues.id;
				EditScopeData(data)
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
		if (scopeValues && props.visible) {
			ManageRoleStore.getPrivileges(scopeValues.privileges).then((data) => {
				form.setFieldsValue({
					privileges: data.list.data,
				});
			});
		}
	}, [ManageRoleStore, scopeValues, form, props]);

	// check for valid form values then accordingly make save button disable/enable
	const handleChange = () => {
		form
			.validateFields()
			.then((d) => {
				setDisabled(false);
			})
			.catch((d) => {
				setDisabled(true);
			});
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		setCommonError(null);
	};

	return scopeValues ? (
		<Drawer
			className="editModal tabModal"
			title="Define Scope"
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
					disabled={disabled}
					form="scopeDefineForm"
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
				id="scopeDefineForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				{commonError && (
					<Row>
						<Alert
							style={{ marginBottom: 15 }}
							message={commonError}
							type="error"
							showIcon
						/>
					</Row>
				)}
				<Row>
					<Form.List name="privileges">
						{(fields) => {
							return (
								<Tabs tabPosition="left">
									{fields &&
										fields.map((field) => {
											var value = form.getFieldValue("privileges")[field.key];
											return (
												<TabPane tab={value.name} key={value.id}>
													{value.submenu.map((subItem, subIndex) => {
														return (
															<div key={subItem.id} className="scope_radio">
																<Checkbox
																	key={subItem.id}
																	checked={
																		subItem.is_selected === 1
																			? true
																			: false
																	}
																	disabled={
																		scopeValues.is_override === 0 ? true : false
																	}
																	onChange={(e) => {
																		var temp = form.getFieldValue("privileges");

																		temp[field.key].submenu[
																			subIndex
																		].is_selected = e.target.checked ? 1 : 0;
																		temp[field.key].submenu[
																			subIndex
																		].actions.map((action, index) => {
																			temp[field.key].submenu[subIndex].actions[
																				index
																			].is_selected = e.target.checked ? 1 : 0;
																			return null;
																		});
																		form.setFieldsValue({
																			privileges: temp,
																		});
																	}}
																	value={subItem.id}
																>
																	{subItem.name}
																</Checkbox>
																<div className="scope_inner_radio">
																	{subItem.actions && subItem.actions.map(
																		(actionItem, actionIndex) => {
																			return (
																				<Checkbox
																					key={actionItem.id}
																					disabled={
																						scopeValues.is_override === 0
																							? true
																							: false
																					}
																					onChange={(e) => {
																						var temp = form.getFieldValue(
																							"privileges"
																						);
																						temp[field.key].submenu[
																							subIndex
																						].actions[
																							actionIndex
																						].is_selected = e.target.checked
																								? 1
																								: 0;
																						form.setFieldsValue({
																							privileges: temp,
																						});
																					}}
																					checked={
																						actionItem.is_selected === 1
																							? true
																							: false
																					}
																					value={actionItem.id}
																				>
																					{actionItem.name}
																				</Checkbox>
																			);
																		}
																	)}
																</div>
															</div>
														);
													})}
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

export default ScopeComponent;
