import ErrorLayoutComponent from "../../component/ErrorLayoutComponent";
import ErrorImg from "../../images/ErrorImages/Invalid-API-Key.png";

const InvalidAPIKey = (props) => {
	return (
		<div className="mainErrorDiv">
			<ErrorLayoutComponent
				imgsrc={ErrorImg}
				title={"Invalid API Key"}
				text={
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry."
				}
			/>
		</div>
	);
};

export default InvalidAPIKey;
