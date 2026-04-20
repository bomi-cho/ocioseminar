import { useState, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@200;300;400;500;700&display=swap');

  * { box-sizing:border-box; margin:0; padding:0; }
  html, body { width:100%; height:100%; background:#0a1228; overflow:hidden; }

  :root {
    --navy:  #0a1228;
    --navy2: #0f1a3d;
    --navy3: #1a2654;
    --gold:       #d4a840;
    --gold-light: #f0d080;
    --gold-deep:  #b8922e;
    --gold-dim:   rgba(212,168,64,0.45);
    --cream: #f5edd8;
    --white: #ffffff;
    --font: 'Montserrat', 'Noto Sans KR', sans-serif;
    --font-ko: 'Noto Sans KR', 'Montserrat', sans-serif;
  }

  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes glow    { 0%,100%{box-shadow:0 0 0 rgba(212,168,64,0)} 50%{box-shadow:0 0 40px rgba(212,168,64,0.45)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes confetti-fall {
    0%   { transform:translateY(-20px) rotate(0deg); opacity:1; }
    100% { transform:translateY(110vh) rotate(600deg); opacity:0; }
  }
  @keyframes winner-in {
    0%   { opacity:0; transform:scale(0.85) translateY(28px); }
    65%  { transform:scale(1.03) translateY(-4px); }
    100% { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes name-in {
    0%   { opacity:0; transform:scale(0.8) translateY(16px); letter-spacing:24px; }
    100% { opacity:1; transform:scale(1) translateY(0); letter-spacing:8px; }
  }
  @keyframes rank-in {
    0%   { opacity:0; transform:translateY(8px); }
    100% { opacity:1; transform:translateY(0); }
  }
  @keyframes slot-spin {
    0%   { opacity:1; }
    40%  { opacity:0.2; }
    100% { opacity:1; }
  }

  .stage {
    width:100vw; height:100vh;
    background:linear-gradient(145deg,#1e2f6a 0%,#0f1a3d 40%,#070e22 100%);
    display:flex;
    font-family: var(--font);
    color:var(--white);
    position:relative;
    overflow:hidden;
  }
  .stage::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(ellipse 50% 60% at 0% 0%, rgba(212,168,64,0.07) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 100% 100%, rgba(26,38,84,0.5) 0%, transparent 55%);
  }
  .bg-lines { position:absolute; inset:0; pointer-events:none; overflow:hidden; opacity:0.04; }
  .bg-lines::before {
    content:''; position:absolute; inset:0;
    background:repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(212,168,64,1) 80px, rgba(212,168,64,1) 81px);
  }

  .corner { position:absolute; width:32px; height:32px; border:1px solid rgba(212,168,64,0.4); z-index:10; }
  .corner.tl{top:16px;left:16px;border-right:none;border-bottom:none}
  .corner.tr{top:16px;right:16px;border-left:none;border-bottom:none}
  .corner.bl{bottom:16px;left:16px;border-right:none;border-top:none}
  .corner.br{bottom:16px;right:16px;border-left:none;border-top:none}

  /* ── 왼쪽 패널 ── */
  .left-panel {
    width:30%;
    border-right:1px solid rgba(212,168,64,0.15);
    display:flex; flex-direction:column;
    padding:32px 28px;
    position:relative; z-index:2;
    background:rgba(6,12,28,0.4);
    backdrop-filter:blur(4px);
  }

  .left-logo { text-align:center; margin-bottom:24px; }
  .left-logo .yr {
    font-family: var(--font);
    font-size:15px; font-weight:300;
    color:var(--gold-light); letter-spacing:6px; line-height:1;
    text-transform:uppercase;
  }
  .left-logo .sm {
    font-family: var(--font);
    font-size:13px; font-weight:400;
    color:var(--gold-light); letter-spacing:4px;
    text-transform:uppercase;
  }
  .left-logo .oc {
    font-family: var(--font);
    font-size:30px; font-weight:700;
    color:var(--gold-light); letter-spacing:4px; line-height:1; margin-bottom:6px;
    text-transform:uppercase;
  }
  .left-logo .sub {
    display:inline-block;
    font-family: var(--font-ko);
    font-size:10px; font-weight:300;
    color:var(--cream); letter-spacing:4px;
    padding:5px 14px;
    border-top:1px solid rgba(212,168,64,0.3);
    border-bottom:1px solid rgba(212,168,64,0.3);
    text-transform:uppercase;
  }
  .gold-div { width:36px; height:1px; margin:14px auto 0; background:linear-gradient(90deg,transparent,var(--gold),transparent); }

  .sec-label {
    font-family: var(--font);
    font-size:7px; font-weight:500;
    letter-spacing:5px; text-transform:uppercase; color:var(--gold);
    display:flex; align-items:center; gap:8px; margin:16px 0 8px;
  }
  .sec-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,rgba(212,168,64,0.3),transparent); }

  .textarea {
    flex:1; min-height:0; width:100%;
    background:rgba(6,12,28,0.6); border:1px solid rgba(212,168,64,0.2);
    padding:10px 12px;
    font-family: var(--font-ko); font-size:12px; font-weight:300;
    color:var(--cream); outline:none; resize:none; line-height:1.9;
    transition:border-color 0.2s;
  }
  .textarea:focus { border-color:rgba(212,168,64,0.5); }
  .textarea::placeholder { color:rgba(245,237,216,0.18); font-size:11px; }

  .count-info { display:flex; align-items:center; justify-content:space-between; margin-top:8px; }
  .count-info .total {
    font-family: var(--font); font-size:10px; font-weight:300;
    color:var(--gold-dim); letter-spacing:1px;
  }
  .count-info .total span { font-size:17px; font-weight:600; color:var(--gold-light); margin:0 3px; }

  .draw-count-row { display:flex; align-items:center; gap:8px; margin-top:12px; }
  .dc-label {
    font-family: var(--font); font-size:9px; font-weight:300;
    letter-spacing:3px; text-transform:uppercase; color:var(--gold-dim);
  }
  .dc-ctrl  { display:flex; align-items:center; }
  .dc-btn {
    width:28px; height:28px; background:rgba(6,12,28,0.8);
    border:1px solid rgba(212,168,64,0.25); cursor:pointer;
    font-family: var(--font); font-size:16px; font-weight:400; color:var(--gold-light);
    display:flex; align-items:center; justify-content:center;
    transition:background 0.15s;
  }
  .dc-btn:hover { background:rgba(212,168,64,0.12); }
  .dc-val {
    width:38px; height:28px;
    border-top:1px solid rgba(212,168,64,0.25); border-bottom:1px solid rgba(212,168,64,0.25);
    background:rgba(6,12,28,0.9);
    font-family: var(--font); font-size:16px; font-weight:600;
    color:var(--gold-light); text-align:center; line-height:28px;
  }

  .draw-btn {
    width:100%; padding:14px; margin-top:14px;
    background:rgba(6,12,28,0.5); border:1.5px solid var(--gold); cursor:pointer;
    font-family: var(--font); font-size:13px; font-weight:600;
    letter-spacing:5px; text-transform:uppercase; color:var(--gold-light);
    transition:all 0.3s; animation:glow 2.5s ease infinite;
  }
  .draw-btn:hover:not(:disabled) { background:rgba(212,168,64,0.1); }
  .draw-btn:disabled { opacity:0.3; cursor:not-allowed; animation:none; }
  .spin-icon { display:inline-block; animation:spin 0.7s linear infinite; margin-right:6px; }

  .reset-btn {
    width:100%; padding:8px; margin-top:8px; background:none;
    border:1px solid rgba(212,168,64,0.1); cursor:pointer;
    font-family: var(--font); font-size:8px; font-weight:400;
    letter-spacing:4px; text-transform:uppercase; color:rgba(212,168,64,0.2);
    transition:color 0.2s, border-color 0.2s;
  }
  .reset-btn:hover { color:rgba(255,140,140,0.6); border-color:rgba(255,140,140,0.2); }

  /* ── 오른쪽 패널 ── */
  .right-panel {
    flex:1; display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    position:relative; z-index:2; padding:32px;
  }

  /* 대기 화면 */
  .standby { text-align:center; animation:fadeIn 0.6s ease both; }
  .standby .ornament {
    font-family: var(--font); font-size:1.4vw; font-weight:300;
    color:rgba(212,168,64,0.2); letter-spacing:12px; margin-bottom:20px;
    text-transform:uppercase;
  }
  .standby .big-title {
    font-family: var(--font);
    font-size:5.8vw; font-weight:700;
    letter-spacing:0.12em; line-height:1; margin-bottom:12px;
    text-transform:uppercase;
    background:linear-gradient(135deg,#f0d080,#d4a840,#b8922e,#d4a840,#f0d080);
    background-size:300% auto;
    -webkit-background-clip:text; background-clip:text; color:transparent;
    animation:shimmer 4s linear infinite;
  }
  .standby .big-sub {
    font-family: var(--font-ko);
    font-size:1.3vw; font-weight:300;
    color:var(--cream); letter-spacing:8px; margin-bottom:28px;
  }
  .standby .hint {
    font-family: var(--font);
    font-size:0.75vw; font-weight:400;
    letter-spacing:3px; color:var(--gold-dim); text-transform:uppercase;
  }

  /* 슬롯 스피닝 */
  .drawing-screen { text-align:center; animation:fadeIn 0.4s ease both; }
  .drawing-screen .label {
    font-family: var(--font); font-size:0.85vw; font-weight:400;
    letter-spacing:8px; text-transform:uppercase; color:var(--gold); margin-bottom:20px;
  }
  .slot-display {
    font-family: var(--font-ko); font-size:5vw; font-weight:500;
    color:rgba(255,255,255,0.15); letter-spacing:8px;
    animation:slot-spin 0.12s linear infinite; min-height:1.2em;
  }

  /* 당첨자 발표 */
  .winner-screen { text-align:center; width:100%; animation:winner-in 0.7s cubic-bezier(0.34,1.4,0.64,1) both; }
  .winner-screen .w-label {
    font-family: var(--font); font-size:0.85vw; font-weight:500;
    letter-spacing:10px; text-transform:uppercase; color:var(--gold); margin-bottom:6px;
  }
  .winner-screen .w-label-ko {
    font-family: var(--font-ko); font-size:0.9vw; font-weight:300;
    letter-spacing:8px; color:var(--gold-dim); margin-bottom:28px;
  }
  .winner-screen .w-line { width:80px; height:1px; margin:0 auto 28px; background:linear-gradient(90deg,transparent,var(--gold),transparent); }
  .winner-screen .w-name {
    font-family: var(--font-ko); font-size:7vw; font-weight:700;
    color:var(--white); letter-spacing:8px; line-height:1; margin-bottom:28px;
    animation:name-in 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  }
  .winner-screen .w-rank {
    font-family: var(--font); font-size:1vw; font-weight:500; color:var(--gold);
    letter-spacing:5px; text-transform:uppercase;
    padding:10px 28px; border:1px solid rgba(212,168,64,0.25);
    display:inline-block; margin-bottom:28px;
    animation:rank-in 0.5s ease 0.6s both;
  }
  .next-btn {
    padding:12px 44px; background:none; border:1.5px solid var(--gold); cursor:pointer;
    font-family: var(--font); font-size:0.85vw; font-weight:600;
    letter-spacing:5px; text-transform:uppercase; color:var(--gold-light);
    transition:background 0.2s; animation:rank-in 0.5s ease 0.8s both;
  }
  .next-btn:hover { background:rgba(212,168,64,0.1); }

  /* 당첨자 누적 목록 */
  .winners-log { position:absolute; bottom:24px; right:28px; text-align:right; z-index:3; }
  .wl-title {
    font-family: var(--font); font-size:7px; font-weight:400;
    letter-spacing:4px; text-transform:uppercase; color:var(--gold-dim); margin-bottom:6px;
  }
  .wl-item {
    font-family: var(--font-ko); font-size:13px; font-weight:400;
    color:rgba(245,237,216,0.6); letter-spacing:1px; line-height:1.8;
    animation:fadeUp 0.3s ease both;
  }
  .wl-item .wl-rank {
    font-family: var(--font); font-size:10px; font-weight:600;
    color:var(--gold); margin-right:6px; letter-spacing:1px;
  }

  /* 진행 상황 */
  .progress-info {
    position:absolute; bottom:24px; left:28px; z-index:3;
    font-family: var(--font); font-size:11px; font-weight:400;
    color:var(--gold-dim); letter-spacing:3px; text-transform:uppercase;
  }
  .progress-info span { color:var(--gold-light); font-size:17px; font-weight:700; }

  /* 컨페티 */
  .confetti-wrap { position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:1; }
  .cp { position:absolute; animation:confetti-fall 2.2s ease forwards; }
`;

if (!document.getElementById("ld-style")) {
  const el = document.createElement("style");
  el.id = "ld-style";
  el.textContent = css;
  document.head.appendChild(el);
}

const CC = ["#f0d080","#d4a840","#b8922e","#f5edd8","#e8c460","#ffffff"];
function Confetti({ active }) {
  if (!active) return null;
  const ps = Array.from({length:60},(_,i)=>({
    id:i, left:Math.random()*100, delay:Math.random()*1.2,
    color:CC[Math.floor(Math.random()*CC.length)],
    size:4+Math.random()*8, round:Math.random()>0.5
  }));
  return (
    <div className="confetti-wrap">
      {ps.map(p=>(
        <div key={p.id} className="cp" style={{
          left:`${p.left}%`, top:"-20px",
          width:p.size, height:p.size,
          background:p.color, borderRadius:p.round?"50%":"0",
          animationDelay:`${p.delay}s`,
          animationDuration:`${1.8+Math.random()*0.9}s`,
        }}/>
      ))}
    </div>
  );
}

export default function App() {
  const [rawText, setRawText] = useState("");
  const [drawCount, setDrawCount] = useState(5);
  const [winners, setWinners] = useState([]);
  const [phase, setPhase] = useState("standby");
  const [currentWinner, setCurrentWinner] = useState(null);
  const [slotName, setSlotName] = useState("");

  const names = rawText.split(/[\n,，\t]+/).map(n=>n.trim()).filter(n=>n.length>0);
  const wonNames = winners.map(w=>w.name);
  const pool = names.filter(n=>!wonNames.includes(n));
  const isDone = winners.length >= drawCount && drawCount > 0;
  const canDraw = names.length > 0 && pool.length > 0 && !isDone && phase !== "spinning";

  const handleDraw = async () => {
    if (!canDraw) return;
    setPhase("spinning");
    const iv = setInterval(()=>{
      const src = names.length > 0 ? names : ["···"];
      setSlotName(src[Math.floor(Math.random()*src.length)]);
    }, 80);
    await new Promise(r=>setTimeout(r,1800));
    clearInterval(iv);
    const winner = pool[Math.floor(Math.random()*pool.length)];
    const newWinner = { name:winner, rank:winners.length+1 };
    setCurrentWinner(newWinner);
    setWinners(prev=>[...prev, newWinner]);
    setSlotName("");
    setPhase("winner");
  };

  const handleNext = () => setPhase("standby");
  const handleReset = () => {
    if (!window.confirm("추첨 결과를 초기화할까요?")) return;
    setWinners([]); setCurrentWinner(null); setPhase("standby");
  };

  return (
    <div className="stage">
      <div className="bg-lines"/>
      <span className="corner tl"/><span className="corner tr"/>
      <span className="corner bl"/><span className="corner br"/>

      {/* 왼쪽 설정 패널 */}
      <div className="left-panel">
        <div className="left-logo">
          <div className="yr">2026</div>
          <div className="sm">Samsung</div>
          <div className="oc">OCIO</div>
          <span className="sub">OCIO Seminar</span>
          <div className="gold-div"/>
        </div>

        <div className="sec-label">참가자 명단</div>
        <textarea
          className="textarea"
          placeholder={"이름을 한 줄에 한 명씩 입력\n엑셀에서 복사 붙여넣기 가능\n\n홍길동\n김철수\n이영희\n..."}
          value={rawText}
          onChange={e=>{ setRawText(e.target.value); setWinners([]); setPhase("standby"); }}
        />

        <div className="count-info">
          <div className="total">총 <span>{names.length}</span>명 · 잔여 <span>{pool.length}</span>명</div>
        </div>

        <div className="draw-count-row">
          <span className="dc-label">당첨</span>
          <div className="dc-ctrl">
            <button className="dc-btn" onClick={()=>setDrawCount(v=>Math.max(1,v-1))}>−</button>
            <div className="dc-val">{drawCount}</div>
            <button className="dc-btn" onClick={()=>setDrawCount(v=>Math.min(names.length||99,v+1))}>+</button>
          </div>
          <span className="dc-label">명</span>
        </div>

        <button className="draw-btn" onClick={handleDraw} disabled={!canDraw}>
          {phase==="spinning"
            ? <><span className="spin-icon">◈</span>추첨 중</>
            : isDone ? "추첨 완료"
            : winners.length===0 ? "Draw"
            : `Draw  ${winners.length+1} / ${drawCount}`}
        </button>

        {winners.length > 0 && (
          <button className="reset-btn" onClick={handleReset}>Reset</button>
        )}
      </div>

      {/* 오른쪽 메인 화면 */}
      <div className="right-panel">
        <Confetti active={phase==="winner"}/>

        {phase==="standby" && (
          <div className="standby">
            <div className="ornament">· · ·</div>
            <div className="big-title">Lucky Draw</div>
            <div className="big-sub">경 품 추 첨</div>
            <div className="hint">
              {names.length===0 ? "좌측에 참가자 명단을 입력하세요"
                : isDone ? `추첨 완료  ·  총 ${winners.length}명 당첨`
                : `${names.length}명 참가  ·  ${drawCount}명 추첨 예정`}
            </div>
          </div>
        )}

        {phase==="spinning" && (
          <div className="drawing-screen">
            <div className="label">Drawing Winner</div>
            <div className="slot-display">{slotName||"···"}</div>
          </div>
        )}

        {phase==="winner" && currentWinner && (
          <div className="winner-screen">
            <div className="w-label">Winner</div>
            <div className="w-label-ko">당 첨 자</div>
            <div className="w-line"/>
            <div className="w-name">{currentWinner.name}</div>
            <div className="w-rank">{currentWinner.rank}번째 당첨  ·  {drawCount}명 중</div>
            <button className="next-btn" onClick={handleNext}>
              {winners.length>=drawCount ? "완료" : "다음 추첨"}
            </button>
          </div>
        )}

        {winners.length>0 && phase!=="spinning" && (
          <div className="winners-log">
            <div className="wl-title">당첨자 목록</div>
            {winners.map((w,i)=>(
              <div key={i} className="wl-item" style={{animationDelay:`${i*0.05}s`}}>
                <span className="wl-rank">{w.rank}</span>{w.name}
              </div>
            ))}
          </div>
        )}

        {names.length>0 && (
          <div className="progress-info">
            <span>{winners.length}</span> / {drawCount}
          </div>
        )}
      </div>
    </div>
  );
}
