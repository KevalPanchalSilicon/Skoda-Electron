import { Button, Result } from "antd"
import { useHistory } from "react-router-dom"

const Unauthorized = (props) => {
	const history = useHistory()
	return (
		<Result
			status="403"
			title={props.title ? props.title : "403"}
			subTitle={props.subtitle ? props.subtitle : "Sorry, you are not allowed to use this page."}
			extra={(props.goback === undefined || props.goback) && (
				<Button type="primary" onClick={() => history.goBack()}>Go Back</Button>
			)}
		/>
	)
}

export default Unauthorized
