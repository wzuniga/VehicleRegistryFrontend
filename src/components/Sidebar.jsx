import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Sidebar.css';

const itemShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  to: PropTypes.string,
  end: PropTypes.bool,
  onClick: PropTypes.func,
  active: PropTypes.bool,
});

const SidebarItem = ({ item, onNavigate }) => {
  const content = (
    <>
      <span className="sidebar__icon" aria-hidden="true">{item.icon}</span>
      {item.label}
    </>
  );

  if (item.to) {
    return (
      <li>
        <NavLink
          to={item.to}
          end={item.end}
          className={({ isActive }) => `sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
          onClick={onNavigate}
        >
          {content}
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        className={`sidebar__link sidebar__link--btn${item.active ? ' sidebar__link--active' : ''}`}
        onClick={() => { item.onClick?.(); onNavigate?.(); }}
      >
        {content}
      </button>
    </li>
  );
};

SidebarItem.propTypes = { item: itemShape.isRequired, onNavigate: PropTypes.func };

const Sidebar = ({ isOpen, onClose, items, footerItems }) => {
  const handleNavigate = () => {
    if (window.innerWidth <= 768) onClose?.();
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar__overlay" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
        <div className="sidebar__inner">
          <nav className="sidebar__nav">
            <ul className="sidebar__menu">
              {items.map((item) => (
                <SidebarItem key={item.key} item={item} onNavigate={handleNavigate} />
              ))}
            </ul>
          </nav>

          {footerItems && footerItems.length > 0 && (
            <div className="sidebar__footer">
              <ul className="sidebar__menu">
                {footerItems.map((item) => (
                  <SidebarItem key={item.key} item={item} onNavigate={handleNavigate} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  items: PropTypes.arrayOf(itemShape).isRequired,
  footerItems: PropTypes.arrayOf(itemShape),
};

export default Sidebar;
