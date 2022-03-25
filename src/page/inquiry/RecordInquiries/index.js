import React, { useEffect } from "react";
import { Form, Drawer, Tabs } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import BasicInfoTabComponent from "./component/BasicInfoTabComponent";
import CustomerInfoTabComponent from "./component/CustomerInfoTabComponent";
import DealTabComponent from "./component/DealTabComponent";
import BasicNeedTabComponent from "./component/BasicNeedTabComponent";
import ClosureTabComponent from "./component/ClosureTabComponent";
import useStore from "../../../store";
import ActionTabComponent from "./component/ActionTabComponent";

const { TabPane } = Tabs;

const WhitePaperComponent = observer((props) => {
	const { isVisibility = false } = props
	const [form] = Form.useForm();
	const {
		RecordInquiriesStore: { recordValues },
		RecordInquiriesStore
	} = useStore();

	useEffect(() => {
		if (recordValues && props.visible) {
			RecordInquiriesStore.getViewApiCall(RecordInquiriesStore.current_tab, recordValues.id)
		}
	}, [props, RecordInquiriesStore, recordValues])

	const handleTabChange = (activeKey) => {
		RecordInquiriesStore.setCurrentTab(activeKey)
		RecordInquiriesStore.getViewApiCall(activeKey, recordValues.id)
	}

	const tabCallback = (key) => {
		RecordInquiriesStore.setCurrentTab(key)
		RecordInquiriesStore.getViewApiCall(key, recordValues.id)
	}

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		RecordInquiriesStore.recordTabData = null
		RecordInquiriesStore.current_tab = "get_basic_info"
	};


	return recordValues ? (
		<Drawer
			className="addModal"
			title="White Paper"
			width="80%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[]}
		>
			<Tabs defaultActiveKey="1" className="horizontalTab" centered onChange={handleTabChange} activeKey={RecordInquiriesStore.current_tab}>
				<TabPane tab="Basic Information" key="get_basic_info">
					<BasicInfoTabComponent close={close} tabKey="get_basic_info" changeKey="get_customer_info" isVisibility={isVisibility} />
				</TabPane>
				<TabPane tab="Customer Information" key="get_customer_info">
					<CustomerInfoTabComponent close={close} tabKey="get_customer_info" changeKey="get_deal" isVisibility={isVisibility} />
				</TabPane>
				<TabPane tab="Deal" key="get_deal">
					<DealTabComponent close={close} tabKey="get_deal" changeKey="get_basic_needs" isVisibility={isVisibility} />
				</TabPane>
				<TabPane tab="Basic Needs" key="get_basic_needs">
					<BasicNeedTabComponent close={close} tabKey="get_basic_needs" changeKey="get_closure" isVisibility={isVisibility} />
				</TabPane>
				<TabPane tab="Closure" key="get_closure" isView={recordValues.status && recordValues.status !== 30 ? true : false}>
					<ClosureTabComponent close={close} tabKey="get_closure" tabCallback={tabCallback} isVisibility={isVisibility} />
				</TabPane>
				<TabPane tab="Actions" key="get_actions">
					<ActionTabComponent tabKey="get_actions" />
				</TabPane>
			</Tabs>
		</Drawer>
	) : null
});

export default WhitePaperComponent;
