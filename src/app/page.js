'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { MATCHES, GROUP_COLORS, ADMIN_PIN, isLocked, calcPoints } from '../lib/data'
import styles from './page.module.css'

// ─── SMALL UI ATOMS ──────────────────────────────────────────────────────────

function PtsBadge({ pts }) {
  if (pts === null || pts === undefined) return null
  const color = pts===3?'#f59e0b':pts>=2?'#22c55e':pts>=1?'#60a5fa':'#4b617a'
  const label = pts===3?'⭐ 3':pts===2?'✅ 2':pts===1.5?'1.5':pts===1?'✓ 1':pts===0.5?'½':'0'
  return (
    <span style={{ background:`${color}22`, border:`1px solid ${color}55`, color,
      borderRadius:5, padding:'2px 8px', fontSize:'0.65rem', fontWeight:700, flexShrink:0 }}>
      {label}
    </span>
  )
}

function LockChip({ locked }) {
  return locked
    ? <span style={{ background:'#ef444422',border:'1px solid #ef444455',color:'#ef4444',
        borderRadius:5,padding:'2px 7px',fontSize:'0.6rem',fontWeight:700,flexShrink:0 }}>🔒 CERRADO</span>
    : <span style={{ background:'#22c55e22',border:'1px solid #22c55e55',color:'#22c55e',
        borderRadius:5,padding:'2px 7px',fontSize:'0.6rem',fontWeight:700,flexShrink:0 }}>🟢 ABIERTO</span>
}

function NumInput({ value, onChange, disabled }) {
  return (
    <input type="number" min="0" max="20"
      value={value === null || value === undefined ? '' : value}
      onChange={e => onChange && onChange(e.target.value === '' ? null : parseInt(e.target.value))}
      disabled={disabled}
      style={{ width:40,height:36,textAlign:'center',
        background: disabled?'#0a0c14':'#111827',
        border:`1px solid ${disabled?'#1e2d4588':'#1e2d45'}`,
        borderRadius:6, color: disabled?'#4b617a':'#e8eaf0',
        fontSize:'0.95rem', fontFamily:'DM Mono,monospace', fontWeight:700,
        outline:'none', cursor: disabled?'not-allowed':'text' }}
    />
  )
}

function GroupFilter({ active, setActive }) {
  return (
    <div style={{ display:'flex',flexWrap:'wrap',gap:6,marginBottom:16 }}>
      {['ALL',...Object.keys(GROUP_COLORS)].map(g => {
        const color = g==='ALL'?'#60a5fa':GROUP_COLORS[g]
        const isActive = active===g
        return (
          <button key={g} onClick={() => setActive(g)} style={{
            background: isActive?`${color}33`:'#111827',
            border:`1px solid ${isActive?color:'#1e2d45'}`,
            borderRadius:6, padding:'4px 12px',
            color: isActive?color:'#4b617a', cursor:'pointer',
            fontFamily:'Oswald,sans-serif', fontWeight:700,
            fontSize:'0.7rem', transition:'all 0.15s' }}>
            {g==='ALL'?'Todos':`Gr. ${g}`}
          </button>
        )
      })}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontFamily:'Oswald,sans-serif',fontWeight:600,fontSize:'0.65rem',
      letterSpacing:'0.2em',textTransform:'uppercase',color:'#4b617a',marginBottom:12 }}>
      {children}
    </div>
  )
}

function Loader({ text = 'Cargando...' }) {
  return (
    <div style={{ minHeight:'100vh',display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',gap:16,color:'#4b617a' }}>
      <div style={{ fontSize:'3rem' }}>⚽</div>
      <div style={{ fontFamily:'Oswald,sans-serif',fontSize:'0.8rem',letterSpacing:'0.2em' }}>{text}</div>
    </div>
  )
}

function MatchRow({ match, homeVal, awayVal, onHomeChange, onAwayChange, locked, result, pts, isResult }) {
  const gc = GROUP_COLORS[match.group]
  const borderColor = pts===3?'#f59e0b88':pts>=2?'#22c55e66':pts>=1?'#60a5fa55':'#1e2d45'
  return (
    <div style={{ background:'#111827', border:`1px solid ${borderColor}`,
      borderRadius:10, padding:'10px 14px', display:'flex',
      alignItems:'center', gap:10, flexWrap:'wrap' }}>
      <span style={{ background:`${gc}22`,color:gc,borderRadius:5,
        padding:'2px 7px',fontFamily:'Oswald,sans-serif',
        fontWeight:700,fontSize:'0.6rem',letterSpacing:'0.06em',flexShrink:0 }}>
        {match.group}
      </span>
      <span style={{ color:'#4b617a',fontSize:'0.62rem',flexShrink:0 }}>
  {new Date(match.date).toLocaleString('es-CO', {
    day:'2-digit',
    month:'short',
    hour:'2-digit',
    minute:'2-digit'
  })}
</span>

      <div style={{ flex:1,display:'flex',alignItems:'center',gap:8,minWidth:200 }}>
        <span style={{ flex:1,textAlign:'right',fontSize:'0.78rem',lineHeight:1.3 }}>{match.home}</span>
        <div style={{ display:'flex',alignItems:'center',gap:4,flexShrink:0 }}>
          <NumInput value={homeVal} onChange={onHomeChange} disabled={locked && !isResult} />
          <span style={{ color:'#4b617a' }}>–</span>
          <NumInput value={awayVal} onChange={onAwayChange} disabled={locked && !isResult} />
        </div>
        <span style={{ flex:1,textAlign:'left',fontSize:'0.78rem',lineHeight:1.3 }}>{match.away}</span>
      </div>

      {!isResult && result && result.home_goals !== null && (
        <span style={{ color:'#22c55e',fontSize:'0.68rem',flexShrink:0 }}>
          {result.home_goals}–{result.away_goals}
        </span>
      )}
      {!isResult && <PtsBadge pts={pts} />}
      <LockChip locked={locked && !isResult} />
    </div>
  )
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onPlayerLogin, onAdminLogin }) {
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handlePlayer() {
    if (!name.trim()) return
    setLoading(true); setError('')
    await onPlayerLogin(name.trim())
    setLoading(false)
  }

  async function handleAdmin() {
    if (pin !== ADMIN_PIN) { setError('PIN incorrecto'); return }
    setLoading(true)
    await onAdminLogin()
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
      <div style={{ width:'100%',maxWidth:400 }}>
        {/* Logo */}
        <div style={{ textAlign:'center',marginBottom:36 }}>
          <div style={{ fontSize:'3.5rem',marginBottom:8 }}>⚽</div>
          <h1 style={{ fontFamily:'Oswald,sans-serif',fontWeight:700,fontSize:'2.2rem',
            margin:0,letterSpacing:'0.05em',textTransform:'uppercase',color:'#fff' }}>
            POLLA MUNDIAL
          </h1>
          <div style={{ color:'#4b617a',fontSize:'0.72rem',letterSpacing:'0.15em',marginTop:4 }}>
            USA · CANADA · MEXICO 2026
          </div>
        </div>

        {/* Player login */}
        <div style={{ background:'#0c111d',border:'1px solid #1e2d45',borderRadius:12,padding:'20px',marginBottom:12 }}>
          <div style={{ fontFamily:'Oswald,sans-serif',fontWeight:600,fontSize:'0.65rem',
            letterSpacing:'0.2em',textTransform:'uppercase',color:'#4b617a',marginBottom:10 }}>
            Soy apostador
          </div>
          <input
            placeholder="Tu nombre..."
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            onKeyDown={e => e.key==='Enter' && handlePlayer()}
            style={{ width:'100%',background:'#07090f',border:'1px solid #1e2d45',
              borderRadius:8,padding:'10px 14px',color:'#e8eaf0',
              fontFamily:'DM Mono,monospace',fontSize:'0.9rem',outline:'none',marginBottom:12 }}
          />
          <button onClick={handlePlayer} disabled={!name.trim()||loading}
            style={{ width:'100%',background: name.trim()&&!loading?'#f59e0b':'#1e2d45',
              border:'none',borderRadius:8,padding:'11px',
              color: name.trim()&&!loading?'#07090f':'#4b617a',
              fontFamily:'Oswald,sans-serif',fontWeight:700,fontSize:'0.95rem',
              letterSpacing:'0.06em',cursor: name.trim()&&!loading?'pointer':'not-allowed',
              transition:'all 0.15s' }}>
            {loading?'ENTRANDO...':'ENTRAR A LA POLLA →'}
          </button>
        </div>

        {/* Admin login */}
        <div style={{ background:'#0c111d',border:'1px solid #1e2d45',borderRadius:12,padding:'20px' }}>
          <div style={{ fontFamily:'Oswald,sans-serif',fontWeight:600,fontSize:'0.65rem',
            letterSpacing:'0.2em',textTransform:'uppercase',color:'#4b617a',marginBottom:10 }}>
            Soy administrador
          </div>
          <input
            type="password"
            placeholder="PIN de admin..."
            value={pin}
            onChange={e => { setPin(e.target.value); setError('') }}
            onKeyDown={e => e.key==='Enter' && handleAdmin()}
            style={{ width:'100%',background:'#07090f',border:'1px solid #1e2d45',
              borderRadius:8,padding:'10px 14px',color:'#e8eaf0',
              fontFamily:'DM Mono,monospace',fontSize:'0.9rem',outline:'none',marginBottom:12 }}
          />
          <button onClick={handleAdmin} disabled={!pin||loading}
            style={{ width:'100%',background:'transparent',
              border:`1px solid ${!pin||loading?'#1e2d45':'#4b617a'}`,
              borderRadius:8,padding:'11px',
              color: !pin||loading?'#4b617a':'#e8eaf0',
              fontFamily:'Oswald,sans-serif',fontWeight:700,fontSize:'0.95rem',
              letterSpacing:'0.06em',cursor: !pin||loading?'not-allowed':'pointer',
              transition:'all 0.15s' }}>
            PANEL DE ADMIN →
          </button>
          {error && <div style={{ color:'#ef4444',fontSize:'0.75rem',marginTop:8,textAlign:'center' }}>{error}</div>}
        </div>

        {/* Scoring info */}
        <div style={{ marginTop:20,background:'#0d1f0d',border:'1px solid #166534',
          borderRadius:10,padding:'14px 16px',fontSize:'0.72rem',color:'#86efac',lineHeight:1.9 }}>
          <strong>⚽ Sistema de puntos</strong><br/>
          ⭐ 3 pts — Marcador exacto (ej: 2-1)<br/>
          ✅ 2 pts — Resultado + ambos goles exactos<br/>
          🔵 1 pt — Solo resultado correcto (G/E/P)<br/>
          ⚡ +0.5 por cada equipo con goles exactos
        </div>
      </div>
    </div>
  )
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
function Leaderboard({ players, allPreds, results, currentPlayerId }) {
  const [expanded, setExpanded] = useState(null)

  const board = players.map(p => {
    let total=0, exact=0, correct=0, played=0
    MATCHES.forEach(m => {
      const pred = allPreds[p.id]?.find(x => x.match_id === m.id)
      const real = results.find(r => r.match_id === m.id)
      const pts = calcPoints(pred, real)
      if (pts!==null){ total+=pts; played++; if(pts===3)exact++; else if(pts>=1)correct++ }
    })
    return { ...p, total, exact, correct, played }
  }).sort((a,b) => b.total - a.total)

  if (board.length === 0)
    return <div style={{ textAlign:'center',padding:'50px 20px',color:'#4b617a' }}>
      <div style={{ fontSize:'2.5rem',marginBottom:10 }}>🏆</div>
      Aún no hay jugadores registrados
    </div>

  return (
    <div>
      {/* Podium top 3 */}
      {board.length >= 2 && (
        <div style={{ display:'flex',justifyContent:'center',gap:16,marginBottom:28,flexWrap:'wrap' }}>
          {[1,0,2].map(idx => {
            const p = board[idx]; if(!p) return null
            const rank = idx+1
            const color = rank===1?'#f59e0b':rank===2?'#94a3b8':'#b87333'
            const medal = rank===1?'🥇':rank===2?'🥈':'🥉'
            const h = rank===1?'76px':rank===2?'56px':'44px'
            return (
              <div key={p.id} style={{ display:'flex',flexDirection:'column',
                alignItems:'center',gap:6,order:rank===1?0:rank===2?-1:1 }}>
                <div style={{ fontSize:'1.6rem' }}>{medal}</div>
                <div style={{ fontFamily:'Oswald,sans-serif',fontWeight:700,
                  fontSize:'0.85rem',color:'#fff',textAlign:'center',maxWidth:80 }}>{p.name}</div>
                <div style={{ fontFamily:'Oswald,sans-serif',fontWeight:700,fontSize:'1.4rem',color }}>
                  {p.total}<span style={{ fontSize:'0.65rem',color:'#4b617a' }}> pts</span>
                </div>
                <div style={{ background:`${color}22`,width:72,height:h,borderRadius:'6px 6px 0 0',
                  border:`2px solid ${color}55`,display:'flex',alignItems:'flex-start',
                  justifyContent:'center',paddingTop:6,
                  fontFamily:'Oswald,sans-serif',fontWeight:700,color,fontSize:'1.1rem' }}>
                  {rank}°
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Table */}
      <div style={{ background:'#111827',border:'1px solid #1e2d45',borderRadius:12,overflow:'hidden',marginBottom:24 }}>
        <div style={{ display:'grid',gridTemplateColumns:'36px 1fr 56px 56px 56px 72px',
          padding:'8px 14px',borderBottom:'1px solid #1e2d45',
          color:'#4b617a',fontSize:'0.6rem',letterSpacing:'0.12em',
          textTransform:'uppercase',fontFamily:'Oswald,sans-serif' }}>
          <div>#</div><div>Apostador</div>
          <div style={{ textAlign:'center' }}>⭐</div>
          <div style={{ textAlign:'center' }}>✅</div>
          <div style={{ textAlign:'center' }}>Jug.</div>
          <div style={{ textAlign:'right' }}>PTS</div>
        </div>

        {board.map((p,i) => {
          const isMe = p.id === currentPlayerId
          const rColor = i===0?'#f59e0b':i===1?'#94a3b8':i===2?'#b87333':'#4b617a'
          const isOpen = expanded===p.id
          const played = MATCHES.filter(m => {
            const pred = allPreds[p.id]?.find(x=>x.match_id===m.id)
            const real = results.find(r=>r.match_id===m.id)
            return calcPoints(pred,real)!==null
          })
          return (
            <div key={p.id}>
              <div onClick={() => setExpanded(isOpen?null:p.id)}
                style={{ display:'grid',gridTemplateColumns:'36px 1fr 56px 56px 56px 72px',
                  padding:'11px 14px',borderBottom:'1px solid #1e2d45',
                  background: isMe?'#f59e0b0a':i===0?'#f59e0b06':'transparent',
                  alignItems:'center',cursor:'pointer',transition:'background 0.15s' }}>
                <div style={{ fontFamily:'Oswald,sans-serif',fontWeight:700,color:rColor,fontSize:'0.85rem' }}>{i+1}</div>
                <div style={{ fontFamily:'Oswald,sans-serif',fontWeight:600,fontSize:'0.9rem',
                  display:'flex',alignItems:'center',gap:6 }}>
                  {p.name}
                  {isMe && <span style={{ background:'#f59e0b22',color:'#f59e0b',
                    borderRadius:4,padding:'1px 6px',fontSize:'0.55rem',letterSpacing:'0.08em' }}>TÚ</span>}
                </div>
                <div style={{ textAlign:'center',color:'#f59e0b',fontWeight:700,fontSize:'0.85rem' }}>{p.exact}</div>
                <div style={{ textAlign:'center',color:'#22c55e',fontWeight:700,fontSize:'0.85rem' }}>{p.correct}</div>
                <div style={{ textAlign:'center',color:'#4b617a',fontSize:'0.85rem' }}>{p.played}</div>
                <div style={{ textAlign:'right',fontFamily:'Oswald,sans-serif',fontWeight:700,
                  fontSize:'1rem',color: isMe?'#f59e0b':i===0?'#f59e0b':'#e8eaf0' }}>{p.total}</div>
              </div>

              {/* Expandable detail */}
              {isOpen && (
                <div style={{ background:'#07090f',borderBottom:'1px solid #1e2d45' }}>
                  {played.length === 0
                    ? <div style={{ padding:'10px 14px',color:'#4b617a',fontSize:'0.72rem' }}>Sin partidos con resultado aún</div>
                    : played.map(m => {
                      const pred = allPreds[p.id]?.find(x=>x.match_id===m.id)
                      const real = results.find(r=>r.match_id===m.id)
                      const pts = calcPoints(pred,real)
                      const gc = GROUP_COLORS[m.group]
                      return (
                        <div key={m.id} style={{ display:'flex',alignItems:'center',
                          gap:8,padding:'6px 14px',borderBottom:'1px solid #1e2d4222',fontSize:'0.72rem' }}>
                          <span style={{ background:`${gc}22`,color:gc,borderRadius:4,
                            padding:'1px 6px',fontFamily:'Oswald,sans-serif',
                            fontWeight:700,fontSize:'0.6rem',flexShrink:0 }}>{m.group}</span>
                          <span style={{ flex:1,color:'#4b617a' }}>
                            {m.home.split(' ')[0]} vs {m.away.split(' ')[0]}
                          </span>
                          <span style={{ color:'#4b617a' }}>
                            Pred: <strong style={{ color:'#e8eaf0' }}>{pred?.home_goals}–{pred?.away_goals}</strong>
                          </span>
                          <span style={{ color:'#4b617a' }}>
                            Real: <strong style={{ color:'#22c55e' }}>{real?.home_goals}–{real?.away_goals}</strong>
                          </span>
                          <PtsBadge pts={pts} />
                        </div>
                      )
                    })
                  }
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('login')    // login | player | admin
  const [player, setPlayer] = useState(null)
  const [players, setPlayers] = useState([])
  const [myPreds, setMyPreds] = useState([])       // [{match_id, home_goals, away_goals}]
  const [allPreds, setAllPreds] = useState({})     // {player_id: [{match_id,...}]}
  const [results, setResults] = useState([])       // [{match_id, home_goals, away_goals}]
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('pronos')
  const [filterGroup, setFilterGroup] = useState('ALL')
  const [now, setNow] = useState(new Date())

  useEffect(() => { const t = setInterval(()=>setNow(new Date()),30000); return ()=>clearInterval(t) }, [])

  // Load all players + results (shared)
  const loadShared = useCallback(async () => {
    const [{ data: pls }, { data: res }] = await Promise.all([
      supabase.from('players').select('*').order('created_at'),
      supabase.from('results').select('*'),
    ])
    setPlayers(pls || [])
    setResults(res || [])
    return pls || []
  }, [])

  // Load predictions for all players (for leaderboard)
  const loadAllPreds = useCallback(async (pls) => {
    const { data } = await supabase.from('predictions').select('*')
    const grouped = {}
    ;(pls || players).forEach(p => { grouped[p.id] = [] })
    ;(data || []).forEach(pred => {
      if (!grouped[pred.player_id]) grouped[pred.player_id] = []
      grouped[pred.player_id].push(pred)
    })
    setAllPreds(grouped)
  }, [players])

  // Real-time subscriptions
  useEffect(() => {
    if (screen === 'login') return

    const resSub = supabase.channel('results-changes')
      .on('postgres_changes', { event:'*', schema:'public', table:'results' }, () => loadShared())
      .subscribe()

    const predSub = supabase.channel('pred-changes')
      .on('postgres_changes', { event:'*', schema:'public', table:'predictions' }, async () => {
        const pls = await loadShared()
        await loadAllPreds(pls)
      })
      .subscribe()

    return () => { supabase.removeChannel(resSub); supabase.removeChannel(predSub) }
  }, [screen, loadShared, loadAllPreds])

  // ── LOGIN HANDLERS ──
  async function handlePlayerLogin(name) {
    setLoading(true)
    // Find or create player
    let { data: existing } = await supabase
      .from('players').select('*').ilike('name', name).single()

    if (!existing) {
      const { data: created, error } = await supabase
        .from('players').insert({ name }).select().single()
      if (error) {
  console.error(error)
  alert(error.message)
  setLoading(false)
  return
}
      existing = created
    }

    // Load their predictions
    const { data: preds } = await supabase
      .from('predictions').select('*').eq('player_id', existing.id)

    // Load shared data
    const pls = await loadShared()
    await loadAllPreds(pls)

    setPlayer(existing)
    setMyPreds(preds || [])
    setScreen('player')
    setTab('pronos')
    setLoading(false)
  }

  async function handleAdminLogin() {
    setLoading(true)
    const pls = await loadShared()
    await loadAllPreds(pls)
    setScreen('admin')
    setTab('resultados')
    setLoading(false)
  }

  // ── SAVE PREDICTION ──
  async function savePred(matchId, side, val) {
    if (!player) return
    setSaving(true)
    const existing = myPreds.find(p => p.match_id === matchId)
    const updated = { ...existing, match_id: matchId, player_id: player.id, [side==='home'?'home_goals':'away_goals']: val }

    if (existing) {
      await supabase.from('predictions').update({ [side==='home'?'home_goals':'away_goals']: val })
        .eq('player_id', player.id).eq('match_id', matchId)
    } else {
      await supabase.from('predictions').insert({ player_id: player.id, match_id: matchId,
        home_goals: side==='home'?val:null, away_goals: side==='away'?val:null })
    }

    // Update local state
    setMyPreds(prev => {
      const without = prev.filter(p=>p.match_id!==matchId)
      return [...without, { ...(existing||{}), ...updated }]
    })
    setAllPreds(prev => {
      const mine = (prev[player.id]||[]).filter(p=>p.match_id!==matchId)
      return { ...prev, [player.id]: [...mine, { ...(existing||{}), ...updated }] }
    })
    setSaving(false)
  }

  // ── SAVE RESULT (admin) ──
  async function saveResult(matchId, side, val) {
    const col = side==='home'?'home_goals':'away_goals'
    const existing = results.find(r=>r.match_id===matchId)
    if (existing) {
      await supabase.from('results').update({ [col]: val }).eq('match_id', matchId)
    } else {
      await supabase.from('results').insert({ match_id: matchId,
        home_goals: side==='home'?val:null, away_goals: side==='away'?val:null })
    }
    setResults(prev => {
      const without = prev.filter(r=>r.match_id!==matchId)
      return [...without, { ...(existing||{match_id:matchId}), [col]: val }]
    })
  }

  async function removePlayer(id) {
    await supabase.from('players').delete().eq('id', id)
    setPlayers(prev => prev.filter(p=>p.id!==id))
  }

  // ─── HEADER ──────────────────────────────────────────────────────────────
  function Header({ sub }) {
    return (
      <div style={{ background:'linear-gradient(135deg,#0d1f3c,#07090f)',
        borderBottom:'1px solid #1e2d45',padding:'14px 20px',
        position:'sticky',top:0,zIndex:100 }}>
        <div style={{ maxWidth:860,margin:'0 auto',display:'flex',alignItems:'center',gap:10 }}>
          <span style={{ fontSize:'1.5rem' }}>⚽</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Oswald,sans-serif',fontWeight:700,
              fontSize:'1.1rem',color:'#fff',letterSpacing:'0.04em',
              textTransform:'uppercase',lineHeight:1 }}>
              {screen==='admin'?'ADMIN — ':player?.name || 'POLLA'} MUNDIAL 2026
            </div>
            <div style={{ color:'#4b617a',fontSize:'0.6rem',letterSpacing:'0.08em' }}>
              {saving?'💾 Guardando...':sub}
            </div>
          </div>
          <button onClick={() => { setScreen('login'); setPlayer(null); setMyPreds([]) }}
            style={{ background:'transparent',border:'none',color:'#4b617a',
              cursor:'pointer',fontSize:'0.75rem',fontFamily:'DM Mono,monospace' }}>
            Salir
          </button>
        </div>
      </div>
    )
  }

  function TabBar({ tabs }) {
    return (
      <div style={{ background:'#0c111d',borderBottom:'1px solid #1e2d45',display:'flex',overflowX:'auto' }}>
        <div style={{ maxWidth:860,margin:'0 auto',display:'flex',width:'100%' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              background: tab===t.id?'#f59e0b22':'transparent',
              border:'none', borderBottom: tab===t.id?'2px solid #f59e0b':'2px solid transparent',
              color: tab===t.id?'#f59e0b':'#4b617a',
              padding:'10px 18px',cursor:'pointer',
              fontFamily:'Oswald,sans-serif',fontWeight:600,
              fontSize:'0.78rem',letterSpacing:'0.06em',
              textTransform:'uppercase',transition:'all 0.15s',whiteSpace:'nowrap' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (loading) return <Loader />
  if (screen === 'login') return <LoginScreen onPlayerLogin={handlePlayerLogin} onAdminLogin={handleAdminLogin} />

  const filteredMatches = (
  filterGroup === 'ALL'
    ? MATCHES
    : MATCHES.filter(m => m.group === filterGroup)
).sort((a, b) => new Date(a.date) - new Date(b.date))

  // ─── PLAYER VIEW ────────────────────────────────────────────────────────
  if (screen === 'player') {
    const predCount = myPreds.filter(p=>p.home_goals!==null&&p.away_goals!==null).length
    return (
      <div style={{ minHeight:'100vh' }}>
        <Header sub={`${predCount}/72 pronósticos guardados`} />
        <TabBar tabs={[
          { id:'pronos', label:'📝 Mis Pronósticos' },
          { id:'tabla', label:'🏆 Tabla' },
        ]} />
        <div style={{ maxWidth:860,margin:'0 auto',padding:'20px 16px' }}>

          {tab==='pronos' && <>
            <div style={{ background:'#0c1a0c',border:'1px solid #1a3a1a',
              borderRadius:10,padding:'10px 14px',marginBottom:16,
              fontSize:'0.72rem',color:'#86efac' }}>
              🔒 Los pronósticos se bloquean automáticamente 5 min antes del partido.
              Se guardan al instante en tiempo real.
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,gap:12,flexWrap:'wrap' }}>
  <button
    onClick={() => {
      alert('Pronósticos guardados correctamente ✅')
      setScreen('login')
      setPlayer(null)
    }}
    style={{
      background:'#22c55e',
      border:'none',
      borderRadius:8,
      padding:'10px 18px',
      color:'#07110a',
      fontFamily:'Oswald,sans-serif',
      fontWeight:700,
      fontSize:'0.85rem',
      letterSpacing:'0.05em',
      cursor:'pointer'
    }}>
    💾 GUARDAR Y VOLVER AL MENÚ
  </button>

  <div style={{ color:'#4b617a',fontSize:'0.72rem' }}>
    Los cambios se guardan automáticamente
  </div>
</div>    
            <GroupFilter active={filterGroup} setActive={setFilterGroup} />
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {filteredMatches.map(m => {
                const locked = isLocked(m)
                const pred = myPreds.find(p=>p.match_id===m.id)
                const real = results.find(r=>r.match_id===m.id)
                const pts = calcPoints(pred, real)
                return (
                  <MatchRow key={m.id} match={m}
                    homeVal={pred?.home_goals ?? ''} awayVal={pred?.away_goals ?? ''}
                    onHomeChange={v => !locked && savePred(m.id,'home',v)}
                    onAwayChange={v => !locked && savePred(m.id,'away',v)}
                    locked={locked} result={real} pts={pts} />
                )
              })}
            </div>
          </>}

          {tab==='tabla' && (
            <Leaderboard players={players} allPreds={allPreds}
              results={results} currentPlayerId={player?.id} />
          )}
        </div>
      </div>
    )
  }

  // ─── ADMIN VIEW ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh' }}>
     <div style={{
  background:'linear-gradient(135deg,#0d1f3c,#07090f)',
  borderBottom:'1px solid #1e2d45',
  padding:'14px 20px',
  position:'sticky',
  top:0,
  zIndex:100
}}>
  <div style={{
    maxWidth:860,
    margin:'0 auto',
    display:'flex',
    alignItems:'center',
    gap:10
  }}>
    <span style={{ fontSize:'1.5rem' }}>⚽</span>

    <div style={{ flex:1 }}>
      <div style={{
        fontFamily:'Oswald,sans-serif',
        fontWeight:700,
        fontSize:'1.1rem',
        color:'#fff',
        letterSpacing:'0.04em',
        textTransform:'uppercase',
        lineHeight:1
      }}>
        ADMIN — POLLA MUNDIAL 2026
      </div>

      <div style={{
        color:'#4b617a',
        fontSize:'0.6rem',
        letterSpacing:'0.08em'
      }}>
        Panel de administración
      </div>
    </div>

    <button
      onClick={() => {
        setScreen('login')
        setPlayer(null)
      }}
      style={{
        background:'#1e2d45',
        border:'1px solid #4b617a',
        borderRadius:8,
        padding:'8px 14px',
        color:'#e8eaf0',
        cursor:'pointer',
        fontFamily:'Oswald,sans-serif',
        fontWeight:700,
        fontSize:'0.75rem'
      }}>
      ← MENÚ PRINCIPAL
    </button>
  </div>
</div>
      <TabBar tabs={[
        { id:'resultados', label:'⚽ Resultados' },
        { id:'apostadores', label:'👥 Jugadores' },
        { id:'tabla', label:'🏆 Tabla' },
      ]} />
      <div style={{ maxWidth:860,margin:'0 auto',padding:'20px 16px' }}>

        {tab==='resultados' && <>
          <SectionTitle>Ingresar Resultados Oficiales</SectionTitle>
          <div style={{ background:'#0c1a0c',border:'1px solid #1a3a1a',
            borderRadius:10,padding:'10px 14px',marginBottom:16,
            fontSize:'0.72rem',color:'#86efac' }}>
            Los cambios se guardan automáticamente y actualizan la tabla en tiempo real para todos.
          </div>
          <GroupFilter active={filterGroup} setActive={setFilterGroup} />
          <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
            {filteredMatches.map(m => {
              const real = results.find(r=>r.match_id===m.id)
              return (
                <MatchRow key={m.id} match={m}
                  homeVal={real?.home_goals??''} awayVal={real?.away_goals??''}
                  onHomeChange={v => saveResult(m.id,'home',v)}
                  onAwayChange={v => saveResult(m.id,'away',v)}
                  locked={false} isResult />
              )
            })}
          </div>
        </>}

        {tab==='apostadores' && <>
         <SectionTitle>Jugadores registrados ({players.length})</SectionTitle>
          {players.length===0
            ? <div style={{ textAlign:'center',padding:'40px',color:'#4b617a' }}>Nadie se ha registrado aún</div>
            : players.map((p,i) => {
              const preds = allPreds[p.id]||[]
              const predCount = preds.filter(x=>x.home_goals!==null&&x.away_goals!==null).length
              let total=0; MATCHES.forEach(m=>{
                const pred=preds.find(x=>x.match_id===m.id)
                const real=results.find(r=>r.match_id===m.id)
                const pts=calcPoints(pred,real); if(pts!==null)total+=pts
              })
              return (
                <div key={p.id} style={{ background:'#111827',border:'1px solid #1e2d45',
                  borderRadius:10,padding:'12px 16px',marginBottom:8,
                  display:'flex',alignItems:'center',gap:12 }}>
                  <span style={{ fontFamily:'Oswald,sans-serif',fontWeight:700,
                    color:'#4b617a',fontSize:'0.85rem',minWidth:20 }}>{i+1}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Oswald,sans-serif',fontWeight:600 }}>{p.name}</div>
                    <div style={{ color:'#4b617a',fontSize:'0.68rem' }}>
                      {predCount}/72 pronósticos ·{' '}
                      <span style={{ color:'#f59e0b' }}>{total} pts</span>
                    </div>
                  </div>
                  <button onClick={()=>removePlayer(p.id)}
                    style={{ background:'transparent',border:'none',color:'#4b617a',
                      cursor:'pointer',fontSize:'1.1rem',padding:'2px 6px' }}>×</button>
                </div>
              )
            })
          }
        </>}

       {tab==='tabla' && (
  <div>
    <Leaderboard
      players={players}
      allPreds={allPreds}
      results={results}
    />

    <div style={{ marginTop:30 }}>
      <SectionTitle>Detalle por jugador</SectionTitle>

      {players.map(player => {
        const preds = allPreds[player.id] || []

        return (
          <div
            key={player.id}
            style={{
              background:'#111827',
              border:'1px solid #1e2d45',
              borderRadius:12,
              marginBottom:20,
              overflow:'hidden'
            }}
          >
            <div style={{
              padding:'14px 18px',
              borderBottom:'1px solid #1e2d45',
              fontFamily:'Oswald,sans-serif',
              fontWeight:700,
              fontSize:'1rem',
              color:'#f59e0b'
            }}>
              {player.name}
            </div>

            {MATCHES.map(match => {
              const pred = preds.find(
                p => p.match_id === match.id
              )

              const real = results.find(
                r => r.match_id === match.id
              )

              const pts = calcPoints(pred, real)

              return (
                <div
                  key={match.id}
                  style={{
                    display:'grid',
                    gridTemplateColumns:'1fr 110px 110px 70px',
                    gap:10,
                    padding:'10px 16px',
                    borderBottom:'1px solid #1e2d4522',
                    alignItems:'center',
                    fontSize:'0.75rem'
                  }}
                >
                  <div>
                    <strong>{match.home}</strong>
                    {' vs '}
                    <strong>{match.away}</strong>
                  </div>

                  <div style={{ color:'#4b617a' }}>
                    Pred:
                    {' '}
                    <strong style={{ color:'#fff' }}>
                      {pred?.home_goals ?? '-'}
                      -
                      {pred?.away_goals ?? '-'}
                    </strong>
                  </div>

                  <div style={{ color:'#22c55e' }}>
                    Real:
                    {' '}
                    <strong>
                      {real?.home_goals ?? '-'}
                      -
                      {real?.away_goals ?? '-'}
                    </strong>
                  </div>

                  <div>
                    <PtsBadge pts={pts} />
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  </div>
)}
