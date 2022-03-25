import React from 'react'

const WidgetBodyComponent = (props) => {

	return (
		<div style={{ maxHeight: "999px" }} className="widget_wrapper">
			<ul className="widget_data" >
				<li className="widget_row">
					<div className="widget_left">
						<div className="widget_name">
							<p title={`Developer`}>{`Utsav`}<span>{`Ahmedabad`}</span></p>
						</div>
					</div>
					<div className="widget_date">
						<p><span>{`Saturday`}</span>{`April`}</p>
					</div>
				</li>
			</ul>
		</div>
	)

}

export default WidgetBodyComponent
