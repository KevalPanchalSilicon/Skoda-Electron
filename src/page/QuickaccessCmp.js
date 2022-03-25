import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { vsmNotify } from '../config/messages';
import useStore from '../store';

const QuickaccessCmp = () => {
	const { AUTH } = useStore()
	const history = useHistory()
	let { eKey } = useParams();
	let eKeyParsed = ""
	try {
		eKeyParsed = window.atob(eKey)
		eKeyParsed = JSON.parse(eKeyParsed)
	}
	catch (e) {
		console.log(e)
	}

	useEffect(() => {
		if (AUTH.token) {
			if (eKeyParsed) {
				history.push({ pathname: eKeyParsed.module, state: eKeyParsed })
			}
			else {
				vsmNotify.error({
					message: "Not able parse data. Please check url",
				});
			}
		}
		else {
			history.push({ pathname: "/login", state: { redirectPath: history.location.pathname } })
		}
	}, [AUTH, history, eKeyParsed])


	return null
}

export default QuickaccessCmp
