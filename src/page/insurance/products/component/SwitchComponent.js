import React from 'react'
import { Switch } from 'antd'

const SwitchComponent = (props) => {
	return (
		<div>
			{
				props.values &&
				<Switch
					defaultChecked={props.values.status}
					onChange={(val) => props.onSwitchChange(val, props.values)}
				/>
			}
		</div>
	)
}

export default SwitchComponent
