import React, { useEffect } from "react";
import { Form, Button, Drawer } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import InsuranceFollowupFormComponent from "./InsuranceFollowupFormComponent";
import moment from "moment";
const ViewFollowupComponent = observer((props) => {

	const [form] = Form.useForm();

	const {
		InsuranceOfferStore,
	} = useStore();

	useEffect(() => {
		if (props.visible) {

			InsuranceOfferStore.getFollowupDetail(InsuranceOfferStore.currentFollowUpDetail.id).then(data => {
				form.setFieldsValue({
					date: moment(data.date),
					mode_id: data.mode_id,
					time: moment(data.time, "HHmmss"),
					closure_type_id: data.closure_type_id,
					notes: data.note,
					username: data.user?.name
				})
			}).catch(error => {

			})
		}
	}, [InsuranceOfferStore, props.visible, form])


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return (
		<Drawer
			className="addModal"
			title={`View Followup (${InsuranceOfferStore.insurance_detail.code})`}
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
				</Button>
			]}
		>
			<InsuranceFollowupFormComponent
				form={form}
				isView={true}
				id="viewInsuranceFollowupForm"
			/>
		</Drawer>
	);
});

export default ViewFollowupComponent;
