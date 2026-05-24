import { NavLink } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-wrapper">
      <nav className="nav">
        <div className="nav-inner">
          <a href="/pc-build-advisor" className="nav-logo">装机助手</a>
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>首页</NavLink>
            <NavLink to="/hardware" className={({ isActive }) => isActive ? 'active' : ''}>硬件行情</NavLink>
            <NavLink to="/recommend" className={({ isActive }) => isActive ? 'active' : ''}>配置推荐</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>关于</NavLink>
          </div>
        </div>
      </nav>
      <main className="main">{children}</main>
      <footer className="footer">
        <p>数据来源：京东、什么值得买 | 仅供参考，实际价格以电商页面为准</p>
      </footer>
    </div>
  );
}
