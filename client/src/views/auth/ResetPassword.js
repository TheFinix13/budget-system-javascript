import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { authenticate } from '../../data/api';
import './css/ResetPasswordScreen.css';

const ResetPassword = () => {
	const [ password, setPassword ] = useState('');
	const [ confirmPassword, setConfirmPassword ] = useState('');
	const [ error, setError ] = useState('');
	const [ success, setSuccess ] = useState('');

	let { resetToken } = useParams();

	const resetPasswordHandler = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setPassword('');
			setConfirmPassword('');
			setTimeout(() => {
				setError('');
			}, 5000);
			return setError("Passwords don't match");
		}

		try {
			const data  = await axios.put(authenticate.passwordReset + resetToken, { password });
			setSuccess(data.msg);
		} catch (error) {
			console.log(error);
			setError(error.response.data.msg);
			setTimeout(() => {
				setError('');
			}, 5000);
		}
	};

	return (
		<div className="rs fs">
		<div className="resetpassword-screen">
			<form onSubmit={resetPasswordHandler} className="resetpassword-screen__form">
				<h3 className="resetpassword-screen__title">Forgot Password</h3>
				{error && <span className="error-message">{error} </span>}
				{success && (
					<span className="success-message">
						{success}{' '}
						<Link to="/" style={{ color: 'white', fontWeight: 'bold' }}>
							Login
						</Link>
					</span>
				)}
				<div className="form-group">
					<label htmlFor="password">New Password:</label>
					<input
						type="password"
						required
						id="password"
						placeholder="Enter new password"
						autoComplete="true"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="confirmpassword">Confirm New Password:</label>
					<input
						type="password"
						required
						id="confirmpassword"
						placeholder="Confirm new password"
						autoComplete="true"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				<button type="submit" className="btn-auth-password btn-auth primary">
					Reset Password
				</button>
			</form>
		</div>
		</div>
	);
};

export default ResetPassword;
