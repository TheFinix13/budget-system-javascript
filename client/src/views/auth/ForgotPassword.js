import { useState } from 'react';
import axios from 'axios';
import { authenticate } from '../../data/api';
import './css/ForgotPasswordScreen.css';

const ForgotPassword = () => {
	const [ email, setEmail ] = useState('');
	const [ error, setError ] = useState('');
	const [ success, setSuccess ] = useState('');

	const forgotPasswordHandler = async (e) => {
		e.preventDefault();

		try {
			const { data } = await axios.post(authenticate.forgotPassword, { email });
			setSuccess(data.msg);
			console.log(data);
		} catch (error) {
			setError(error.response.data.msg);
			setEmail('');
			setTimeout(() => {
				setError('');
			}, 5000);
		}
	};

	return (
		<div className="fs rs">
		<div className="forgotpassword-screen">
			<form onSubmit={forgotPasswordHandler} className="forgotpassword-screen__form">
				<h3 className="forgotpassword-screen__title">Forgot Password</h3>

				{error && <span className="error-message">{error}</span>}
				{success && <span className="success-message">{success}</span>}

				<div className="form-group">
					<p className="forgotpassword-screen__subtext">
						Please enter the email address you registered your account with. We will send you reset password
						link to this email.
					</p>
					<input
						type="email"
						required
						id="email"
						placeholder="Email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<button type="submit" className="btn-auth-password btn-auth primary">
					Send Email
				</button>
			</form>
		</div>
		</div>
	);
};

export default ForgotPassword;
