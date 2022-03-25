import React from 'react'
import { faSyncAlt, faChevronUp, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WidgetHeaderComponent = (props) => {

	return (
		<div className="widget_title">
			<h3>{"Header"}</h3>
			<div className="refresh_toggle_icon">
				<FontAwesomeIcon icon={faSyncAlt} className="mr-10" />
				<FontAwesomeIcon icon={faFilter} />
				<FontAwesomeIcon icon={faChevronUp} />
			</div>
		</div>
	)

}

export default WidgetHeaderComponent
