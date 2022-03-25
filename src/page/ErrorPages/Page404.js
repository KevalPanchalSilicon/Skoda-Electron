import ErrorLayoutComponent from "../../component/ErrorLayoutComponent"
import ErrorImg from "../../images/ErrorImages/404-page.png"

const Page404 = (props) => {
	return (
        <div className="mainErrorDiv page404_sec">
            <ErrorLayoutComponent 
                imgsrc={ErrorImg}
                title={""}
                text={"Invalid URL or unable to reach to the required resource"}
            />            
        </div>
	)
}

export default Page404
