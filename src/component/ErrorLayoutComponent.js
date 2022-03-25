import { Typography } from "antd";

const { Title } = Typography;

const ErrorLayoutComponent = (props) => {
	return (
		<div className="ErrorDivWrapper">
			<div className="ErrorImage">
				<img src={props.imgsrc} alt={props.title} />
			</div>
			<div className="ErrorText">
				<Title>{props.title}</Title>
				<p>{props.text}</p>
			</div>
		</div>
	);
};

export default ErrorLayoutComponent;
