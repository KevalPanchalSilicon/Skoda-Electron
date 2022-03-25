import React from "react";
import { Button, Modal, Row, Col, } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SignaturePad from "react-signature-canvas";
import { vsmNotify } from "../../../../config/messages";

const SignatureModalComponent = observer((props) => {
	let sigPad = {};

	const handleSubmit = () => {
		if (sigPad.isEmpty()) {
			vsmNotify.error({
				message: "Please do signature."
			})
			return
		}
		props.getSignature(sigPad.getTrimmedCanvas().toDataURL("image/png"))
		props.close()
		sigPad.clear();
	}

	const clear = () => {
		sigPad.clear();
	}

	const close = () => {
		props.close()
	}

	return (
		<Modal
			className="addModal"
			centered
			title={props.type === "exe" ? "Executive Sign" : "Customer Sign"}
			width={640}
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={close}
			cancelButtonProps={{ style: { display: "none" } }}
			okButtonProps={{ style: { display: "none" } }}
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
					key="3"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={clear}
				>
					Clear
				</Button>,
				<Button
					key="1"
					htmlType="submit"
					type="primary"
					onClick={() => handleSubmit()}
				>
					Save
				</Button>,
			]}
		>
			<Row gutter={30}>
				<Col xs={{ span: 24 }}>
					<div style={{ border: "1px solid #ccc" }}>
						<SignaturePad
							canvasProps={{
								width: "500",
								height: "500",
								border: "1px solid #ccc"
							}}
							ref={(ref) => {
								sigPad = ref;
							}}
						/>
					</div>
				</Col>
			</Row>
		</Modal >
	);
});

export default SignatureModalComponent;
