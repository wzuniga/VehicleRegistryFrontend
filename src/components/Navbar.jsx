import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Navbar.css';

const ToggleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const Navbar = ({ onToggleSidebar, titleTo, user }) => {
  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : (user?.email?.[0] ?? 'U').toUpperCase();

  const title = titleTo
    ? <Link to={titleTo} className="navbar__title">Auto Check</Link>
    : <h1 className="navbar__title">Auto Check</h1>;

  return (
    <nav className="navbar">
      <div className="navbar__content">
        {onToggleSidebar && (
          <button className="navbar__toggle" onClick={onToggleSidebar} aria-label="Toggle menu">
            <ToggleIcon />
          </button>
        )}
        {title}
        {user && (
          <div className="navbar__user">
            <div className="navbar__avatar" aria-hidden="true">{initials}</div>
            <div className="navbar__user-info">
              <span className="navbar__username">{user?.name || user?.email}</span>
              <span className="navbar__credits">{user?.credits ?? 0} créditos</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onToggleSidebar: PropTypes.func,
  titleTo: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    credits: PropTypes.number,
  }),
};

export default Navbar;
