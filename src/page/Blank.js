import { PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../component/BreadcrumbComponent";
import { BreadcrumbConfig } from "../config/BreadcrumbConfig";

const Blank = observer(() => {
	return (
		<>
			<BreadcrumbComponent items={BreadcrumbConfig.BlankPage.path} />
			<PageHeader title={BreadcrumbConfig.BlankPage.title} />
		</>
	)
})

export default Blank
