export const GROUP_COLORS = {
  A:"#ef4444", B:"#f97316", C:"#eab308", D:"#22c55e",
  E:"#06b6d4", F:"#3b82f6", G:"#8b5cf6", H:"#ec4899",
  I:"#f43f5e", J:"#10b981", K:"#f59e0b", L:"#6366f1"
}

export const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "MUNDIAL2026"

export const MATCHES = [
  { id:1,  group:"A", home:"México 🇲🇽",          away:"Sudáfrica 🇿🇦",       date:"Jun 11", ko:"2026-06-12T01:00:00Z" },
  { id:2,  group:"A", home:"Corea del Sur 🇰🇷",   away:"Chequia 🇨🇿",         date:"Jun 11", ko:"2026-06-12T03:00:00Z" },
  { id:3,  group:"A", home:"México 🇲🇽",          away:"Corea del Sur 🇰🇷",   date:"Jun 15", ko:"2026-06-16T00:00:00Z" },
  { id:4,  group:"A", home:"Chequia 🇨🇿",         away:"Sudáfrica 🇿🇦",       date:"Jun 15", ko:"2026-06-16T00:00:00Z" },
  { id:5,  group:"A", home:"México 🇲🇽",          away:"Chequia 🇨🇿",         date:"Jun 19", ko:"2026-06-19T21:00:00Z" },
  { id:6,  group:"A", home:"Sudáfrica 🇿🇦",       away:"Corea del Sur 🇰🇷",   date:"Jun 19", ko:"2026-06-19T21:00:00Z" },
  { id:7,  group:"B", home:"Canadá 🇨🇦",          away:"Bosnia-Herz. 🇧🇦",    date:"Jun 12", ko:"2026-06-12T22:00:00Z" },
  { id:8,  group:"B", home:"Qatar 🇶🇦",           away:"Suiza 🇨🇭",           date:"Jun 12", ko:"2026-06-13T01:00:00Z" },
  { id:9,  group:"B", home:"Canadá 🇨🇦",          away:"Qatar 🇶🇦",           date:"Jun 16", ko:"2026-06-16T22:00:00Z" },
  { id:10, group:"B", home:"Bosnia-Herz. 🇧🇦",    away:"Suiza 🇨🇭",           date:"Jun 16", ko:"2026-06-16T22:00:00Z" },
  { id:11, group:"B", home:"Canadá 🇨🇦",          away:"Suiza 🇨🇭",           date:"Jun 20", ko:"2026-06-20T20:00:00Z" },
  { id:12, group:"B", home:"Bosnia-Herz. 🇧🇦",    away:"Qatar 🇶🇦",           date:"Jun 20", ko:"2026-06-20T20:00:00Z" },
  { id:13, group:"C", home:"Brasil 🇧🇷",           away:"Marruecos 🇲🇦",       date:"Jun 13", ko:"2026-06-13T22:00:00Z" },
  { id:14, group:"C", home:"Haití 🇭🇹",            away:"Escocia 🏴󠁧󠁢󠁳󠁣󠁴󠁿",       date:"Jun 13", ko:"2026-06-14T01:00:00Z" },
  { id:15, group:"C", home:"Brasil 🇧🇷",           away:"Haití 🇭🇹",            date:"Jun 17", ko:"2026-06-17T22:00:00Z" },
  { id:16, group:"C", home:"Marruecos 🇲🇦",       away:"Escocia 🏴󠁧󠁢󠁳󠁣󠁴󠁿",       date:"Jun 17", ko:"2026-06-17T22:00:00Z" },
  { id:17, group:"C", home:"Brasil 🇧🇷",           away:"Escocia 🏴󠁧󠁢󠁳󠁣󠁴󠁿",       date:"Jun 21", ko:"2026-06-21T20:00:00Z" },
  { id:18, group:"C", home:"Marruecos 🇲🇦",       away:"Haití 🇭🇹",            date:"Jun 21", ko:"2026-06-21T20:00:00Z" },
  { id:19, group:"D", home:"EE.UU. 🇺🇸",          away:"Paraguay 🇵🇾",         date:"Jun 12", ko:"2026-06-13T04:00:00Z" },
  { id:20, group:"D", home:"Australia 🇦🇺",        away:"Turquía 🇹🇷",          date:"Jun 14", ko:"2026-06-15T01:00:00Z" },
  { id:21, group:"D", home:"EE.UU. 🇺🇸",          away:"Australia 🇦🇺",        date:"Jun 18", ko:"2026-06-19T01:00:00Z" },
  { id:22, group:"D", home:"Paraguay 🇵🇾",         away:"Turquía 🇹🇷",          date:"Jun 18", ko:"2026-06-19T01:00:00Z" },
  { id:23, group:"D", home:"EE.UU. 🇺🇸",          away:"Turquía 🇹🇷",          date:"Jun 22", ko:"2026-06-22T23:00:00Z" },
  { id:24, group:"D", home:"Paraguay 🇵🇾",         away:"Australia 🇦🇺",        date:"Jun 22", ko:"2026-06-22T23:00:00Z" },
  { id:25, group:"E", home:"Alemania 🇩🇪",         away:"Curazao 🇨🇼",          date:"Jun 13", ko:"2026-06-13T23:00:00Z" },
  { id:26, group:"E", home:"C. de Marfil 🇨🇮",    away:"Ecuador 🇪🇨",          date:"Jun 13", ko:"2026-06-13T23:00:00Z" },
  { id:27, group:"E", home:"Alemania 🇩🇪",         away:"C. de Marfil 🇨🇮",    date:"Jun 17", ko:"2026-06-18T02:00:00Z" },
  { id:28, group:"E", home:"Curazao 🇨🇼",          away:"Ecuador 🇪🇨",          date:"Jun 17", ko:"2026-06-18T02:00:00Z" },
  { id:29, group:"E", home:"Alemania 🇩🇪",         away:"Ecuador 🇪🇨",          date:"Jun 21", ko:"2026-06-22T02:00:00Z" },
  { id:30, group:"E", home:"Curazao 🇨🇼",          away:"C. de Marfil 🇨🇮",    date:"Jun 21", ko:"2026-06-22T02:00:00Z" },
  { id:31, group:"F", home:"P. Bajos 🇳🇱",         away:"Japón 🇯🇵",            date:"Jun 14", ko:"2026-06-14T23:00:00Z" },
  { id:32, group:"F", home:"Suecia 🇸🇪",           away:"Túnez 🇹🇳",            date:"Jun 14", ko:"2026-06-15T02:00:00Z" },
  { id:33, group:"F", home:"P. Bajos 🇳🇱",         away:"Suecia 🇸🇪",           date:"Jun 18", ko:"2026-06-18T23:00:00Z" },
  { id:34, group:"F", home:"Japón 🇯🇵",            away:"Túnez 🇹🇳",            date:"Jun 18", ko:"2026-06-18T23:00:00Z" },
  { id:35, group:"F", home:"P. Bajos 🇳🇱",         away:"Túnez 🇹🇳",            date:"Jun 22", ko:"2026-06-23T02:00:00Z" },
  { id:36, group:"F", home:"Japón 🇯🇵",            away:"Suecia 🇸🇪",           date:"Jun 22", ko:"2026-06-23T02:00:00Z" },
  { id:37, group:"G", home:"Bélgica 🇧🇪",          away:"Egipto 🇪🇬",           date:"Jun 15", ko:"2026-06-15T22:00:00Z" },
  { id:38, group:"G", home:"Irán 🇮🇷",             away:"Nueva Zelanda 🇳🇿",    date:"Jun 15", ko:"2026-06-16T01:00:00Z" },
  { id:39, group:"G", home:"Bélgica 🇧🇪",          away:"Irán 🇮🇷",             date:"Jun 19", ko:"2026-06-19T22:00:00Z" },
  { id:40, group:"G", home:"Egipto 🇪🇬",           away:"Nueva Zelanda 🇳🇿",    date:"Jun 19", ko:"2026-06-19T22:00:00Z" },
  { id:41, group:"G", home:"Bélgica 🇧🇪",          away:"Nueva Zelanda 🇳🇿",    date:"Jun 23", ko:"2026-06-23T20:00:00Z" },
  { id:42, group:"G", home:"Egipto 🇪🇬",           away:"Irán 🇮🇷",             date:"Jun 23", ko:"2026-06-23T20:00:00Z" },
  { id:43, group:"H", home:"España 🇪🇸",           away:"Cabo Verde 🇨🇻",       date:"Jun 15", ko:"2026-06-15T16:00:00Z" },
  { id:44, group:"H", home:"Arabia Saudí 🇸🇦",     away:"Uruguay 🇺🇾",          date:"Jun 15", ko:"2026-06-16T01:00:00Z" },
  { id:45, group:"H", home:"España 🇪🇸",           away:"Arabia Saudí 🇸🇦",     date:"Jun 19", ko:"2026-06-20T01:00:00Z" },
  { id:46, group:"H", home:"Cabo Verde 🇨🇻",       away:"Uruguay 🇺🇾",          date:"Jun 19", ko:"2026-06-20T01:00:00Z" },
  { id:47, group:"H", home:"España 🇪🇸",           away:"Uruguay 🇺🇾",          date:"Jun 23", ko:"2026-06-24T01:00:00Z" },
  { id:48, group:"H", home:"Cabo Verde 🇨🇻",       away:"Arabia Saudí 🇸🇦",     date:"Jun 23", ko:"2026-06-24T01:00:00Z" },
  { id:49, group:"I", home:"Francia 🇫🇷",          away:"Senegal 🇸🇳",          date:"Jun 16", ko:"2026-06-16T19:00:00Z" },
  { id:50, group:"I", home:"Noruega 🇳🇴",          away:"Irak 🇮🇶",             date:"Jun 16", ko:"2026-06-17T01:00:00Z" },
  { id:51, group:"I", home:"Francia 🇫🇷",          away:"Noruega 🇳🇴",          date:"Jun 20", ko:"2026-06-20T22:00:00Z" },
  { id:52, group:"I", home:"Senegal 🇸🇳",          away:"Irak 🇮🇶",             date:"Jun 20", ko:"2026-06-20T22:00:00Z" },
  { id:53, group:"I", home:"Francia 🇫🇷",          away:"Irak 🇮🇶",             date:"Jun 24", ko:"2026-06-24T20:00:00Z" },
  { id:54, group:"I", home:"Senegal 🇸🇳",          away:"Noruega 🇳🇴",          date:"Jun 24", ko:"2026-06-24T20:00:00Z" },
  { id:55, group:"J", home:"Argentina 🇦🇷",        away:"Argelia 🇩🇿",          date:"Jun 16", ko:"2026-06-16T23:00:00Z" },
  { id:56, group:"J", home:"Austria 🇦🇹",          away:"Jordania 🇯🇴",          date:"Jun 16", ko:"2026-06-17T02:00:00Z" },
  { id:57, group:"J", home:"Argentina 🇦🇷",        away:"Austria 🇦🇹",          date:"Jun 20", ko:"2026-06-21T02:00:00Z" },
  { id:58, group:"J", home:"Argelia 🇩🇿",          away:"Jordania 🇯🇴",          date:"Jun 20", ko:"2026-06-21T02:00:00Z" },
  { id:59, group:"J", home:"Argentina 🇦🇷",        away:"Jordania 🇯🇴",          date:"Jun 24", ko:"2026-06-25T02:00:00Z" },
  { id:60, group:"J", home:"Argelia 🇩🇿",          away:"Austria 🇦🇹",          date:"Jun 24", ko:"2026-06-25T02:00:00Z" },
  { id:61, group:"K", home:"Portugal 🇵🇹",         away:"R.D. Congo 🇨🇩",       date:"Jun 17", ko:"2026-06-17T22:00:00Z" },
  { id:62, group:"K", home:"Uzbekistán 🇺🇿",       away:"Colombia 🇨🇴",         date:"Jun 17", ko:"2026-06-18T01:00:00Z" },
  { id:63, group:"K", home:"Portugal 🇵🇹",         away:"Uzbekistán 🇺🇿",       date:"Jun 21", ko:"2026-06-21T22:00:00Z" },
  { id:64, group:"K", home:"R.D. Congo 🇨🇩",       away:"Colombia 🇨🇴",         date:"Jun 21", ko:"2026-06-21T22:00:00Z" },
  { id:65, group:"K", home:"Portugal 🇵🇹",         away:"Colombia 🇨🇴",         date:"Jun 25", ko:"2026-06-25T20:00:00Z" },
  { id:66, group:"K", home:"R.D. Congo 🇨🇩",       away:"Uzbekistán 🇺🇿",       date:"Jun 25", ko:"2026-06-25T20:00:00Z" },
  { id:67, group:"L", home:"Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿",    away:"Croacia 🇭🇷",          date:"Jun 17", ko:"2026-06-17T19:00:00Z" },
  { id:68, group:"L", home:"Ghana 🇬🇭",            away:"Panamá 🇵🇦",           date:"Jun 17", ko:"2026-06-18T01:00:00Z" },
  { id:69, group:"L", home:"Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿",    away:"Ghana 🇬🇭",            date:"Jun 21", ko:"2026-06-22T01:00:00Z" },
  { id:70, group:"L", home:"Croacia 🇭🇷",          away:"Panamá 🇵🇦",           date:"Jun 21", ko:"2026-06-22T01:00:00Z" },
  { id:71, group:"L", home:"Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿",    away:"Panamá 🇵🇦",           date:"Jun 25", ko:"2026-06-26T01:00:00Z" },
  { id:72, group:"L", home:"Croacia 🇭🇷",          away:"Ghana 🇬🇭",            date:"Jun 25", ko:"2026-06-26T01:00:00Z" },
]

// Lock 5 minutes before kickoff
export function isLocked(match) {
  const ko = new Date(match.ko)
  return false
}

// Scoring system
export function calcPoints(pred, real) {
  if (
    !pred ||
    !real ||
    pred.home_goals === null ||
    pred.away_goals === null ||
    real.home_goals === null ||
    real.away_goals === null
  ) {
    return null
  }

  const ph = pred.home_goals
  const pa = pred.away_goals

  const rh = real.home_goals
  const ra = real.away_goals

  // Marcador exacto
  if (ph === rh && pa === ra) {
    return 5
  }

  let points = 0

  // Resultado correcto G/E/P
  const predResult =
    ph > pa ? 'H' :
    ph < pa ? 'A' :
    'D'

  const realResult =
    rh > ra ? 'H' :
    rh < ra ? 'A' :
    'D'

  if (predResult === realResult) {
    points += 2
  }

  // Gol exacto local
  if (ph === rh) {
    points += 1
  }

  // Gol exacto visitante
  if (pa === ra) {
    points += 1
  }

  return points
}
