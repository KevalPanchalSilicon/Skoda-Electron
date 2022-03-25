import { Button } from "antd";
import { observer } from "mobx-react";
import { DateRangePicker, createStaticRanges } from 'react-date-range';
import { dateRangeArr } from "../utils/GlobalFunction";
const staticRanges = [
	...createStaticRanges(dateRangeArr)
];
export const DateRangePickerComponent = observer(({ changeFilter, openCal, handleReSync, setopenCal, payload }) => {

	const applyDateFilter = () => {
		setopenCal(!openCal)
		handleReSync()
	}

	return (
		<DateRangePicker
			fixedHeight={true}
			footerContent={<Button onClick={() => applyDateFilter()}>Apply</Button>}
			onChange={item => changeFilter(item)}
			showSelectionPreview={true}
			moveRangeOnFirstSelection={false}
			months={1}
			ranges={[payload]}
			staticRanges={staticRanges}
			direction="horizontal"
			preventSnapRefocus={true}
			calendarFocus="backwards"
		/>
	)
})
