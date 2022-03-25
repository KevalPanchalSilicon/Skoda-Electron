import ErrorLayoutComponent from "../../component/ErrorLayoutComponent"
import ErrorImg from "../../images/ErrorImages/Internal-Server-Error.png"

const NoInternet = (props) => {
	return (
        <div className="mainErrorDiv">
            <ErrorLayoutComponent 
                imgsrc={ErrorImg}
                title={"Internal Server Error"}
                text={"We're working towards creating something better. We won't be long."}
            />            
        </div>
	)
}

export default NoInternet
