import { Button, Drawer, PageHeader } from "antd";
import { observer } from "mobx-react";
import RecordPerPage from "../../component/RecordPerPage";
import useStore from "../../store";
import ListComponent from "./ListComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const NotificationList = observer((props) => {
	const {
		NotificationStore: {
			setPageSize,
			per_page,
		},
	} = useStore();

	// reset form and close add form
	const close = () => {
		// form.resetFields();
		// ManageInsuranceStore.editValues = null;
		props.close();
	};

	return (
		<>

			<Drawer
				className="addModal"
				title={`Notification`}
				width="60%"
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
						Close
					</Button>,
				]}
			>
				<PageHeader
					// title="Notifications"
					className="tableAreaSec"
				>
					<div className="listCountNew">
						<RecordPerPage
							key="1"
							style={{ width: "150px" }}
							defaultValue={per_page + " per page"}
							onChange={setPageSize}
						/>
					</div>

					<ListComponent />
				</PageHeader>
			</Drawer>
		</>
	);
});

export default NotificationList;
