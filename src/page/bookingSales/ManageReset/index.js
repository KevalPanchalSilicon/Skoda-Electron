import { PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";


const ManageReset = observer((props) => {







	return (
		<PageHeader
			title={BreadcrumbConfig.ManageScheme.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.ManageScheme.path} />
			}
		>

		</PageHeader>
	);
});

export default ManageReset;
