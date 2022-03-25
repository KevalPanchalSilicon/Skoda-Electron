import React, { useState } from "react";
import { Form, Button, Drawer } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { convertError } from '../../../../utils/GlobalFunction'
// import moment from "moment";
import InsuranceOfferFormComponent from "./InsuranceOfferFormComponent";
import moment from "moment";

const AddInsuranceOfferComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();

	const {
		InsuranceOfferStore,
		InsurancePendingStore
	} = useStore();

	const [disabled, setDisabled] = useState(true);
	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		data.purchase_date = data.purchase_date ? moment(data.purchase_date).format("YYYY-MM-DD") : null;
		let modelList = InsuranceOfferStore.dropdown_model_list;
		let segmentobj = modelList.filter(obj => obj.id === data.model_id)[0]
		data.segment_id = segmentobj?.segment_id;
		InsuranceOfferStore.addInsuranceOffer(data).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			if (InsurancePendingStore.agGrid) {
				InsurancePendingStore.setupGrid(InsurancePendingStore.agGrid);
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
			title={`New Insurance`}
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
					form="addInsuranceOffer"
					loading={saving}
					className="mr-35"
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<InsuranceOfferFormComponent
				form={form}
				type="add"
				setDisabled={setDisabled}
				handleSubmit={handleSubmit}
				id="addInsuranceOffer"
			/>
		</Drawer>
	);
});

export default AddInsuranceOfferComponent;
