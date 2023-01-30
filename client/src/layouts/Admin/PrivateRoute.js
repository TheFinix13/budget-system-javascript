import { Route, Redirect } from 'react-router-dom';
function PrivateRoute( {loggedIn,Component, ...rest }) {
	return (
		<Route
			{...rest}
			render={(props) => {
				if (loggedIn === true) return <Component key={props.location.key}/>;
				else {
					return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
				}
			}}
		/>
	);
}

export default PrivateRoute;
