'use client'

import { useEffect } from 'react'

export const metadata = {
  title: 'La Curaduría · Investor Teaser 2026',
}

const LOGO_PATHS = `
<path d="M180.672 84.3927L159.121 93.714L137.57 103.035L128.253 81.4749L118.935 59.9146L109.618 38.3543L131.169 29.0331L140.487 50.5934L149.804 72.1537L171.355 62.8324L192.906 53.5112L214.457 44.19C219.604 56.0858 214.127 69.9224 202.223 75.0715L180.672 84.3927Z" fill="#FFFFF6"/>
<path d="M302.087 2.65383L325.447 5.01714L323.084 28.3862L320.722 51.7553L318.36 75.1244L295 72.7611L297.363 49.392C296.056 62.3044 284.548 71.7048 271.641 70.3978L248.282 68.0344L224.923 65.6711L227.285 42.3021C229.898 16.4376 252.98 -2.36326 278.781 0.237705L302.14 2.60102L302.074 2.65383H302.087ZM297.416 49.392L299.778 26.0229L276.419 23.6596C263.512 22.3525 252.004 31.753 250.697 44.6654L274.056 47.0287L297.416 49.392Z" fill="#FFFFF6"/>
<path d="M366.516 80.0226L386.101 92.9615L405.686 105.9L392.753 125.493L373.168 112.555L353.583 99.6157C331.94 85.317 325.974 56.1387 340.267 34.486C347.433 23.6332 361.977 20.7022 372.785 27.8317L392.37 40.7705L411.955 53.7093L431.539 66.6481C424.373 77.5009 409.83 80.4319 399.021 73.3024L379.437 60.3636L359.852 47.4248V47.4908C352.712 58.3435 355.721 72.8799 366.516 80.0226Z" fill="#FFFFF6"/>
<path d="M430.959 99.5892L451.48 88.1687L462.896 108.699L442.374 120.12C431.038 126.431 426.96 140.729 433.268 152.071L444.684 172.601L465.206 161.181L485.727 149.76L497.143 170.291L476.621 181.711L456.099 193.132L435.578 204.552L424.162 184.022L412.746 163.491L412.72 163.57C400.103 140.888 408.233 112.251 430.945 99.6024L430.959 99.5892Z" fill="#FFFFF6"/>
<path d="M434.601 302.9L435.076 279.425L458.541 279.901C458.277 292.892 447.548 303.151 434.601 302.887V302.9ZM506.474 233.876L505.999 257.35L505.523 280.825C505.259 293.817 494.53 304.075 481.584 303.811C468.597 303.547 458.343 292.813 458.594 279.861L459.069 256.386C459.333 243.395 449.026 232.701 436.092 232.436L436.568 208.962C462.5 209.49 483.114 230.971 482.587 256.901L483.062 233.427L483.537 209.952L507.002 210.427L506.949 210.374L506.474 233.849V233.876Z" fill="#FFFFF6"/>
<path d="M453.605 408.246L440.949 428.024L421.179 415.362L401.41 402.701L381.64 390.039L394.297 370.261L414.066 382.923C403.139 375.925 399.958 361.402 406.953 350.483L419.609 330.706L432.265 310.928L452.035 323.589C473.929 337.611 480.264 366.697 466.288 388.56L453.632 408.338V408.259L453.605 408.246ZM414.027 382.976L433.796 395.637L446.452 375.859C453.447 364.927 450.266 350.404 439.339 343.42L426.683 363.198L414.027 382.976Z" fill="#FFFFF6"/>
<path d="M387.447 467.949L366.477 478.485C343.289 490.13 315.047 480.756 303.407 457.559C297.574 445.94 302.285 431.853 313.859 426.043L334.83 415.508L355.8 404.972L376.771 394.436L387.302 415.415L397.833 436.395L408.365 457.374L408.431 457.4L387.46 467.936L387.447 467.949ZM376.876 446.983L366.345 426.004L345.374 436.54L324.404 447.076C330.237 458.694 344.332 463.342 355.906 457.532L376.876 446.996V446.983Z" fill="#FFFFF6"/>
<path d="M297.983 482.512L297.6 506L274.122 505.617L274.505 482.129C274.716 469.151 264.383 458.47 251.41 458.258L227.932 457.876L227.549 481.363L227.166 504.851L203.688 504.468L204.071 480.981L204.454 457.493L204.836 434.005L228.314 434.388L251.792 434.771L251.74 434.718C277.672 435.14 298.405 456.502 297.983 482.499V482.512Z" fill="#FFFFF6"/>
<path d="M141.925 480.743L121.865 468.557L101.805 456.37C90.7065 449.624 87.2092 435.18 93.9266 424.116C100.67 413.012 115.108 409.513 126.168 416.234L146.227 428.42C157.326 435.167 171.751 431.615 178.468 420.538L198.528 432.724C185.067 454.905 156.152 461.968 133.98 448.488L154.04 460.675L174.1 472.861L161.919 492.929H161.985L141.925 480.73V480.743ZM118.289 383.913L138.349 396.099L126.168 416.168C115.069 409.421 111.571 394.977 118.289 383.913Z" fill="#FFFFF6"/>
<path d="M103.798 359.937L115.016 380.56L94.4017 391.782L83.184 371.159L71.9663 350.536L51.3521 361.759L62.5698 382.382C68.7593 393.762 64.589 408.008 53.1734 414.227L30.7248 372.941L19.5071 352.319L40.1212 341.096L60.7354 329.874L49.5177 309.251L70.1319 298.028L103.798 359.937Z" fill="#FFFFF6"/>
<path d="M0.437086 225.307L0.819808 201.819L24.2978 202.202L47.7757 202.585L71.2537 202.968L70.871 226.456L47.393 226.073C60.3659 226.284 70.6994 236.965 70.4883 249.93L70.1055 273.418L69.7228 296.906L46.2449 296.523C20.2594 296.101-0.40754 274.686 0.00157609 248.742L0.384297 225.254L0.437086 225.307ZM47.393 226.007L23.9151 225.624L23.5323 249.112C23.3212 262.09 33.6546 272.771 46.6276 272.983L47.0103 249.495L47.393 226.007Z" fill="#FFFFF6"/>
<path d="M63.8764 107.709L49.1614 127.87L37.5214 143.832C35.8322 146.156 36.3337 149.417 38.6564 151.107L54.6119 162.752L66.4235 146.565C68.0335 144.36 71.1085 143.885 73.3125 145.496L89.4923 157.312L74.7774 177.473C66.6478 188.616 51.0354 191.046 39.9101 182.913L19.7579 168.191C8.61938 160.058 6.19108 144.439 14.3206 133.309L29.0356 113.149L43.7505 92.9878C51.8801 81.8578 67.4925 79.4153 78.6178 87.5482L78.5914 87.5878L63.9028 107.709H63.8764ZM78.565 87.6671L78.631 87.5746L98.7832 102.296C90.6537 113.426 93.0952 129.058 104.22 137.178L89.5055 157.339L89.4791 157.378C67.2153 141.125 62.3587 109.953 78.565 87.6538V87.6671Z" fill="#FF736C"/>
<path d="M116.652 130.907C124.109 130.907 130.153 124.859 130.153 117.4C130.153 109.941 124.109 103.893 116.652 103.893C109.196 103.893 103.152 109.941 103.152 117.4C103.152 124.859 109.196 130.907 116.652 130.907Z" fill="#FF736C"/>
`

function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 507 506" dangerouslySetInnerHTML={{ __html: LOGO_PATHS }} />
  )
}

export default function InvestorPage() {
  useEffect(() => {
    let cx = -100, cy = -100, rx = -100, ry = -100
    const cur = document.getElementById('cur')
    const ring = document.getElementById('cr')

    const onMove = (e: MouseEvent) => {
      cx = e.clientX; cy = e.clientY
      if (cur) { cur.style.opacity = '1'; cur.style.transform = `translate(${cx - 5}px,${cy - 5}px)` }
      if (ring) ring.style.opacity = '1'
    }
    document.addEventListener('mousemove', onMove)

    let raf: number
    const loop = () => {
      rx += (cx - rx) * 0.12; ry += (cy - ry) * 0.12
      if (ring) ring.style.transform = `translate(${rx - 16}px,${ry - 16}px)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
      { threshold: 0.07 }
    )
    document.querySelectorAll('.rv').forEach(el => io.observe(el))

    const secs = Array.from(document.querySelectorAll('section[id]')) as HTMLElement[]
    const navLinks = Array.from(document.querySelectorAll('.na')) as HTMLElement[]
    const onScroll = () => {
      const y = window.scrollY + 80
      let active = ''
      secs.forEach(s => { if (s.offsetTop <= y) active = s.id })
      navLinks.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + active))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{--coral:#FF736C;--bg:#171C14;--cream:#FFFFF6;--green:#00AA74;--yellow:#FFC335;--cyan:#75E6F9;--surf:#1E2419;--bord:#2E3828;--t2:#7A9070;--t3:#3D5035;}
        html{scroll-behavior:smooth;}
        body{background:var(--bg);color:var(--cream);font-family:'Barlow',sans-serif;overflow-x:hidden;}
        #cur{width:10px;height:10px;background:var(--coral);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9999;opacity:0;transition:width .15s,height .15s;}
        #cr{width:32px;height:32px;border:1.5px solid rgba(255,115,108,.5);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9998;opacity:0;}
        nav{position:fixed;top:0;left:0;right:0;z-index:999;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 48px;background:rgba(23,28,20,.96);border-bottom:1px solid var(--bord);}
        .nl{display:flex;align-items:center;gap:10px;}
        .nw{font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;}
        .nw b{color:var(--coral);font-weight:900;}
        .nc{display:flex;gap:2px;}
        .na{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);text-decoration:none;padding:5px 10px;border-radius:3px;transition:color .15s;}
        .na:hover,.na.on{color:var(--coral);}
        .nb{font-family:'DM Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:var(--coral);color:var(--bg);padding:9px 18px;border-radius:4px;text-decoration:none;}
        .nb:hover{opacity:.85;}
        section{padding:96px 48px;border-top:1px solid var(--bord);}
        #hero{border-top:none;min-height:100vh;display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:60px;padding-top:100px;position:relative;overflow:hidden;}
        .hgrid{position:absolute;inset:0;z-index:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 47px,rgba(46,56,40,.2) 47px,rgba(46,56,40,.2) 48px),repeating-linear-gradient(90deg,transparent,transparent 47px,rgba(46,56,40,.2) 47px,rgba(46,56,40,.2) 48px);}
        .hglow{position:absolute;z-index:0;pointer-events:none;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(255,115,108,.07) 0%,transparent 70%);top:-100px;right:-100px;}
        .hc,.hs{position:relative;z-index:1;}
        .h1{font-size:clamp(40px,5.5vw,84px);font-weight:900;line-height:.94;letter-spacing:-.03em;text-transform:uppercase;margin-bottom:24px;}
        .h1 .cr{color:var(--coral);}
        .hdesc{font-size:16px;font-weight:300;color:var(--t2);line-height:1.8;max-width:480px;margin-bottom:20px;}
        .hdesc b{color:var(--cream);font-weight:600;}
        .hpill{display:inline-block;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.13em;text-transform:uppercase;color:var(--t2);border:1px solid var(--bord);border-radius:4px;padding:7px 12px;}
        .hs{display:flex;flex-direction:column;gap:12px;}
        .card{background:var(--surf);border:1px solid var(--bord);border-radius:10px;padding:26px 28px;}
        .clbl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--t3);margin-bottom:12px;}
        .ctit{font-size:17px;font-weight:900;text-transform:uppercase;line-height:1.2;margin-bottom:10px;}
        .csub2{font-size:13px;font-weight:300;color:var(--t2);line-height:1.6;}
        .dlist{display:flex;flex-direction:column;gap:9px;margin-top:8px;}
        .di{display:flex;align-items:center;gap:10px;}
        .dd{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
        .dn{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;}
        .hscr{position:absolute;bottom:28px;left:48px;z-index:1;display:flex;align-items:center;gap:12px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.13em;text-transform:uppercase;color:var(--t3);}
        .hscr::before{content:'';width:30px;height:1px;background:var(--bord);}
        .eye{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--coral);margin-bottom:12px;}
        h2{font-size:clamp(26px,3.5vw,50px);font-weight:900;line-height:1.03;letter-spacing:-.02em;text-transform:uppercase;margin-bottom:14px;}
        h2 em{color:var(--coral);font-style:normal;}
        .lead{font-size:16px;font-weight:300;color:var(--t2);line-height:1.8;max-width:600px;margin-bottom:48px;}
        .g2{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start;}
        .bst{font-size:clamp(22px,3vw,38px);font-weight:900;line-height:1.1;letter-spacing:-.02em;text-transform:uppercase;margin-bottom:22px;}
        .bst em{color:var(--coral);font-style:normal;}
        .pb{font-size:15px;font-weight:300;color:var(--t2);line-height:1.8;}
        .pb b{color:var(--cream);font-weight:600;}
        .plist{display:flex;flex-direction:column;gap:10px;}
        .pill{background:var(--surf);border:1px solid var(--bord);border-radius:8px;padding:16px 20px;display:flex;align-items:flex-start;gap:12px;transition:transform .15s;}
        .pill:hover{transform:translateX(3px);}
        .pdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px;}
        .ph2{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.02em;margin-bottom:2px;}
        .ps{font-family:'DM Mono',monospace;font-size:9px;color:var(--t3);letter-spacing:.07em;text-transform:uppercase;}
        .bl{background:var(--surf);border:1px solid var(--bord);border-left:4px solid var(--coral);border-radius:8px;padding:24px 32px;margin-bottom:30px;}
        .bll{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--t3);margin-bottom:10px;}
        .blt{font-size:17px;font-weight:300;color:var(--t2);line-height:1.7;}
        .blt b{color:var(--cream);font-weight:600;}
        .sb{background:var(--coral);border-radius:10px;padding:32px 40px;margin-bottom:40px;display:flex;align-items:flex-start;gap:32px;}
        .snn{font-size:70px;font-weight:900;letter-spacing:-.04em;color:var(--bg);line-height:1;flex-shrink:0;}
        .st{font-size:16px;font-weight:600;color:var(--bg);line-height:1.5;margin-bottom:8px;padding-top:6px;}
        .ss{font-family:'DM Mono',monospace;font-size:9px;color:rgba(23,28,20,.5);letter-spacing:.05em;text-transform:uppercase;line-height:1.6;}
        .pt{font-size:clamp(20px,2.8vw,36px);font-weight:900;text-transform:uppercase;letter-spacing:-.01em;margin-bottom:30px;}
        .pt em{color:var(--coral);font-style:normal;}
        .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--bord);border:1px solid var(--bord);border-radius:10px;overflow:hidden;}
        .gc{background:var(--surf);padding:30px 24px;display:flex;flex-direction:column;gap:10px;transition:background .15s;}
        .gc:hover{background:#1f2820;}
        .gt{font-family:'DM Mono',monospace;font-size:9px;color:var(--t3);letter-spacing:.13em;text-transform:uppercase;}
        .gh{font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:.02em;line-height:1.3;}
        .gbody{font-size:13px;font-weight:300;color:var(--t2);line-height:1.7;flex:1;}
        .gbar{height:2px;border-radius:1px;}
        .sg{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
        .sc{background:var(--surf);border:1px solid var(--bord);border-radius:10px;padding:30px 24px;display:flex;flex-direction:column;gap:10px;transition:transform .15s,border-color .2s;}
        .sc:hover{transform:translateY(-3px);}
        .sc.a:hover{border-color:rgba(255,115,108,.4);}
        .sc.b:hover{border-color:rgba(117,230,249,.4);}
        .sc.c:hover{border-color:rgba(255,195,53,.4);}
        .sn2{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.13em;text-transform:uppercase;}
        .sh{font-size:20px;font-weight:900;text-transform:uppercase;}
        .sbody{font-size:13px;font-weight:300;color:var(--t2);line-height:1.7;flex:1;}
        .chip{display:inline-block;font-family:'DM Mono',monospace;font-size:9px;padding:4px 9px;border-radius:3px;border:1px solid;text-transform:uppercase;letter-spacing:.07em;width:fit-content;}
        .mw{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;}
        .mlist{display:flex;flex-direction:column;}
        .mi{display:flex;flex-direction:column;gap:8px;padding:26px 0 26px 20px;border-left:3px solid var(--bord);border-bottom:1px solid var(--bord);transition:border-left-color .2s;}
        .mi:last-child{border-bottom:none;}
        .mi:hover{border-left-color:var(--coral);}
        .mt2{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
        .ml2{font-family:'DM Mono',monospace;font-size:9px;color:var(--t3);letter-spacing:.12em;text-transform:uppercase;}
        .mbadge{font-family:'DM Mono',monospace;font-size:8px;padding:2px 7px;border-radius:3px;border:1px solid;text-transform:uppercase;letter-spacing:.07em;}
        .mv{font-size:34px;font-weight:900;letter-spacing:-.02em;line-height:1;}
        .md{font-size:13px;font-weight:300;color:var(--t2);line-height:1.65;}
        .mn{font-family:'DM Mono',monospace;font-size:9px;color:var(--t3);letter-spacing:.08em;text-transform:uppercase;}
        .bubs{display:flex;align-items:center;justify-content:center;padding-top:16px;}
        .b1{position:relative;width:270px;height:270px;border-radius:50%;border:2px solid var(--coral);background:rgba(255,115,108,.04);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .b1l{position:absolute;top:16px;left:0;right:0;text-align:center;}
        .bv{font-size:15px;font-weight:900;}
        .bla{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.07em;text-transform:uppercase;margin-top:2px;}
        .b2{width:172px;height:172px;border-radius:50%;background:rgba(117,230,249,.13);border:1.5px solid rgba(117,230,249,.35);display:flex;align-items:center;justify-content:center;position:relative;}
        .b2t{display:flex;flex-direction:column;align-items:center;}
        .b3{position:absolute;bottom:8px;right:8px;width:72px;height:72px;border-radius:50%;background:var(--coral);display:flex;flex-direction:column;align-items:center;justify-content:center;}
        .mr2{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:30px;}
        .mc{background:var(--surf);border:1px solid var(--bord);border-radius:10px;padding:28px 24px;display:flex;flex-direction:column;gap:10px;transition:transform .15s;}
        .mc:hover{transform:translateY(-3px);}
        .mh{font-size:18px;font-weight:900;text-transform:uppercase;}
        .mbody{font-size:13px;font-weight:300;color:var(--t2);line-height:1.65;flex:1;}
        .plans{display:flex;gap:8px;}
        .plan{flex:1;background:var(--surf);border:1px solid var(--bord);border-radius:7px;padding:18px 12px;text-align:center;transition:border-color .2s;}
        .plan:hover{border-color:rgba(255,115,108,.3);}
        .plan.f{background:var(--coral);border-color:var(--coral);}
        .pn{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:5px;}
        .plan.f .pn{color:var(--bg);}
        .pd{font-size:11px;font-weight:300;color:var(--t2);line-height:1.4;}
        .plan.f .pd{color:rgba(23,28,20,.75);}
        .iw{display:grid;grid-template-columns:1fr 1fr;gap:40px;}
        .ib{background:var(--coral);border-radius:10px;padding:42px 38px;display:flex;flex-direction:column;gap:20px;}
        .il{font-family:'DM Mono',monospace;font-size:9px;color:rgba(23,28,20,.55);letter-spacing:.16em;text-transform:uppercase;}
        .ia{font-size:52px;font-weight:900;letter-spacing:-.03em;color:var(--bg);line-height:1;}
        .ir{display:flex;flex-direction:column;gap:9px;padding-top:16px;border-top:1px solid rgba(23,28,20,.2);}
        .irow{font-size:14px;font-weight:600;color:var(--bg);display:flex;align-items:center;gap:8px;}
        .irow::before{content:'—';color:rgba(23,28,20,.35);}
        .rc{display:flex;flex-direction:column;gap:12px;justify-content:center;}
        .rcard{border-radius:9px;padding:24px 28px;border:1px solid;display:flex;flex-direction:column;gap:5px;}
        .rn{font-size:42px;font-weight:900;letter-spacing:-.03em;line-height:1;}
        .rl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.11em;text-transform:uppercase;}
        .rd{font-size:12px;font-weight:300;color:var(--t2);margin-top:4px;}
        .ug{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin-top:44px;}
        .uc{border-radius:9px;padding:24px 20px;border:1px solid;display:flex;flex-direction:column;gap:8px;}
        .up{font-size:30px;font-weight:900;letter-spacing:-.02em;}
        .una{font-size:14px;font-weight:700;text-transform:uppercase;}
        .ui{font-size:12px;font-weight:300;color:var(--t2);}
        .ui::before{content:'· ';color:var(--t3);}
        #cta{text-align:center;position:relative;overflow:hidden;}
        .cglow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 110%,rgba(255,115,108,.1) 0%,transparent 58%);}
        .clogo{display:flex;justify-content:center;margin-bottom:32px;position:relative;}
        .ceye{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--coral);margin-bottom:16px;position:relative;}
        .ch{font-size:clamp(30px,5vw,66px);font-weight:900;line-height:1;letter-spacing:-.03em;text-transform:uppercase;margin-bottom:20px;position:relative;}
        .ch em{color:var(--coral);font-style:normal;}
        .csub{font-size:16px;font-weight:300;color:var(--t2);max-width:480px;margin:0 auto 44px;line-height:1.75;position:relative;}
        .csub b{color:var(--cream);font-weight:600;}
        .cbtn{display:inline-block;position:relative;background:var(--coral);color:var(--bg);font-family:'DM Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:17px 36px;border-radius:5px;text-decoration:none;transition:transform .15s,opacity .15s;}
        .cbtn:hover{transform:translateY(-2px);opacity:.9;}
        .cts{display:flex;justify-content:center;gap:40px;margin-top:32px;flex-wrap:wrap;position:relative;}
        .ct{display:flex;flex-direction:column;gap:5px;}
        .ctl{font-family:'DM Mono',monospace;font-size:9px;color:var(--t3);letter-spacing:.15em;text-transform:uppercase;}
        .ctv{font-family:'DM Mono',monospace;font-size:11px;color:var(--t2);text-decoration:none;border-bottom:1px solid var(--bord);padding-bottom:2px;transition:color .15s;}
        .ctv:hover{color:var(--cream);}
        footer{padding:24px 48px;border-top:1px solid var(--bord);display:flex;justify-content:space-between;align-items:center;}
        .fl{display:flex;align-items:center;gap:8px;}
        .fw{font-family:'DM Mono',monospace;font-size:10px;color:var(--t3);letter-spacing:.1em;text-transform:uppercase;}
        .fw b{color:var(--coral);font-weight:400;}
        .fr{font-family:'DM Mono',monospace;font-size:9px;color:var(--t3);letter-spacing:.08em;text-transform:uppercase;}
        .rv{opacity:0;transform:translateY(22px);transition:opacity .6s ease,transform .6s ease;}
        .rv.on{opacity:1;transform:none;}
        .d1{transition-delay:.1s;}.d2{transition-delay:.2s;}.d3{transition-delay:.32s;}
        @media(max-width:860px){
          nav{padding:0 18px;}.nc{display:none;}
          section,#hero,#cta,footer{padding-left:18px;padding-right:18px;}
          #hero{grid-template-columns:1fr;min-height:auto;padding-top:80px;}
          .g2,.mw,.iw{grid-template-columns:1fr;gap:32px;}
          .g3,.sg,.mr2,.ug{grid-template-columns:1fr;}
          .plans{flex-wrap:wrap;}
          .sb{flex-direction:column;gap:14px;}
          footer{flex-direction:column;gap:10px;text-align:center;}
        }
      `}</style>

      <div id="cur" />
      <div id="cr" />

      <nav>
        <div className="nl"><Logo size={30} /><div className="nw">La <b>Cu</b>raduría</div></div>
        <div className="nc">
          <a className="na on" href="#proposito">Propósito</a>
          <a className="na" href="#problema">Problema</a>
          <a className="na" href="#solucion">Solución</a>
          <a className="na" href="#mercado">Mercado</a>
          <a className="na" href="#modelo">Modelo</a>
          <a className="na" href="#inversion">Inversión</a>
        </div>
        <a className="nb" href="#inversion">Ver oportunidad</a>
      </nav>

      <section id="hero">
        <div className="hgrid" /><div className="hglow" />
        <div className="hc">
          <div className="eye">lacuraduria.net · Bogotá, Colombia · 2026</div>
          <h1 className="h1" style={{marginTop:18}}>
            <span>Simplificamos</span>
            <span style={{display:'block'}}>el acceso</span>
            <span className="cr" style={{display:'block'}}>a la cultura</span>
          </h1>
          <p className="hdesc" style={{marginTop:22}}>Una <b>guía cultural abierta</b> que articula un mapa, un catálogo y un marketplace para conectar públicos, creadores y gestores en una sola plataforma.</p>
          <span className="hpill">Guía cultural · Bogotá · Latinoamérica</span>
        </div>
        <div className="hs">
          <div className="card">
            <div className="clbl">Lo que somos</div>
            <div className="ctit">Guía cultural abierta de música, arte y cultura</div>
            <div className="csub2">Conectamos a quienes quieren comerse el mundo con la oferta cultural que los espera.</div>
          </div>
          <div className="card">
            <div className="clbl">Sectores que articula</div>
            <div className="dlist">
              <div className="di"><div className="dd" style={{background:'var(--coral)'}} /><div className="dn">Música</div></div>
              <div className="di"><div className="dd" style={{background:'var(--cyan)'}} /><div className="dn">Arte visual</div></div>
              <div className="di"><div className="dd" style={{background:'var(--yellow)'}} /><div className="dn">Cultura urbana</div></div>
            </div>
          </div>
        </div>
        <div className="hscr">Scroll para explorar</div>
      </section>

      <section id="proposito">
        <div className="eye rv">01 · Propósito</div>
        <h2 className="rv d1">Lo que <em>somos</em></h2>
        <div className="g2" style={{marginTop:8}}>
          <div className="rv d2">
            <div className="bst">Una <em>guía cultural abierta</em> que articula el ecosistema de arte, música y cultura de la ciudad</div>
            <p className="pb" style={{marginTop:0}}>La Curaduría conecta a quienes quieren <b>comerse el mundo</b> con la oferta cultural que los espera — de forma divertida, auténtica y significativa.</p>
            <p className="pb" style={{marginTop:14}}>Construimos una plataforma donde <b>públicos, creadores y gestores culturales</b> se encuentran, se descubren y colaboran en un mismo ecosistema.</p>
          </div>
          <div className="plist rv d3">
            <div className="pill"><div className="pdot" style={{background:'var(--coral)'}} /><div><div className="ph2">Para el público</div><div className="ps">Descubrir qué hacer, qué escuchar, qué ver</div></div></div>
            <div className="pill"><div className="pdot" style={{background:'var(--cyan)'}} /><div><div className="ph2">Para los creadores</div><div className="ps">Acceder a espacios, audiencias y colaboraciones</div></div></div>
            <div className="pill"><div className="pdot" style={{background:'var(--yellow)'}} /><div><div className="ph2">Para los gestores</div><div className="ps">Promocionar eventos y artistas eficientemente</div></div></div>
          </div>
        </div>
      </section>

      <section id="problema">
        <div className="eye rv">02 · El Problema</div>
        <h2 className="rv d1">El contexto que <em>nos trajo aquí</em></h2>
        <div className="bl rv d2"><div className="bll">Punto de partida</div><div className="blt">La mayoría de la gente <b>no está satisfecha</b> con la oferta de plataformas para explorar la oferta cultural de su ciudad.</div></div>
        <div className="sb rv d2">
          <div className="snn">75%</div>
          <div><div className="st">indicó no estar satisfecho con las plataformas disponibles para descubrir y explorar la oferta cultural.</div><div className="ss">En una encuesta realizada para trabajo de grado en Maestría en Gestión de la Cultura · 2025</div></div>
        </div>
        <div className="pt rv d2">La oferta cultural está <em>fragmentada</em></div>
        <div className="g3 rv d3">
          <div className="gc"><div className="gt">Usuario / Público</div><div className="gh">No hay un catálogo unificado</div><div className="gbody">Los usuarios no tienen acceso a un catálogo cultural organizado que les permita descubrir fácilmente qué hacer, qué escuchar y qué ver.</div><div className="gbar" style={{background:'var(--coral)'}} /></div>
          <div className="gc"><div className="gt">Creadores / Artistas</div><div className="gh">Los canales no tienen funciones especializadas</div><div className="gbody">Los canales que se usan hoy no fueron diseñados para la gestión cultural. Carecen de herramientas específicas para conectar artistas, espacios y audiencias.</div><div className="gbar" style={{background:'var(--cyan)'}} /></div>
          <div className="gc"><div className="gt">Gestores / Programadores</div><div className="gh">Las plataformas están saturadas</div><div className="gbody">Las plataformas que se usan están saturadas de información que distrae y no permite una experiencia enriquecedora ni una comunicación cultural efectiva.</div><div className="gbar" style={{background:'var(--yellow)'}} /></div>
        </div>
      </section>

      <section id="solucion">
        <div className="eye rv">03 · La Solución</div>
        <h2 className="rv d1">Una guía abierta que <em>articula</em> el ecosistema</h2>
        <div className="sg" style={{marginTop:8}}>
          <div className="sc a rv d1"><div className="sn2" style={{color:'var(--coral)'}}>01</div><div className="sh">Mapa</div><div className="sbody">Un mapa en tiempo real de la oferta cultural. Ubicaciones georreferenciadas de eventos, espacios, artistas y estudios en la ciudad.</div><span className="chip" style={{color:'var(--coral)',borderColor:'rgba(255,115,108,.3)',background:'rgba(255,115,108,.07)'}}>Discovery</span></div>
          <div className="sc b rv d2"><div className="sn2" style={{color:'var(--cyan)'}}>02</div><div className="sh">Catálogo</div><div className="sbody">Un catálogo articulado entre perfiles, espacios, eventos y contenidos — con funciones para seguir, guardar y conectar, y con recomendaciones personalizadas.</div><span className="chip" style={{color:'var(--cyan)',borderColor:'rgba(117,230,249,.3)',background:'rgba(117,230,249,.07)'}}>Conexión</span></div>
          <div className="sc c rv d3"><div className="sn2" style={{color:'var(--yellow)'}}>03</div><div className="sh">Marketplace</div><div className="sbody">Compra de entradas, contratación de talento, venta de arte y merch. Monetización directa dentro del ecosistema cultural.</div><span className="chip" style={{color:'var(--yellow)',borderColor:'rgba(255,195,53,.3)',background:'rgba(255,195,53,.07)'}}>Transacciones</span></div>
        </div>
      </section>

      <section id="mercado">
        <div className="eye rv">04 · Tamaño de Mercado</div>
        <h2 className="rv d1">Plataformas de intermediación <em>cultural</em></h2>
        <p className="lead rv d2">Montos anuales del mercado de plataformas digitales que intermedian eventos, experiencias culturales y monetización creativa.</p>
        <div className="mw">
          <div className="mlist rv d2">
            <div className="mi"><div className="mt2"><div className="ml2">TAM · Total Available Market</div><span className="mbadge" style={{color:'var(--coral)',borderColor:'rgba(255,115,108,.3)',background:'rgba(255,115,108,.07)'}}>Global</span></div><div className="mv" style={{color:'var(--coral)'}}>$90B USD</div><div className="md">Plataformas que intermedian eventos, experiencias culturales y monetización creativa: ticketing, discovery, suscripción y marketplace.</div><div className="mn">Anual</div></div>
            <div className="mi"><div className="mt2"><div className="ml2">SAM · Serviceable Available Market</div><span className="mbadge" style={{color:'var(--cyan)',borderColor:'rgba(117,230,249,.3)',background:'rgba(117,230,249,.07)'}}>LATAM</span></div><div className="mv" style={{color:'var(--cyan)'}}>$9B USD</div><div className="md">Mercado latinoamericano de eventos urbanos, ticketing digital y plataformas culturales con crecimiento acelerado en música en vivo y economía creativa.</div><div className="mn">Anual</div></div>
            <div className="mi"><div className="mt2"><div className="ml2">SOM · Serviceable Obtainable Market</div><span className="mbadge" style={{color:'var(--yellow)',borderColor:'rgba(255,195,53,.3)',background:'rgba(255,195,53,.07)'}}>Bogotá</span></div><div className="mv" style={{color:'var(--yellow)'}}>$15M USD</div><div className="md">Mercado cultural independiente de Bogotá con capacidad real de intermediación digital en ticketing y servicios creativos.</div><div className="mn">Anual</div></div>
          </div>
          <div className="bubs rv d3">
            <div className="b1">
              <div className="b1l"><div className="bv" style={{color:'var(--coral)'}}>$90B USD</div><div className="bla" style={{color:'var(--t2)'}}>TAM · Global</div></div>
              <div className="b2"><div className="b2t"><div className="bv" style={{color:'var(--bg)'}}>$9B USD</div><div className="bla" style={{color:'rgba(23,28,20,.6)'}}>SAM · LATAM</div></div><div className="b3"><div className="bv" style={{color:'var(--bg)',fontSize:13}}>$15M</div><div className="bla" style={{color:'rgba(23,28,20,.6)',fontSize:7}}>SOM</div></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="modelo">
        <div className="eye rv">05 · Modelo de Negocio</div>
        <h2 className="rv d1">Tres fuentes de <em>ingreso</em></h2>
        <div className="mr2">
          <div className="mc rv d1"><div className="mh">Suscripción</div><div className="mbody">Planes con funcionalidades y beneficios exclusivos para usuarios, creadores y gestores. Genera MRR predecible y escalable.</div><span className="chip" style={{color:'var(--coral)',borderColor:'rgba(255,115,108,.3)',background:'rgba(255,115,108,.07)'}}>MRR</span></div>
          <div className="mc rv d2"><div className="mh">Comisión</div><div className="mbody">Por venta de entradas, reservas, contratación de talento y productos culturales. Modelo transaccional directo sobre cada operación.</div><span className="chip" style={{color:'var(--cyan)',borderColor:'rgba(117,230,249,.3)',background:'rgba(117,230,249,.07)'}}>Transaccional</span></div>
          <div className="mc rv d3"><div className="mh">Pauta</div><div className="mbody">Promoción de eventos, marcas y proyectos dentro de la plataforma a audiencias culturales segmentadas y cualificadas.</div><span className="chip" style={{color:'var(--yellow)',borderColor:'rgba(255,195,53,.3)',background:'rgba(255,195,53,.07)'}}>Advertising</span></div>
        </div>
        <div className="rv d2">
          <div className="eye" style={{marginBottom:14}}>Planes de suscripción</div>
          <div className="plans">
            <div className="plan"><div className="pn">Básico</div><div className="pd">Descubrimiento y exploración cultural</div></div>
            <div className="plan"><div className="pn">Avanzado</div><div className="pd">Creadores y artistas independientes</div></div>
            <div className="plan f"><div className="pn">Profesional</div><div className="pd">Gestores, bookers y espacios</div></div>
            <div className="plan"><div className="pn">Panel Pro</div><div className="pd">Herramientas avanzadas de gestión</div></div>
          </div>
        </div>
      </section>

      <section id="inversion">
        <div className="eye rv">06 · Ronda de Inversión</div>
        <h2 className="rv d1">Estamos levantando capital<br/>para dar el <em>siguiente paso</em></h2>
        <div className="iw">
          <div className="ib rv d2">
            <div><div className="il">Inversión objetivo</div><div className="ia">$50K USD</div></div>
            <div className="ir"><div className="il" style={{marginBottom:4}}>Estructura</div><div className="irow">Nota convertible</div><div className="irow">20% de descuento</div><div className="irow">Techo de valoración $1M USD</div></div>
          </div>
          <div className="rc rv d3">
            <div className="eye" style={{marginBottom:8}}>Retorno potencial proyectado</div>
            <div className="rcard" style={{background:'rgba(255,115,108,.07)',borderColor:'rgba(255,115,108,.3)'}}><div className="rn" style={{color:'var(--coral)'}}>x5 USD</div><div className="rl" style={{color:'var(--coral)'}}>en 3 años</div><div className="rd">Proyección conservadora basada en crecimiento inicial del ecosistema</div></div>
            <div className="rcard" style={{background:'rgba(117,230,249,.05)',borderColor:'rgba(117,230,249,.25)'}}><div className="rn" style={{color:'var(--cyan)'}}>x10 USD</div><div className="rl" style={{color:'var(--cyan)'}}>en 5 años</div><div className="rd">Proyección objetivo al consolidar presencia en el mercado latinoamericano</div></div>
          </div>
        </div>
        <div className="rv d2">
          <div className="eye" style={{marginTop:48,marginBottom:16}}>Distribución del capital</div>
          <div className="ug">
            <div className="uc" style={{background:'rgba(255,195,53,.06)',borderColor:'rgba(255,195,53,.25)'}}><div className="up" style={{color:'var(--yellow)'}}>50%</div><div className="una">Desarrollo</div><div style={{display:'flex',flexDirection:'column',gap:4,marginTop:6}}><div className="ui">Diseño y desarrollo del producto</div><div className="ui">Producción de contenidos</div><div className="ui">Infraestructura digital</div></div></div>
            <div className="uc" style={{background:'rgba(117,230,249,.05)',borderColor:'rgba(117,230,249,.22)'}}><div className="up" style={{color:'var(--cyan)'}}>25%</div><div className="una">Operativos</div><div style={{display:'flex',flexDirection:'column',gap:4,marginTop:6}}><div className="ui">Estructura legal y organizacional</div><div className="ui">Honorarios</div><div className="ui">Formalización de la empresa</div></div></div>
            <div className="uc" style={{background:'rgba(0,170,116,.07)',borderColor:'rgba(0,170,116,.22)'}}><div className="up" style={{color:'var(--green)'}}>25%</div><div className="una">Mercadeo</div><div style={{display:'flex',flexDirection:'column',gap:4,marginTop:6}}><div className="ui">Adquisición de usuarios</div><div className="ui">Eventos</div><div className="ui">Pauta digital e influencers</div></div></div>
          </div>
        </div>
      </section>

      <section id="cta">
        <div className="cglow" />
        <div className="clogo rv"><Logo size={64} /></div>
        <div className="ceye rv d1">Únete a La Curaduría</div>
        <h2 className="ch rv d2">Invierte en la próxima<br/>plataforma <em>cultural</em><br/>de Latinoamérica</h2>
        <p className="csub rv d2">Una oportunidad única para ser parte de la plataforma que conectará el ecosistema cultural de <b>Bogotá y Latinoamérica</b>.</p>
        <a className="cbtn rv d3" href="mailto:nicolas.pava@lacuraduria.net">Agendar reunión</a>
        <div className="cts rv d3">
          <div className="ct"><div className="ctl">Email</div><a className="ctv" href="mailto:nicolas.pava@lacuraduria.net">nicolas.pava@lacuraduria.net</a></div>
          <div className="ct"><div className="ctl">Teléfono</div><a className="ctv" href="tel:+573044138497">+57 304 413 8497</a></div>
          <div className="ct"><div className="ctl">Web</div><a className="ctv" href="https://lacuraduria.net" target="_blank" rel="noreferrer">lacuraduria.net</a></div>
        </div>
      </section>

      <footer>
        <div className="fl"><Logo size={22} /><div className="fw">La <b>Cu</b>raduría · lacuraduria.net</div></div>
        <div className="fr">Investor Teaser · Confidencial · 2026 · Speedlylab</div>
      </footer>
    </>
  )
}
