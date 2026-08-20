import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

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
    { label: '建筑摄影', subtitle: 'Architecture Photography', slug: 'architecture-photography', image: '/images/content9.jpg', title: 'Architectural Photography', hover: ['Not only architecture', '< 杂七杂八 >'] },
    { label: '平面作业', subtitle: 'Graphic Design', slug: 'graphic-works', image: '/images/content10.jpg', title: 'Graphic Works', hover: ['Posters/brochures/', 'postcards', '< 海报 | 手册 | 明信片 >'] },
    { label: '模型制作', subtitle: 'Model making', slug: 'model-making', image: '/images/content11.jpg', title: 'Model Making', hover: ['"So Funny!"', '< 真 tm 好玩! >'] },
    { label: '方向探索', subtitle: 'More...', slug: 'direction-exploration', image: '/images/content12.jpg', title: 'Direction Exploration', hover: ["don't know how to say", '< 不知道怎么形容\u00a0>'] },
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
  const homeRef = useRef(null)
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

  useLayoutEffect(() => {
    const root = homeRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const context = gsap.context(() => {
      const hero = root.querySelector('.hero')
      const opening = gsap.timeline({ defaults: { ease: 'power4.inOut' } })

      gsap.set(root.querySelectorAll('.hero-curtain--top, .hero-curtain--bottom'), { yPercent: 0 })
      gsap.set(root.querySelector('.hero-wordmark'), { clipPath: 'inset(0 100% 0 0)', scaleX: 0.56, scaleY: 1.34, x: -120, opacity: 0 })
      gsap.set(hero.querySelectorAll('.eyebrow, header, .hero-foot'), { y: 28, opacity: 0 })

      opening
        .to(root.querySelector('.hero-curtain--top'), { yPercent: -103, duration: 1.3 }, 0.12)
        .to(root.querySelector('.hero-curtain--bottom'), { yPercent: 103, duration: 1.3 }, 0.12)
        .to(root.querySelector('.hero-wordmark'), { clipPath: 'inset(0 0% 0 0)', scaleX: 1, scaleY: 1, x: 0, opacity: 1, duration: 1.55, ease: 'expo.out' }, 0.55)
        .to(hero.querySelector('.eyebrow'), { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.92)
        .to(hero.querySelector('header'), { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 1.05)
        .to(hero.querySelector('.hero-foot'), { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 1.15)
        .set(root.querySelectorAll('.hero-curtain'), { display: 'none' })

      root.querySelectorAll('.motion-section').forEach(section => {
        const sectionTitle = section.querySelector('.motion-heading')
        const sectionTag = section.querySelector('.section-tag')
        const isProjects = section.classList.contains('projects')
        const isContact = section.classList.contains('contact')
        const revealItems = isProjects ? section.querySelectorAll('.project-item') : isContact ? section.querySelectorAll('.contact-row, footer') : section.querySelectorAll('.about-card')
        const imageFrames = section.querySelectorAll('.project-image, .about-visual')
        const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 72%', once: true } })

        timeline
          .from(sectionTitle, { yPercent: 115, rotate: 3, opacity: 0, duration: 1.35, ease: 'expo.out' })
          .from(sectionTag, { x: -28, opacity: 0, duration: 0.75, ease: 'power3.out' }, 0.1)
          .from(revealItems, { y: 86, opacity: 0, scale: 0.965, duration: 1.1, stagger: isProjects ? 0.075 : 0.13, ease: 'power4.out', clearProps: 'transform,opacity' }, 0.25)
          .from(imageFrames, { clipPath: 'inset(100% 0 0 0)', duration: 1.22, stagger: isProjects ? 0.07 : 0.12, ease: 'power4.inOut', clearProps: 'clipPath' }, 0.34)

        const portrait = section.querySelector('.about-visual img')
        if (portrait) gsap.to(portrait, { yPercent: -7, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.9 } })
      })

      const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 350)
      return () => window.clearTimeout(refreshTimer)
    }, root)

    return () => context.revert()
  }, [])
  const copy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      window.setTimeout(() => setCopied(''), 1600)
    } catch { window.prompt('Copy this text:', value) }
  }
  return <main ref={homeRef} className="home">
    <section className="hero" id="top"><div className={`hero-slides ${slidesReady ? 'ready' : ''}`} aria-hidden="true"><img className="hero-slide zoom-in" src="/images/hero.jpg" alt=""/><img className="hero-slide zoom-out" src="/images/hero-slide-2.jpg" alt=""/><img className="hero-slide zoom-in" src="/images/hero-slide-3.jpg" alt=""/><img className="hero-slide zoom-out" src="/images/hero-slide-4.jpg" alt=""/></div><div className="hero-curtain hero-curtain--top" aria-hidden="true"/><div className="hero-curtain hero-curtain--bottom" aria-hidden="true"/><div className="hero-grain" /><Header onNavigate={go} /><div className="hero-content"><p className="eyebrow">PORTFOLIO / 2026</p><img className="hero-wordmark" src="/images/gaorui-mark.png" alt="Gao Rui"/><div className="hero-foot"><p>Architect in formation<br/>based in Xi'an, China</p><button className="scroll" onClick={() => go('about')}>Scroll to explore <i>↓</i></button></div></div></section>
    <section className="about section motion-section" id="about"><p className="motion-heading" aria-hidden="true">ABOUT</p><p className="section-tag">&lt;About&gt; 个人简介</p><div className="about-card"><div className="about-visual"><img src="/images/portrait.jpg" alt="Portrait illustration of Gao Rui"/></div><div className="about-copy"><div className="about-identities"><p>高瑞 \ Gao Rui</p><p>B.Arch Candidate, Xi’an<br/>University of Architecture<br/>and Technology</p><p>西安建筑科技大学<br/>建筑学 大四 在读</p><p>4th-year Undergraduate<br/>Student, Architecture</p></div><p className="intro">As an architecture student, I believe that all design should first serve the authentic living and inhabitation experiences of ordinary people.</p><div className="stats"><div><strong>2026</strong><span>Portfolio<br/>edition</span></div><div><strong>Xi'an</strong><span>Based in<br/>China</span></div></div></div></div></section>
    <section className="projects section motion-section" id="projects"><p className="motion-heading" aria-hidden="true">PROJECTS</p><p className="section-tag">&lt;Projects&gt; 项目</p><div className="project-groups">{projectGroups.map(group => <div className="project-group" key={group.title}><h2>{group.title}</h2><div className="project-grid">{group.items.map(item => <ProjectItem item={item} key={item.label}/>)}</div></div>)}</div></section>
    <section className="contact section motion-section" id="contact"><p className="motion-heading" aria-hidden="true">CONTACT</p><p className="section-tag">&lt;Contact&gt; 联系</p><div className="contact-content"><div className="contact-row"><img src="/images/contact-wechat.png" alt="WeChat"/><span className="contact-label">微信 / <span className="contact-name">wechat</span></span><span className="contact-colon">:</span><b>kaixinwuxianda</b><button onClick={() => copy('kaixinwuxianda', 'wechat')}>{copied === 'wechat' ? 'Copied' : 'Copy'}</button></div><div className="contact-row"><img src="/images/contact-email.png" alt="Email"/><span className="contact-label">邮箱 / <span className="contact-name">Email</span></span><span className="contact-colon">:</span><b>2879937105@qq.com</b><button onClick={() => copy('2879937105@qq.com', 'email')}>{copied === 'email' ? 'Copied' : 'Copy'}</button></div><div className="contact-row"><img src="/images/contact-red.png" alt="Xiaohongshu"/><span className="contact-label">小红书 / <span className="contact-name">RED</span></span><span className="contact-colon">:</span><a href="https://www.xiaohongshu.com/user/profile/61f506050000000010004e00?wechatWid=b28a76efa0d7ccca0fade9a8c01f87ca" target="_blank" rel="noreferrer"><b>mikey0030</b></a><a className="external" href="https://www.xiaohongshu.com/user/profile/61f506050000000010004e00?wechatWid=b28a76efa0d7ccca0fade9a8c01f87ca" target="_blank" rel="noreferrer" aria-label="Open Xiaohongshu profile">↗</a></div><div className="contact-row"><img src="/images/contact-instagram.png" alt="Instagram"/><span className="contact-label"><span className="contact-name">Instagram</span></span><span className="contact-colon">:</span><a href="https://www.instagram.com/kaixinwuxianda" target="_blank" rel="noreferrer"><b>kaixinwuxianda</b></a><a className="external" href="https://www.instagram.com/kaixinwuxianda" target="_blank" rel="noreferrer" aria-label="Open Instagram profile">↗</a></div></div><footer><span>© Gao Rui 2026</span><button onClick={() => go('top')}>Back to top ↑</button></footer></section>
  </main>
}

function Project2023() {
  return <main className="project-page project-2023">
    <a className="project-back" href="/">← back to portfolio</a>
    <div className="project-heading">
      <p className="project-meta">&lt;project&gt;&nbsp;&nbsp;&nbsp;&nbsp;&lt;2023&gt;</p>
      <h1>A Seed Contains the Universe</h1>
      <h2>芥子须弥</h2>
    </div>
    <div className="project-images">
      <img src="/images/1.1.jpg" alt="A Seed Contains the Universe model detail" />
      <img src="/images/1.2.jpg" alt="A Seed Contains the Universe drawing" />
    </div>
    <p className="project-description">During first year, Our subject is to craft a small tabletop object by hand. While fulfilling its basic function, this compact artifact was also intended to symbolize a vast space where people could inhabit and move-a concept embodied in the ancient Chinese philosophy &quot;A mustard seed contains the universe (芥子须弥)&quot;</p>
  </main>
}

function Project2024() {
  return <main className="project-page project-2024">
    <a className="project-back" href="/">← back to portfolio</a>
    <div className="project-heading">
      <p className="project-meta">&lt;project&gt;&nbsp;&nbsp;&nbsp;&nbsp;&lt;2024&gt;</p>
      <h1>Student Dormitory Design</h1>
      <h2>学生宿舍设计</h2>
    </div>
    <div className="project-images">
      <img src="/images/2.1.jpg" alt="Student dormitory design drawing one" />
      <img src="/images/2.2.jpg" alt="Student dormitory design drawing two" />
      <img src="/images/2.3.jpg" alt="Student dormitory design drawing three" />
      <img src="/images/2.4.jpg" alt="Student dormitory design model" />
    </div>
    <p className="project-description">文字介绍正在施工中......<img className="construction-mark" src="/images/under-construction.png" alt="Under construction" /></p>
  </main>
}

function Project2025() {
  return <main className="project-page project-2025">
    <a className="project-back" href="/">← back to portfolio</a>
    <div className="project-heading">
      <p className="project-meta">&lt;project&gt;&nbsp;&nbsp;&nbsp;&nbsp;&lt;2025&gt;</p>
      <h1>A Bathtub for Birds</h1>
      <h2>small campus building design</h2>
    </div>
    <div className="project-images">
      <img src="/images/3.1.jpg" alt="Small campus building design image one" />
      <img src="/images/3.2.jpg" alt="Small campus building design image two" />
      <img src="/images/3.3.jpg" alt="Small campus building design image three" />
      <img src="/images/3.4.jpg" alt="Small campus building design image four" />
    </div>
    <p className="project-description">文字介绍正在施工中......<img className="construction-mark" src="/images/under-construction.png" alt="Under construction" /></p>
  </main>
}

function Project2026() {
  return <main className="project-page project-2026">
    <a className="project-back" href="/">← back to portfolio</a>
    <div className="project-heading">
      <p className="project-meta">&lt;project&gt;&nbsp;&nbsp;&nbsp;&nbsp;&lt;2026&gt;</p>
      <h1>&lt;截屏已保存&gt;</h1>
      <h2>Screenshot Saved</h2>
    </div>
    <div className="project-images">
      <img src="/images/4.1.jpg" alt="Screenshot Saved image one" />
      <img src="/images/4.2.jpg" alt="Screenshot Saved image two" />
      <img src="/images/4.3.jpg" alt="Screenshot Saved image three" />
      <img src="/images/4.4.jpg" alt="Screenshot Saved image four" />
      <img src="/images/4.5.jpg" alt="Screenshot Saved image five" />
      <img src="/images/4.6.jpg" alt="Screenshot Saved image six" />
    </div>
    <p className="project-description">... ...</p>
  </main>
}

function ProjectVelux() {
  const awardLink = 'https://www.daylightandarchitecture.com/news/global-winner-light-of-tomorrow-by-velux-announced/'
  return <main className="project-page project-velux">
    <a className="project-back" href="/">← back to portfolio</a>
    <div className="project-heading">
      <p className="project-meta">&lt;team work 团队项目&gt;&nbsp;&nbsp;&nbsp;&nbsp;&lt;2026 VELUX&gt;</p>
      <h1>&lt;Sun the Quilt&gt;</h1>
      <h2>A Domestic Composite between Indoor Climate and Public Exposure</h2>
    </div>
    <div className="project-images">
      <img src="/images/5.1.jpg" alt="Sun the Quilt image one" />
      <img src="/images/5.2.jpg" alt="Sun the Quilt image two" />
      <video src="/images/5.3.mp4" controls playsInline preload="metadata" aria-label="Sun the Quilt video" />
      <img src="/images/5.4.jpg" alt="Sun the Quilt image three" />
    </div>
    <a className="project-description project-award" href={awardLink} target="_blank" rel="noreferrer">该作品获2026 VELUX Light of tomorrow全球总冠军 <span aria-hidden="true">↗</span></a>
  </main>
}

function ProjectBridgeVillage() {
  return <main className="project-page project-bridge-village">
    <a className="project-back" href="/">← back to portfolio</a>
    <div className="project-heading">
      <p className="project-meta">&lt;team work 团队项目&gt;&nbsp;&nbsp;&nbsp;&nbsp;&lt;Bridge to China&gt;</p>
      <h1>&lt;桥山村村民活动中心设计&gt;</h1>
      <h2>Qiaoshan Village Community Activity Center Design</h2>
    </div>
    <div className="project-images">
      <img src="/images/6.1.jpg" alt="Qiaoshan Village Community Activity Center Design image one" />
      <img src="/images/6.2.jpg" alt="Qiaoshan Village Community Activity Center Design image two" />
      <img src="/images/6.3.jpg" alt="Qiaoshan Village Community Activity Center Design image three" />
    </div>
    <p className="project-description">该项目正在施工中（2026.8）<img className="construction-mark" src="/images/under-construction.png" alt="Under construction" /></p>
  </main>
}

function ProjectInstallation() {
  return <main className="project-page project-installation">
    <a className="project-back" href="/">← back to portfolio</a>
    <div className="project-heading">
      <p className="project-meta">&lt;team work 团队项目&gt;&nbsp;&nbsp;&nbsp;&nbsp;&lt;installation&gt;</p>
      <h1>&lt;蜓(Ting)&gt;</h1>
      <h2>installation setup</h2>
    </div>
    <div className="project-images">
      <img src="/images/7.1.jpg" alt="Ting installation image one" />
      <video src="/images/7.2.mp4" controls playsInline preload="metadata" aria-label="Ting installation video" />
      <img src="/images/7.3.jpg" alt="Ting installation image two" />
    </div>
    <p className="project-description">项目位于陕西省西安市长安区黄良街办立邵村立元东路1号</p>
  </main>
}

function ProjectSnowFestival() {
  return <main className="project-page project-snow-festival">
    <a className="project-back" href="/">← back to portfolio</a>
    <div className="project-heading">
      <p className="project-meta">&lt;team work 团队项目&gt;&nbsp;&nbsp;&nbsp;&nbsp;&lt;Snow structure&gt;</p>
      <h1>&lt;Snow&gt;</h1>
      <h2>2025 HIT</h2>
    </div>
    <div className="project-images">
      <img src="/images/8.1.jpg" alt="Snow Structure Festival image one" />
      <img src="/images/8.2.jpg" alt="Snow Structure Festival image two" />
    </div>
    <p className="project-description">... ...</p>
  </main>
}

const galleryProjects = {
  'architecture-photography': { className: 'photo-columns', images: ['9.1.jpg', '9.2.jpg', '9.3.jpg', '9.4.jpg'], alt: 'Architecture photography' },
  'graphic-works': { className: 'photo-columns', images: ['10.1.jpg', '10.2.jpg', '10.3.jpg', '10.4.jpg'], alt: 'Graphic work' },
  'model-making': { className: 'gallery-single', images: ['11.1.jpg', '11.2.jpg'], alt: 'Model making' },
  'direction-exploration': { className: 'gallery-single gallery-narrow', images: ['12.1.jpg', '12.2.jpg', '12.3.jpg'], alt: 'Direction exploration' },
}

function ProjectGallery({ project }) {
  const [selected, setSelected] = useState(null)
  const close = () => setSelected(null)
  const imageButton = (image, index) => <button className="gallery-image" key={image} onClick={() => setSelected(image)} aria-label={`Enlarge ${project.alt} image ${index + 1}`}><img src={`/images/${image}`} alt={`${project.alt} image ${index + 1}`} /></button>
  const isTwoColumnGallery = project.className === 'photo-columns'
  return <main className="project-page gallery-page">
    <a className="project-back" href="/">← back to portfolio</a>
    <div className={`gallery-images ${project.className}`}>
      {isTwoColumnGallery ? <><div className="gallery-column">{project.images.filter((_, index) => index % 2 === 0).map((image, index) => imageButton(image, index * 2))}</div><div className="gallery-column">{project.images.filter((_, index) => index % 2 === 1).map((image, index) => imageButton(image, index * 2 + 1))}</div></> : project.images.map(imageButton)}
    </div>
    {selected && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged image" onClick={close}><button className="lightbox-close" onClick={close} aria-label="Close enlarged image">×</button><img src={`/images/${selected}`} alt={`${project.alt} enlarged`} onClick={event => event.stopPropagation()} /></div>}
  </main>
}

function ProjectDetail({ project }) { return <main className="detail"><a className="back" href="/">← Back to portfolio</a><div className="detail-copy"><p className="section-tag">&lt;Project&gt;</p><h1>{project.title}</h1><p>{project.label}</p></div><img src={project.image} alt={project.title}/><p className="detail-note">Project page in preparation. More drawings, process material and project text will be added here.</p></main> }
const slug = window.location.pathname.split('/').filter(Boolean)[1]
createRoot(document.getElementById('root')).render(slug === '2023' ? <Project2023 /> : slug === '2024' ? <Project2024 /> : slug === '2025' ? <Project2025 /> : slug === '2026' ? <Project2026 /> : slug === 'velux' ? <ProjectVelux /> : slug === 'bridge-village' ? <ProjectBridgeVillage /> : slug === 'installation' ? <ProjectInstallation /> : slug === 'snow-festival' ? <ProjectSnowFestival /> : slug && galleryProjects[slug] ? <ProjectGallery project={galleryProjects[slug]} /> : slug && projectMap[slug] ? <ProjectDetail project={projectMap[slug]} /> : <Home />)
