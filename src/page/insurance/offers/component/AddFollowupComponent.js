import React, { useState, useEffect } from "react";
import { Form, Button, Drawer } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { convertError } from '../../../../utils/GlobalFunction'
import InsuranceFollowupFormComponent from "./InsuranceFollowupFormComponent";
import moment from "moment";

const AddFollowupComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();

	const {
		InsuranceOfferStore,
	} = useStore();

	// set the form values to edit
	useEffect(() => {
		if (props.visible) {
			form.setFieldsValue({
				date: moment(),
				time: moment(),
			});
		}
	}, [form, props]);

	const [disabled, setDisabled] = useState(true);
	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		data.id = InsuranceOfferStore.insurance_detail.id;
		data.time = data.time ? moment(data.time).format("HH:mm") : null;
		data.date = data.date ? moment(data.date).format("YYYY-MM-DD") : null;
		data.nf_date = data.nf_date ? moment(data.nf_date).format("YYYY-MM-DD") : null;
		data.nf_time = data.nf_time ? moment(data.nf_time).format("HH:mm") : null;
		InsuranceOfferStore.addInsuranceFollowup(data).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			if (InsuranceOfferStore.viewValues) {
				InsuranceOfferStore.insuranceDetail(InsuranceOfferStore.viewValues);
			}
			close();
		}).catch((e) => {
			// console.log("error......", e);
			if (e.errors) {
				form.setFields(convertError(e.errors));
			}
		})
			.finally(() => setSaving(false));
	};


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return (
		<Drawer
			className="addModal"
			title={`New Followup (${InsuranceOfferStore.insurance_detail.code})`}
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
					form="addInsuranceFollowup"
					loading={saving}
					className="mr-35"
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<InsuranceFollowupFormComponent
				form={form}
				type="add"
				setDisabled={setDisabled}
				handleSubmit={handleSubmit}
				id="addInsuranceFollowup"
			/>
		</Drawer>
	);
});

export default AddFollowupComponent;
