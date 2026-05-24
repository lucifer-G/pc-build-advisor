import { Link } from 'react-router-dom';
import { useHardwareData } from '../hooks/useHardwareData';
import HardwareCard from '../components/HardwareCard';

export default function HomePage() {
  const { items, loading, lastUpdated } = useHardwareData();

  const topItems = items
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>找到最适合你的电脑配置</h1>
        <p>基于实时行情数据，根据预算和用途智能匹配最具性价比的装机方案</p>
        <div className="hero-actions">
          <Link to="/recommend" className="btn btn--primary">开始推荐</Link>
          <Link to="/hardware" className="btn btn--secondary">查看硬件行情</Link>
        </div>
      </section>

      <section className="home-section">
        <h2>近期热门硬件</h2>
        {loading ? (
          <p className="loading-text">加载中...</p>
        ) : (
          <div className="hardware-grid">
            {topItems.map(item => (
              <HardwareCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="home-section">
        <h2>快速推荐</h2>
        <div className="quick-links">
          <Link to="/recommend?usage=gaming" className="quick-link">🎮 游戏主机</Link>
          <Link to="/recommend?usage=office" className="quick-link">💼 办公电脑</Link>
          <Link to="/recommend?usage=design" className="quick-link">🎨 设计工作站</Link>
          <Link to="/recommend?usage=coding" className="quick-link">💻 编程开发</Link>
          <Link to="/recommend?usage=all-round" className="quick-link">🔧 全能主机</Link>
        </div>
      </section>

      {lastUpdated && (
        <p className="update-info">数据更新于: {lastUpdated}</p>
      )}
    </div>
  );
}
