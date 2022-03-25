import React from 'react'
import WidgetBodyComponent from './WidgetBodyComponent'
import WidgetHeaderComponent from './WidgetHeaderComponent'

const WidgetsLayoutComponent = (props) => {

	return (
		<div className="dashboard_widget_block">
			<WidgetHeaderComponent {...props} />
			<WidgetBodyComponent {...props} />
		</div>

	)

}

export default WidgetsLayoutComponent
