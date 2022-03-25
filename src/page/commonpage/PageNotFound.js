import { Button, Result } from "antd"
import { useHistory } from "react-router-dom"

const PageNotFound = (props) => {
	const history = useHistory()
	return (
		<Result
			status="404"
			title={props.title ? props.title : "404"}
			subTitle={props.subtitle ? props.subtitle : "Sorry, the page you visited does not exist."}
			extra={(props.goback === undefined || props.goback) && (
				<Button type="primary" onClick={() => history.goBack()}>Go Back</Button>
			)}
		/>
	)
}

export default PageNotFound
