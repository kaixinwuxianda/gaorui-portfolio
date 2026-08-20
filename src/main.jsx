import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const projectGroups = [
  { title: '<在校专业课>', items: [
    { label: '<2023>', slug: '2023', image: '/images/content1.jpg', title: 'A Seed Contains the Universe', hover: ['Tabletop ornament', '< 桌上器物 >'] },
    { label: '<2024>', slug: '2024', image: '/images/content2.jpg', title: 'Student Dormitory Design', hover: ['Dormitory design', '< 宿舍 >'] },
    { label: '<2025>', slug: '2025', image: '/images/content3.jpg', title: 'A Bathtub for Birds', hover: ['Small building design', '< 小建筑练习 >'] },
    { label: '<2026>', slug: '2026', image: '/images/content4.jpg', title: 'Architectural Studies', hover: ['"Screenshot Saved"', '< 截屏已保存 >'] },
  ]},
  { title: '<团队项目>', items: [
    { label: '2026 VELUX', slug: 'velux', image: '/images/content5.jpg', title: '2026 VELUX', hover: ['Sun the Quilt', '< 晒被子 >', '2026 Light of tomorrow', 'global winner'] },
    { label: '无止桥营造公社', subtitle: 'Bridge to China', slug: 'bridge-village', image: '/images/content6.jpg', title: 'Wu Zhi Qiao · Qiaoshan Village', hover: ['Qiaoshan Village', '< 桥山村 >'] },
    { label: '装置搭建', subtitle: 'Installation setup', slug: 'installation', image: '/images/content7.jpg', title: 'Installation Experiment', hover: ['Ting(Copter)', '< 蜓 >'] },
    { label: '雪构节', subtitle: 'Snow structure', slug: 'snow-festival', image: '/images/content8.jpg', title: 'Snow Structure Festival', hover: ['Ember’s Embrace', '< 琥珀怀抱 >'] },
  ]},
  { title: '<延伸领域>', items: [
    { label: '建筑摄影', subtitle: 'Architecture Photography', image: '/images/content9.jpg', title: 'Architectural Photography', hover: ['Not only architecture', '< 杂七杂八 >'] },
    { label: '平面作业', subtitle: 'Graphic Design', image: '/images/content10.jpg', title: 'Graphic Works', hover: ['Posters/brochures/', 'postcards', '< 海报 | 手册 | 明信片 >'] },
    { label: '模型制作', subtitle: 'Model making', image: '/images/content11.jpg', title: 'Model Making', hover: ['"So Funny!"', '< 真 tm 好玩! >'] },
    { label: '方向探索', subtitle: 'More...', image: '/images/content12.jpg', title: 'Direction Exploration', hover: ["don't know how to say", '< 不知道怎么形容\u00a0>'] },
  ]},
]
const projectMap = Object.fromEntries(projectGroups.flatMap(group => group.items).filter(item => item.slug).map(item => [item.slug, item]))

function Header({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const navigate = target => { onNavigate(target); setOpen(false) }
  return <header><button className="monogram" onClick={() => navigate('top')} aria-label="Back to top"><img src="/images/hello-mark.png" alt="Hello"/></button><nav className={open ? 'open' : ''}><button onClick={() => navigate('about')}>About</button><button onClick={() => navigate('projects')}>Projects</button><button onClick={() => navigate('contact')}>Contact</button></nav><button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? '×' : '☰'}</button></header>
}

function ProjectItem({ item }) {
  const visual = <><div className="project-image"><img src={item.image} alt={item.title}/><div className="project-overlay"><div>{item.hover.map((line, index) => <span key={index} style={line.includes('不知道怎么形容') ? { whiteSpace: 'nowrap' } : undefined}>{line}</span>)}</div></div></div><p className="project-caption"><span>{item.label}</span>{item.subtitle && <span>{item.subtitle}</span>}</p></>
  return item.slug ? <a className="project-item" href={`/projects/${item.slug}`}>{visual}</a> : <div className="project-item">{visual}</div>
}

function Home() {
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const [copied, setCopied] = useState('')
  const [slidesReady, setSlidesReady] = useState(false)
  useEffect(() => {
    const sources = ['/images/hero.jpg', '/images/hero-slide-2.jpg', '/images/hero-slide-3.jpg', '/images/hero-slide-4.jpg']
    Promise.all(sources.map(src => new Promise(resolve => {
      const image = new Image()
      image.src = src
      image.onload = () => image.decode?.().catch(() => {}).finally(resolve)
      image.onerror = resolve
    }))).then(() => setSlidesReady(true))
  }, [])
  const copy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      window.setTimeout(() => setCopied(''), 1600)
    } catch { window.prompt('Copy this text:', value) }
  }
  return <main>
    <section className="hero" id="top"><div className={`hero-slides ${slidesReady ? 'ready' : ''}`} aria-hidden="true"><img className="hero-slide zoom-in" src="/images/hero.jpg" alt=""/><img className="hero-slide zoom-out" src="/images/hero-slide-2.jpg" alt=""/><img className="hero-slide zoom-in" src="/images/hero-slide-3.jpg" alt=""/><img className="hero-slide zoom-out" src="/images/hero-slide-4.jpg" alt=""/></div><div className="hero-grain" /><Header onNavigate={go} /><div className="hero-content"><p className="eyebrow">PORTFOLIO / 2026</p><img className="hero-wordmark" src="/images/gaorui-mark.png" alt="Gao Rui"/><div className="hero-foot"><p>Architect in formation<br/>based in Xi'an, China</p><button className="scroll" onClick={() => go('about')}>Scroll to explore <i>↓</i></button></div></div></section>
    <section className="about section" id="about"><p className="section-tag">&lt;About&gt; 个人简介</p><div className="about-card"><div className="about-visual"><img src="/images/portrait.jpg" alt="Portrait illustration of Gao Rui"/></div><div className="about-copy"><div className="about-identities"><p>高瑞 \ Gao Rui</p><p>B.Arch Candidate, Xi’an<br/>University of Architecture<br/>and Technology</p><p>西安建筑科技大学<br/>建筑学 大四 在读</p><p>4th-year Undergraduate<br/>Student, Architecture</p></div><p className="intro">As an architecture student, I believe that all design should first serve the authentic living and inhabitation experiences of ordinary people.</p><div className="stats"><div><strong>2026</strong><span>Portfolio<br/>edition</span></div><div><strong>Xi'an</strong><span>Based in<br/>China</span></div></div></div></div></section>
    <section className="projects section" id="projects"><p className="section-tag">&lt;Projects&gt; 项目</p><div className="project-groups">{projectGroups.map(group => <div className="project-group" key={group.title}><h2>{group.title}</h2><div className="project-grid">{group.items.map(item => <ProjectItem item={item} key={item.label}/>)}</div></div>)}</div></section>
    <section className="contact section" id="contact"><p className="section-tag">&lt;Contact&gt; 联系</p><div className="contact-content"><div className="contact-row"><img src="/images/contact-wechat.png" alt="WeChat"/><span className="contact-label">微信 / <span className="contact-name">wechat</span></span><span className="contact-colon">:</span><b>kaixinwuxianda</b><button onClick={() => copy('kaixinwuxianda', 'wechat')}>{copied === 'wechat' ? 'Copied' : 'Copy'}</button></div><div className="contact-row"><img src="/images/contact-email.png" alt="Email"/><span className="contact-label">邮箱 / <span className="contact-name">Email</span></span><span className="contact-colon">:</span><b>2879937105@qq.com</b><button onClick={() => copy('2879937105@qq.com', 'email')}>{copied === 'email' ? 'Copied' : 'Copy'}</button></div><div className="contact-row"><img src="/images/contact-red.png" alt="Xiaohongshu"/><span className="contact-label">小红书 / <span className="contact-name">RED</span></span><span className="contact-colon">:</span><a href="https://www.xiaohongshu.com/user/profile/61f506050000000010004e00?wechatWid=b28a76efa0d7ccca0fade9a8c01f87ca" target="_blank" rel="noreferrer"><b>mikey0030</b></a><a className="external" href="https://www.xiaohongshu.com/user/profile/61f506050000000010004e00?wechatWid=b28a76efa0d7ccca0fade9a8c01f87ca" target="_blank" rel="noreferrer" aria-label="Open Xiaohongshu profile">↗</a></div><div className="contact-row"><img src="/images/contact-instagram.png" alt="Instagram"/><span className="contact-label"><span className="contact-name">Instagram</span></span><span className="contact-colon">:</span><a href="https://www.instagram.com/kaixinwuxianda" target="_blank" rel="noreferrer"><b>kaixinwuxianda</b></a><a className="external" href="https://www.instagram.com/kaixinwuxianda" target="_blank" rel="noreferrer" aria-label="Open Instagram profile">↗</a></div></div><footer><span>© Gao Rui 2026</span><button onClick={() => go('top')}>Back to top ↑</button></footer></section>
  </main>
}

function ProjectDetail({ project }) { return <main className="detail"><a className="back" href="/">← Back to portfolio</a><div className="detail-copy"><p className="section-tag">&lt;Project&gt;</p><h1>{project.title}</h1><p>{project.label}</p></div><img src={project.image} alt={project.title}/><p className="detail-note">Project page in preparation. More drawings, process material and project text will be added here.</p></main> }
const slug = window.location.pathname.split('/').filter(Boolean)[1]
createRoot(document.getElementById('root')).render(slug && projectMap[slug] ? <ProjectDetail project={projectMap[slug]} /> : <Home />)
