import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authenticate } from '../../data/api';
import axios from 'axios';

import './css/ResetPasswordScreen.css';

const VerifyAccount = () => {
	const [ error, setError ] = useState('');
	const [ success, setSuccess ] = useState('');

	let { verifyToken } = useParams();

	const verifyAccountHandler = async () => {
		try {
			const { data } = await axios.put(authenticate.verifyAcct + verifyToken);
			setSuccess(data.msg);
		} catch (error) {
			console.log(error);
			setError(error.response.data.msg);
		}
	};

	useEffect(() => {
		verifyAccountHandler();
		// eslint-disable-next-line
	}, []);

	return (
		<div className="rs">
		<div className="resetpassword-screen">
			<form className="resetpassword-screen__form">
				<h3 className="resetpassword-screen__title">Account Verification</h3>
				{error && (
					<span className="error-message">
						{error} <br />{' '}
						<Link to="/" style={{ color: 'white', fontWeight: 'bold' }}>
							Login
						</Link>
					</span>
				)}
				{success && (
					<span className="success-message">
						{success}
						<br />{' '}
						<Link to="/" style={{ color: 'white', fontWeight: 'bold' }}>
							Login
						</Link>
					</span>
				)}
			</form>
		</div>
		</div>
	);
};

export default VerifyAccount;
