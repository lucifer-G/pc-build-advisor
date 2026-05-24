export default function AboutPage() {
  return (
    <div className="about-page">
      <h1>关于装机助手</h1>

      <section className="about-section">
        <h2>项目说明</h2>
        <p>
          装机助手是一个免费的电脑配置推荐工具，致力于帮助用户根据预算和用途找到最具性价比的硬件搭配方案。
        </p>
      </section>

      <section className="about-section">
        <h2>数据来源</h2>
        <ul>
          <li>京东商城 - 硬件产品价格参考</li>
          <li>什么值得买(SMZDM) - 好价信息汇总</li>
          <li>中关村在线(ZOL) - 硬件规格参数</li>
        </ul>
        <p>数据通过 GitHub Actions 每周自动更新，确保价格信息相对时效性。</p>
      </section>

      <section className="about-section">
        <h2>免责声明</h2>
        <p>
          本网站提供的硬件价格仅供参考，实际购买价格以电商平台实时显示为准。
          推荐配置基于算法自动生成，不构成购买建议。硬件兼容性请以厂商官方规格为准。
        </p>
      </section>

      <section className="about-section">
        <h2>技术栈</h2>
        <p>React + Vite + TypeScript | GitHub Pages | GitHub Actions</p>
      </section>
    </div>
  );
}
