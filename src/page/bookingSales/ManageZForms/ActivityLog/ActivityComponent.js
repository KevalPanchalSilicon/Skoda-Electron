import React, { useEffect } from "react";
import { Form, Button, Drawer, Row, Col } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import { AgGridReact } from "@ag-grid-community/react";
import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { vsmCommon } from "../../../../config/messages";
import { DateComparator } from "../../../../utils/GlobalFunction";

const ActivityComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ActivityLogStore,
		ActivityLogStore: { ActivityLogList, setupGrid, onFilterChanged }
	} = useStore();

	useEffect(() => {
		if (props.visible && ActivityLogStore.viewActivityLogvalues) {
			ActivityLogStore.getActivityLog(ActivityLogStore.viewActivityLogvalues.id)
		}
	}, [ActivityLogStore, props.visible, form])

	// reset form and close add form
	const close = () => {
		props.close();
	};

	const gridOptions = {
		columnDefs: [
			{
				headerName: "# ID",
				field: "srno",
				filter: "agNumberColumnFilter",
				pinned: "left",
				minWidth: 120,
				width: 120,
			},
			{
				headerName: "Date",
				field: "created",
				filter: "agDateColumnFilter",
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
			},
			{
				headerName: "User",
				field: "user.name",
			},
			{
				headerName: "Note",
				field: "note",
			},
			{
				headerName: "Mode",
				field: "mode",
				filter: "agSetColumnFilter",
				defaultToNothingSelected: true,
				sortable: false
			},
			{
				headerName: "Status",
				field: "status",
				filter: "agSetColumnFilter",
				sortable: false
			},
		],
	};

	return ActivityLogStore.viewActivityLogvalues ? (
		<Drawer
			className="addModal"
			title="Activity Log"
			width="80%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="1"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Cancel
				</Button>,
			]}
		>
			<Row>
				<Col xs={{ span: 24 }}>
					<div className="ag-theme-alpine grid_wrapper">
						<AgGridReact
							rowHeight={LocalGridConfig.rowHeight}
							headerHeight={LocalGridConfig.headerHeight}
							rowData={ActivityLogList}
							modules={AllModules}
							columnDefs={gridOptions.columnDefs}
							defaultColDef={LocalGridConfig.defaultColDef}
							columnTypes={LocalGridConfig.columnTypes}
							overlayNoRowsTemplate={vsmCommon.noRecord}
							onGridReady={setupGrid}
							gridOptions={LocalGridConfig.options}
							onFilterChanged={onFilterChanged}
							onSortChanged={onFilterChanged}
						/>
					</div>
				</Col>
			</Row>
		</Drawer>
	) : null
});

export default ActivityComponent;
