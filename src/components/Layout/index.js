import './index.scss';

// Layout now simply wraps continuous sections; sidebar removed.
const Layout = ({ children }) => {
  return (
    <div className="layout-root">
      <div className="layout-content">{children}</div>
    </div>
  );
};

export default Layout;

