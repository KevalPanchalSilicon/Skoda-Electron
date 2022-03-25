import { useEffect, useRef, useState, } from "react"
import { faCheck, faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Select } from "antd"
import InputComponent from "./InputComponent"
import { vsmNotify } from "../config/messages"
import useStore from "../store"
import { observer } from "mobx-react"

export const InputComponentForLedger = ({ value, index, getValue, isDisable = false }) => {
	const inputRef = useRef()
	// const [isOpen, setIsOpen] = useState(true)

	useEffect(() => {
		inputRef.current.value = value
	}, [value])

	const applySubmit = () => {
		getValue(index, inputRef.current.value)
	}

	return (
		<>
			<div className="inputText">
				<input
					type="text"
					disabled={true}
					name="input_disc"
					ref={inputRef}
				/>
			</div>
			<Button
				type="text"
				className="ledgerIcon"
				size="small"
				disabled={isDisable}
				onClick={() => applySubmit()}
			>
				<FontAwesomeIcon icon={index === "acc_offer" && value === 0 ? faCheck : faPencilAlt} />
			</Button>
		</>
	)
}


export const PMSSelectForLedger = observer(({ pms, isShow }) => {
	const [value, setValue] = useState(null)
	const { ManageZFormsStore } = useStore();


	// Call lov for PMS
	const handlePMSChange = () => {
		ManageZFormsStore.viewValues.booking_model.model_id &&
			ManageZFormsStore.getPMSList(ManageZFormsStore.viewValues.booking_model.model_id);
	};

	useEffect(() => {
		if (pms > 0) {
			ManageZFormsStore.dropdown_pms_list = [{ id: 0, amount: pms }]
			setValue(pms)
		}
	}, [ManageZFormsStore, ManageZFormsStore.viewValues, pms])

	// make a fuction to call to apply PMS
	const handlePMSApply = () => {
		let data = {};

		data.booking_id = ManageZFormsStore.viewValues.id;
		data.pms = value;
		ManageZFormsStore.PMSApply(data)
			.then((data) => {
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
			})
		// .finally(() => setSaving(false));
	};

	// make a fuction to call to remove PMS
	const handlePMSRemove = () => {
		let data = {}

		data.booking_id = ManageZFormsStore.viewValues.id;
		data.pms = value;
		ManageZFormsStore.PMSRemove(data)
			.then((data) => {
				// close();
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
				if (e.errors) {
					vsmNotify.error({
						message: data.STATUS.NOTIFICATION[0],
					});
				}
			})
		// .finally(() => setSaving(false));
	};


	const handleChange = (e) => {
		setValue(e)
	}

	return (
		<>
			{
				pms === 0 &&
				<>
					<div className="ledgerDropdown">
						<Select
							required
							name="apply_pms_id"
							placeholder="PMS"
							showSearch={false}
							filterOption={false}
							onChange={handleChange}
							onFocus={handlePMSChange}
							options={
								ManageZFormsStore.dropdown_pms_list ?
									ManageZFormsStore.dropdown_pms_list.map(item => { return { value: item.amount.toString() } })
									: []}
						/>
					</div>
					{
						isShow &&
						<Button
							type="text"
							title={"Apply"}
							className="greenIcon ledgerIcon"
							size="small"
							htmlType="submit"
							onClick={() => handlePMSApply()}
						>
							<FontAwesomeIcon icon={faCheck} />
						</Button>
					}
				</>
			}
			{
				pms > 0 &&
				<>
					<div className="ledgerDropdown">
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							name="pms_id"
							placeholder="PMS"
							// rules={vsmCity.validation.state_id}
							onChange={handleChange}
							onFocus={handlePMSChange}
							// notFoundContent={
							// 	fetchPMS ? <Spin size="small" /> : "No Record Found."
							// }
							defaultValue={ManageZFormsStore.viewValues.booking_ledger.pms}
							options={{
								values: ManageZFormsStore.dropdown_pms_list
									?
									ManageZFormsStore.dropdown_pms_list.map(item => { return { amount: item.amount.toString() } })
									: []
								,
								value_key: "amount",
								text_key: "amount",
							}}
						/>
					</div>
					{
						isShow &&
						<Button
							type="text"
							title={"Apply"}
							className="greenIcon ledgerIcon"
							size="small"
							htmlType="submit"
							onClick={() => handlePMSApply()}
						>
							<FontAwesomeIcon icon={faCheck} />
						</Button>
					}
					{
						isShow &&
						<Button
							type="text"
							title={"Remove"}
							className="redIcon ledgerIcon"
							size="small"
							htmlType="submit"
							onClick={() => handlePMSRemove()}
						>
							<FontAwesomeIcon icon={faTimes} />
						</Button>
					}
				</>
			}
		</>
	)
})
