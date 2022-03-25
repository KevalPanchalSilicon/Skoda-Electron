import React from "react";
import { Select } from "antd";

const RecordPerPage = (props) => (
	<Select {...props}>
		<Select.Option value="50">50 per page</Select.Option>
		<Select.Option value="100">100 per page</Select.Option>
		<Select.Option value="500">500 per page</Select.Option>
		<Select.Option value="1000">1000 per page</Select.Option>
	</Select>
);

export default RecordPerPage;
