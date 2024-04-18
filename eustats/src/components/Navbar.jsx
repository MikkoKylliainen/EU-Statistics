import {NavLink} from 'react-router-dom';
import useAction from '../hooks/useAction';
import useAppState from '../hooks/useAppState';
import './Navbar.css';

const Navbar = () => {
	const {logout} = useAction();
	const {user,isLogged} = useAppState();

	if(isLogged) {
		return(
			<nav className="navbar navbar-expand-lg">
				<div className="navLogo"><div className="logoImage"></div></div>
				<ul className="navbar-nav">
					<li className="nav-item">
						<NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Runs List</NavLink>
					</li>
					<li className="nav-item">
						<NavLink to="/form" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Add new run</NavLink>
					</li>
					<li className="nav-item">
						<NavLink to="/logout" className="nav-link" onClick={logout}>Logout</NavLink>
					</li>						
				</ul>
				<div className="userLink">
					<div className="nav-link">
						<div className="avatarPicture"></div>
						<div className="userUrl">{user}</div>
					</div>
				</div>
			</nav>
		);
	} else {
		return(
			<nav className="navbar">
				<div className="navLogo"><div className="logoImage"></div></div>
			</nav>
		);
	}
}

export default Navbar;