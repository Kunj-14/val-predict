/* ==========================================================================
   VALOPREDICT CLIENT-SIDE ENGINE (app.js)
   Completely rebuilt from scratch to power the Barlow sci-fi layout.
   ========================================================================== */

const API_BASE = "http://127.0.0.1:8000";

let VCT_DB = {
    teams: {},
    matches: [],
    standings: {},
    tournaments: [],
    predictionsHistory: [],
    activeKnockoutsRegion: 'VCT Americas',
    activeHomeFilter: 'all'
};

// --- SVG TEAM LOGOS SYSTEM ---
function getTeamSVG(teamTag, size = 40, outlineColor = 'none') {
    const fill = VCT_DB.teams[teamTag]?.color || '#ffffff';
    let path = '';
    
    switch (teamTag) {
        case 'SEN':
            path = `<path d="M10 5 L30 5 L30 15 L20 15 L20 23 L30 23 L30 35 L10 35 L10 25 L20 25 L20 17 L10 17 Z" fill="${fill}" />`;
            break;
        case 'FNC':
            path = `<path d="M6 5 H34 V12 H23 V19 H31 V26 H23 V35 H15 V5 Z M34 19 H30 V35 H34 Z" fill="${fill}" />`;
            break;
        case 'PRX':
            path = `<polygon points="20,5 35,20 30,35 10,35 5,20" fill="${fill}" /><polygon points="12,12 28,12 24,28 12,28" fill="#121826" />`;
            break;
        case 'GEN':
            path = `<path d="M8 5 L32 5 L35 18 L20 35 L5 18 Z" fill="${fill}" /><path d="M12 10 L28 10 L20 26 Z" fill="#121826" />`;
            break;
        case 'G2':
            path = `<polygon points="20,4 32,12 28,32 20,36 12,32 8,12" fill="${fill}" /><polygon points="20,10 26,16 23,26 17,26 14,16" fill="#121826" />`;
            break;
        case 'EDG':
            path = `<path d="M10 5 H28 V12 H18 V16 H26 V22 H18 V28 H28 V35 H10 Z M30 12 L30 35 H35 L35 12 Z" fill="${fill}" />`;
            break;
        case 'LOUD':
            path = `<polygon points="8,5 25,5 15,22 32,22 22,35 5,35" fill="${fill}" />`;
            break;
        case 'LEV':
            path = `<path d="M8 5 L32 5 C32 15 28 30 20 37 C12 30 8 15 8 5 Z" fill="${fill}" /><path d="M14 10 L26 10 C26 17 23 27 20 32 C17 27 14 17 14 10 Z" fill="#121826" />`;
            break;
        case '100T':
            path = `<path d="M8 5 H14 V35 H8 Z M20 5 H26 V35 H20 Z M32 5 H38 V35 H32 Z" fill="${fill}" /><polygon points="5,15 35,5 35,10 5,20" fill="${fill}" />`;
            break;
        case 'KRU':
            path = `<polygon points="6,35 10,12 20,24 30,12 34,35" fill="${fill}" /><polygon points="12,30 20,20 28,30" fill="#121826" />`;
            break;
        case 'TH':
            path = `<path d="M20 5 L34 12 L30 28 L20 35 L10 28 L6 12 Z" fill="${fill}" /><path d="M20 10 L28 15 L25 25 L20 30 L15 25 L12 15 Z" fill="#121826" />`;
            break;
        case 'FUT':
            path = `<circle cx="20" cy="20" r="16" fill="${fill}" /><circle cx="20" cy="20" r="10" fill="#121826" /><polygon points="17,14 23,14 20,26" fill="${fill}" />`;
            break;
        case 'NAVI':
            path = `<polygon points="6,5 34,12 28,35 12,28" fill="${fill}" /><polygon points="12,12 28,16 24,28 16,24" fill="#121826" />`;
            break;
        case 'VIT':
            path = `<polygon points="8,8 20,24 32,8 26,8 20,16 14,8" fill="${fill}" /><polygon points="8,20 20,32 32,20 26,20 20,26 14,20" fill="${fill}" />`;
            break;
        case 'KC':
            path = `<path d="M8 5 H18 V20 H8 Z M22 20 H32 V35 H22 Z" fill="${fill}" /><polygon points="12,15 28,30 24,30 12,18" fill="${fill}" />`;
            break;
        case 'DRX':
            path = `<path d="M12 5 H28 V35 H12 Z" fill="${fill}" /><path d="M5 12 H35 V28 H5 Z" fill="${fill}" /><rect x="16" y="16" width="8" height="8" fill="#121826" />`;
            break;
        case 'T1':
            path = `<polygon points="6,5 34,5 34,12 23,12 23,35 15,35 15,12 6,12" fill="${fill}" /><polygon points="30,16 34,22 30,28 26,22" fill="${fill}" />`;
            break;
        case 'TS':
            path = `<polygon points="20,8 32,20 20,32 8,20" fill="${fill}" /><circle cx="20" cy="20" r="6" fill="#121826" />`;
            break;
        case 'TLN':
            path = `<path d="M8 5 L16 35 M20 5 L20 35 M32 5 L24 35" stroke="${fill}" stroke-width="4" stroke-linecap="round" />`;
            break;
        case 'FPX':
            path = `<polygon points="6,15 20,8 34,15 20,26" fill="${fill}" /><polygon points="12,24 20,35 28,24" fill="${fill}" />`;
            break;
        case 'TE':
            path = `<polygon points="20,5 34,28 6,28" fill="${fill}" /><polygon points="20,12 28,24 12,24" fill="#121826" />`;
            break;
        case 'BLG':
            path = `<rect x="6" y="10" width="28" height="20" rx="4" fill="${fill}" /><rect x="10" y="14" width="20" height="12" rx="2" fill="#121826" /><polygon points="12,6 18,10 16,10 10,6" fill="${fill}" /><polygon points="28,6 22,10 24,10 30,6" fill="${fill}" />`;
            break;
        case 'JDG':
            path = `<path d="M10 8 L30 8 L30 18 L20 28 L10 18 Z" fill="${fill}" /><polygon points="16,12 24,12 20,20" fill="#121826" />`;
            break;
        case 'NOVA':
            path = `<polygon points="20,4 24,16 36,20 24,24 20,36 16,24 4,20 16,16" fill="${fill}" />`;
            break;
        case 'C9':
            path = `<path d="M10 20 A 10 10 0 1 1 30 20" fill="none" stroke="${fill}" stroke-width="4" /><path d="M15 25 A 5 5 0 1 1 25 25" fill="none" stroke="${fill}" stroke-width="3" />`;
            break;
        case 'EG':
            path = `<polygon points="10,5 30,5 30,12 18,12 18,20 28,20 28,27 18,27 18,35 10,35" fill="${fill}" />`;
            break;
        case 'NRG':
            path = `<polygon points="8,35 8,5 18,5 26,22 26,5 32,5 32,35 24,35 14,16 14,35" fill="${fill}" />`;
            break;
        case 'FUR':
            path = `<circle cx="20" cy="20" r="14" fill="${fill}" /><circle cx="20" cy="20" r="8" fill="#121826" />`;
            break;
        case 'MIBR':
            path = `<polygon points="6,35 12,5 20,22 28,5 34,35 28,35 24,18 20,28 16,18 12,35" fill="${fill}" />`;
            break;
        case '2G':
            path = `<path d="M10 10 H30 V16 H20 V22 H30 V35 H10 V28 H20 V22 H10 Z" fill="${fill}" />`;
            break;
        case 'TL':
            path = `<path d="M12 5 L28 5 L32 18 L20 35 L8 18 Z" fill="${fill}" /><circle cx="20" cy="18" r="6" fill="#121826" />`;
            break;
        case 'BBL':
            path = `<circle cx="20" cy="20" r="15" stroke="${fill}" stroke-width="4" fill="none" /><circle cx="20" cy="20" r="6" fill="${fill}" />`;
            break;
        case 'GX':
            path = `<line x1="8" y1="8" x2="32" y2="32" stroke="${fill}" stroke-width="6" /><line x1="32" y1="8" x2="8" y2="32" stroke="${fill}" stroke-width="6" />`;
            break;
        case 'KOI':
            path = `<path d="M10 5 L30 15 L20 25 L30 35 L10 25 Z" fill="${fill}" />`;
            break;
        case 'M8':
            path = `<polygon points="8,5 16,5 20,18 24,5 32,5 32,35 26,35 26,18 20,28 14,18 14,35 8,35" fill="${fill}" />`;
            break;
        case 'APK':
            path = `<polygon points="20,5 35,32 5,32" fill="${fill}" /><polygon points="20,12 28,27 12,27" fill="#121826" />`;
            break;
        case 'RRQ':
            path = `<polygon points="10,35 6,10 15,22 20,8 25,22 34,10 30,35" fill="${fill}" />`;
            break;
        case 'GE':
            path = `<circle cx="20" cy="20" r="14" fill="none" stroke="${fill}" stroke-width="3" /><line x1="6" y1="20" x2="34" y2="20" stroke="${fill}" stroke-width="2" /><line x1="20" y1="6" x2="20" y2="34" stroke="${fill}" stroke-width="2" />`;
            break;
        case 'BLD':
            path = `<path d="M20 5 C30 18 32 26 32 30 C32 35 27 35 20 35 C13 35 8 35 8 30 C8 26 10 18 20 5 Z" fill="${fill}" />`;
            break;
        case 'DFM':
            path = `<polygon points="20,4 25,16 37,16 27,24 31,36 20,28 9,36 13,24 3,16 15,16" fill="${fill}" />`;
            break;
        case 'ZETA':
            path = `<polygon points="8,5 32,5 32,10 18,25 32,25 32,35 8,35 8,30 22,15 8,15" fill="${fill}" />`;
            break;
        case 'BOOM':
            path = `<polygon points="20,4 34,18 26,18 26,36 14,36 14,18 6,18" fill="${fill}" />`;
            break;
        case 'AG':
            path = `<polygon points="20,5 35,35 28,35 20,18 12,35 5,35" fill="${fill}" /><line x1="12" y1="26" x2="28" y2="26" stroke="${fill}" stroke-width="3" />`;
            break;
        case 'DRG':
            path = `<path d="M10 15 L20 5 L30 15 L20 25 Z M10 30 L20 20 L30 30 L20 35 Z" fill="${fill}" />`;
            break;
        case 'TYL':
            path = `<polygon points="12,5 28,5 32,18 20,35 8,18" fill="${fill}" /><line x1="20" y1="5" x2="20" y2="35" stroke="#121826" stroke-width="4" />`;
            break;
        case 'TEC':
            path = `<rect x="8" y="8" width="24" height="24" fill="${fill}" /><rect x="14" y="14" width="12" height="12" fill="#121826" />`;
            break;
        case 'WOL':
            path = `<polygon points="20,6 32,16 26,34 14,34 8,16" fill="${fill}" /><polygon points="20,12 26,18 23,28 17,28 14,18" fill="#121826" />`;
            break;
        case 'XLG':
            path = `<circle cx="20" cy="20" r="14" fill="${fill}" /><path d="M12 12 L28 28 M28 12 L12 28" stroke="#121826" stroke-width="3" />`;
            break;
        default:
            path = `<circle cx="20" cy="20" r="15" fill="#ffffff"/>`;
    }
    
    return `
    <svg viewBox="0 0 40 40" width="${size}" height="${size}" style="filter: drop-shadow(0 0 4px ${outlineColor});">
        ${path}
    </svg>`;
}

function getTeamLogo(teamTag, size = 40, outlineColor = 'none') {
    const team = VCT_DB.teams[teamTag];
    if (team && team.logoPath) {
        return `<img src="${team.logoPath}" alt="${team.name}" width="${size}" height="${size}" style="object-fit: contain; filter: drop-shadow(0 0 4px ${outlineColor === 'none' ? 'transparent' : outlineColor});" />`;
    }
    return getTeamSVG(teamTag, size, outlineColor);
}

// --- DATA ACCESS & LOADING ---
async function fetchDatabase() {
    try {
        const [teamsRes, matchesRes, standingsRes, tournamentsRes, predictionsRes] = await Promise.all([
            fetch(`${API_BASE}/teams`),
            fetch(`${API_BASE}/matches`),
            fetch(`${API_BASE}/standings`),
            fetch(`${API_BASE}/tournaments`),
            fetch(`${API_BASE}/predictions`).catch(err => {
                console.warn("Prediction endpoint query failed:", err);
                return null;
            })
        ]);

        if (!teamsRes.ok || !matchesRes.ok || !standingsRes.ok || !tournamentsRes.ok) {
            throw new Error("HTTP status error loading VCT API telemetry");
        }

        VCT_DB.teams = await teamsRes.json();
        const rawMatches = await matchesRes.json();
        VCT_DB.standings = await standingsRes.json();
        VCT_DB.tournaments = await tournamentsRes.json();

        let predictions = [];
        if (predictionsRes && predictionsRes.ok) {
            try {
                predictions = await predictionsRes.json() || [];
            } catch (e) {
                console.warn("Error parsing predictions:", e);
            }
        }

        // Link predictions to matches
        VCT_DB.matches = rawMatches.map(m => {
            const pred = predictions.find(p => p && p.matchId === m.id);
            if (pred) {
                m.prediction = {
                    winner: pred.winner,
                    winnerTag: pred.winnerTag,
                    probA: Math.round(pred.probabilityA),
                    probB: Math.round(pred.probabilityB),
                    confidence: pred.confidence,
                    factors: pred.factors || [],
                    summary: `Predicted winner: ${pred.winner} (${pred.winnerTag}) with ${pred.probabilityA}% probability. Key factors: ${pred.factors.join(', ')}.`,
                    veto: pred.veto || [],
                    mapRates: pred.mapRates || {},
                    breakdown: pred.breakdown || {}
                };
            } else {
                m.prediction = null;
            }
            return m;
        });

        // Load predictions history from static server
        try {
            const [realHistoryRes, demoHistoryRes] = await Promise.all([
                fetch('/backend/data/prediction_history.json').catch(() => null),
                fetch('/backend/data/demo_prediction_history.json').catch(() => null)
            ]);
            let history = [];
            if (realHistoryRes && realHistoryRes.ok) {
                const realData = await realHistoryRes.json();
                if (Array.isArray(realData)) history = history.concat(realData);
            }
            if (demoHistoryRes && demoHistoryRes.ok) {
                const demoData = await demoHistoryRes.json();
                if (Array.isArray(demoData)) history = history.concat(demoData);
            }
            // Remove duplicates
            const seen = new Set();
            VCT_DB.predictionsHistory = history.filter(item => {
                if (!item || !item.matchId) return false;
                const key = `${item.matchId}-${item.modelVersion || 'v1'}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        } catch (e) {
            console.warn("Error loading predictions history:", e);
        }

        return true;
    } catch (error) {
        console.error("Error loading VCT API telemetry:", error);
        return false;
    }
}

// --- DYNAMIC SPA ROUTER ---
function switchTab(tabId) {
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const targetSection = document.getElementById(`${tabId}-view`);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const targetLink = document.querySelector(`a[href="#${tabId}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }

    if (tabId === 'home') {
        renderHome();
    } else if (tabId === 'knockouts') {
        renderKnockouts();
    } else if (tabId === 'standings') {
        renderStandings();
    } else if (tabId === 'schedule') {
        renderSchedule();
    } else if (tabId === 'results') {
        renderResults();
    }
}

// Get region visual info
function getRegionColor(regionName) {
    const lower = (regionName || '').toLowerCase();
    if (lower.includes('americas')) return 'var(--color-americas)';
    if (lower.includes('pacific')) return 'var(--color-pacific)';
    if (lower.includes('emea')) return 'var(--color-emea)';
    if (lower.includes('cn') || lower.includes('china')) return 'var(--color-cn)';
    if (lower.includes('masters')) return 'var(--color-masters)';
    if (lower.includes('champions')) return 'var(--color-champions)';
    return 'var(--color-primary)';
}

function getRegionClass(regionName) {
    const lower = (regionName || '').toLowerCase();
    if (lower.includes('americas')) return 'americas';
    if (lower.includes('pacific')) return 'pacific';
    if (lower.includes('emea')) return 'emea';
    if (lower.includes('cn') || lower.includes('china')) return 'cn';
    if (lower.includes('masters')) return 'masters';
    if (lower.includes('champions')) return 'champions';
    return '';
}

// --- PAGE 1: HOME PAGE RENDERING ---
function renderHome() {
    const heroEl = document.getElementById('featured-hero');
    
    // 1. Render Featured Match Hero (280px)
    const upcoming = VCT_DB.matches.filter(m => m.status === 'upcoming');
    const featured = VCT_DB.matches.find(m => m.isLock) || upcoming[0];

    if (featured) {
        const teamA = VCT_DB.teams[featured.teamA] || { name: featured.teamA, color: '#ffffff' };
        const teamB = VCT_DB.teams[featured.teamB] || { name: featured.teamB, color: '#ffffff' };
        const regionColor = getRegionColor(featured.league);
        const probA = featured.prediction ? featured.prediction.probA : 50;
        const dashOffset = 283 - (283 * probA) / 100;

        heroEl.style.borderTop = `4px solid ${regionColor}`;
        heroEl.innerHTML = `
            <div class="hero-bg-glow" style="background: ${regionColor};"></div>
            <div class="hero-team">
                ${getTeamLogo(featured.teamA, 80, teamA.color)}
                <div class="team-name" style="color: ${teamA.color};">${teamA.name}</div>
            </div>
            
            <div class="hero-center">
                <div class="prob-circle-container">
                    <svg class="prob-svg" viewBox="0 0 100 100">
                        <circle class="prob-circle-bg" cx="50" cy="50" r="45"></circle>
                        <circle class="prob-circle-val" cx="50" cy="50" r="45" style="stroke-dashoffset: ${dashOffset}; stroke: ${regionColor};"></circle>
                    </svg>
                    <div class="prob-circle-text">
                        <span class="vs">VS</span>
                        <span class="percentage" style="color: ${regionColor};">${probA}%</span>
                    </div>
                </div>
                <div class="hero-match-meta">
                    <div class="league-name">${featured.league.toUpperCase()}</div>
                    <span class="match-time">${formatMatchTime(featured.time)}</span>
                </div>
            </div>

            <div class="hero-team">
                ${getTeamLogo(featured.teamB, 80, teamB.color)}
                <div class="team-name" style="color: ${teamB.color};">${teamB.name}</div>
            </div>
        `;
        heroEl.onclick = () => openPredictionModal(featured.id);
        heroEl.style.cursor = 'pointer';
    } else {
        heroEl.innerHTML = `
            <div class="empty-state" style="border: none; width: 100%;">
                <i data-lucide="cpu" style="width: 48px; height: 48px;"></i>
                <div class="empty-title">AWAITING LIVE DATA</div>
                <div class="empty-msg">No scheduled or live matchups are currently populated in the database.</div>
            </div>
        `;
        heroEl.onclick = null;
        heroEl.style.cursor = 'default';
    }

    // 2. Render Live Section
    const liveMatches = VCT_DB.matches.filter(m => m.status === 'live' || m.status === 'live_score');
    const liveSec = document.getElementById('live-matches-section');
    const liveGrid = document.getElementById('live-matches-grid');

    if (liveMatches.length > 0) {
        liveSec.style.display = 'block';
        liveGrid.innerHTML = liveMatches.map(m => renderMatchCardHTML(m)).join('');
    } else {
        liveSec.style.display = 'none';
        liveGrid.innerHTML = '';
    }

    // 3. Render Upcoming Grid
    renderUpcomingGrid();
    lucide.createIcons();
}

function renderUpcomingGrid() {
    const grid = document.getElementById('upcoming-matches-grid');
    if (!grid) return;

    let list = VCT_DB.matches.filter(m => m.status === 'upcoming');
    const filter = VCT_DB.activeHomeFilter;

    if (filter !== 'all') {
        list = list.filter(m => {
            if (filter === 'Masters' || filter === 'Champions') {
                return (m.league || '').toLowerCase().includes(filter.toLowerCase());
            }
            return (m.league || '').toLowerCase() === filter.toLowerCase();
        });
    }

    if (list.length > 0) {
        grid.innerHTML = list.map(m => renderMatchCardHTML(m)).join('');
    } else {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: span 2; width: 100%;">
                <i data-lucide="calendar-x" style="width: 48px; height: 48px;"></i>
                <div class="empty-title">NO MATCHES SCHEDULED</div>
                <div class="empty-msg">There are no matches matching the active filter in this stage.</div>
            </div>
        `;
    }
}

function filterHomeMatches(filterVal, btn) {
    VCT_DB.activeHomeFilter = filterVal;
    
    // Toggle active classes
    const pills = btn.parentElement.querySelectorAll('.btn-pill');
    pills.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');

    renderUpcomingGrid();
    lucide.createIcons();
}

function renderMatchCardHTML(m) {
    const teamA = VCT_DB.teams[m.teamA] || { name: m.teamA, color: '#ffffff' };
    const teamB = VCT_DB.teams[m.teamB] || { name: m.teamB, color: '#ffffff' };
    const regionColor = getRegionColor(m.league);
    const probA = m.prediction ? m.prediction.probA : 50;
    const probB = m.prediction ? m.prediction.probB : 50;

    return `
        <div class="match-card" onclick="openPredictionModal('${m.id}')" style="border-left: 4px solid ${regionColor};">
            <div class="match-card-header">
                <span class="match-card-league">${m.league.toUpperCase()}</span>
                <span class="match-card-time">${formatMatchTime(m.time)}</span>
            </div>
            <div class="match-card-body">
                <div class="match-card-team">
                    ${getTeamLogo(m.teamA, 28, teamA.color)}
                    <span class="team-tag" style="color: ${teamA.color}">${m.teamA}</span>
                </div>
                <span class="match-card-vs">VS</span>
                <div class="match-card-team right">
                    <span class="team-tag" style="color: ${teamB.color}">${m.teamB}</span>
                    ${getTeamLogo(m.teamB, 28, teamB.color)}
                </div>
            </div>
            <div class="win-bar-container">
                <div class="win-bar-labels">
                    <span>${probA}%</span>
                    <span>${probB}%</span>
                </div>
                <div class="win-bar">
                    <div class="win-bar-fill" style="width: ${probA}%;"></div>
                </div>
            </div>
        </div>
    `;
}

// --- PAGE 2: STANDINGS PAGE RENDERING ---
function renderStandings() {
    const regions = {
        'VCT Americas': 'tbody-americas',
        'VCT Pacific': 'tbody-pacific',
        'VCT EMEA': 'tbody-emea',
        'VCT China': 'tbody-cn'
    };

    // Fallback real VCT 2026 teams with mock records
    const fallbacks = {
        'VCT Americas': [
            { team: 'SEN', wins: 7, losses: 1 },
            { team: 'LEV', wins: 6, losses: 2 },
            { team: 'NRG', wins: 5, losses: 3 },
            { team: 'C9', wins: 4, losses: 4 },
            { team: '100T', wins: 4, losses: 4 },
            { team: 'LOUD', wins: 3, losses: 5 },
            { team: 'EG', wins: 2, losses: 6 },
            { team: 'FUR', wins: 1, losses: 7 }
        ],
        'VCT Pacific': [
            { team: 'PRX', wins: 7, losses: 1 },
            { team: 'DRX', wins: 6, losses: 2 },
            { team: 'T1', wins: 5, losses: 3 },
            { team: 'GEN', wins: 5, losses: 3 },
            { team: 'GE', wins: 3, losses: 5 },
            { team: 'ZETA', wins: 3, losses: 5 },
            { team: 'DFM', wins: 2, losses: 6 },
            { team: 'RRQ', wins: 1, losses: 7 }
        ],
        'VCT EMEA': [
            { team: 'FNC', wins: 7, losses: 1 },
            { team: 'TH', wins: 6, losses: 2 },
            { team: 'NAVI', wins: 5, losses: 3 },
            { team: 'BBL', wins: 4, losses: 4 },
            { team: 'TL', wins: 4, losses: 4 },
            { team: 'KOI', wins: 3, losses: 5 },
            { team: 'GX', wins: 2, losses: 6 },
            { team: 'FUT', wins: 1, losses: 7 }
        ],
        'VCT China': [
            { team: 'EDG', wins: 7, losses: 1 },
            { team: 'BLG', wins: 6, losses: 2 },
            { team: 'FPX', wins: 5, losses: 3 },
            { team: 'WOL', wins: 3, losses: 5 }
        ]
    };

    Object.entries(regions).forEach(([regionKey, tbodyId]) => {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;

        let standingsList = VCT_DB.standings[regionKey] || [];
        
        // Check if standings list is empty or has all 0 records (scraping failed fallback)
        const allZero = standingsList.length === 0 || standingsList.every(s => s.wins === 0 && s.losses === 0);
        if (allZero) {
            standingsList = fallbacks[regionKey] || [];
        }

        // Sort by wins desc, losses asc
        const sorted = [...standingsList].sort((a, b) => {
            if (b.wins !== a.wins) return b.wins - a.wins;
            return a.losses - b.losses;
        });

        tbody.innerHTML = sorted.map((row, index) => {
            const rank = index + 1;
            const teamCode = row.team;
            const team = VCT_DB.teams[teamCode] || { name: teamCode, color: '#ffffff' };
            const pts = row.wins; // Wins equals Points
            let rankClass = '';
            if (rank === 1) rankClass = 'rank-1';
            else if (rank === 2) rankClass = 'rank-2';
            else if (rank === 3) rankClass = 'rank-3';

            return `
                <tr class="team-row ${rankClass}">
                    <td class="sr-number">#${rank}</td>
                    <td>
                        <div class="team-cell-content">
                            ${getTeamLogo(teamCode, 24, team.color)}
                            <span style="color: ${team.color};">${team.name}</span>
                        </div>
                    </td>
                    <td class="center">${row.wins}</td>
                    <td class="center">${row.losses}</td>
                    <td class="right pts-val">${pts}</td>
                </tr>
            `;
        }).join('');
    });
}

// --- PAGE 3: KNOCKOUTS PAGE RENDERING ---
const MOCK_BRACKETS = {
    'VCT Americas': {
        q1: { teamA: 'SEN', teamB: 'NRG', scoreA: 2, scoreB: 1, status: 'completed' },
        q2: { teamA: 'C9', teamB: '100T', scoreA: 0, scoreB: 2, status: 'completed' },
        q3: { teamA: 'LOUD', teamB: 'EG', scoreA: 2, scoreB: 0, status: 'completed' },
        q4: { teamA: 'LEV', teamB: 'FUR', scoreA: 2, scoreB: 1, status: 'completed' },
        s1: { teamA: 'SEN', teamB: '100T', scoreA: 2, scoreB: 0, status: 'completed' },
        s2: { teamA: 'LOUD', teamB: 'LEV', scoreA: 1, scoreB: 2, status: 'completed' },
        final: { teamA: 'SEN', teamB: 'LEV', scoreA: 3, scoreB: 2, status: 'completed' }
    },
    'VCT Pacific': {
        q1: { teamA: 'PRX', teamB: 'T1', scoreA: 2, scoreB: 0, status: 'completed' },
        q2: { teamA: 'DRX', teamB: 'GEN', scoreA: 1, scoreB: 2, status: 'completed' },
        q3: { teamA: 'GE', teamB: 'ZETA', scoreA: 0, scoreB: 2, status: 'completed' },
        q4: { teamA: 'DFM', teamB: 'RRQ', scoreA: 0, scoreB: 2, status: 'completed' },
        s1: { teamA: 'PRX', teamB: 'GEN', scoreA: 2, scoreB: 1, status: 'completed' },
        s2: { teamA: 'ZETA', teamB: 'RRQ', scoreA: 1, scoreB: 2, status: 'completed' },
        final: { teamA: 'PRX', teamB: 'RRQ', scoreA: 3, scoreB: 1, status: 'completed' }
    },
    'VCT EMEA': {
        q1: { teamA: 'FNC', teamB: 'NAVI', scoreA: 2, scoreB: 1, status: 'completed' },
        q2: { teamA: 'TH', teamB: 'BBL', scoreA: 2, scoreB: 0, status: 'completed' },
        q3: { teamA: 'TL', teamB: 'KOI', scoreA: 1, scoreB: 2, status: 'completed' },
        q4: { teamA: 'GX', teamB: 'FUT', scoreA: 0, scoreB: 2, status: 'completed' },
        s1: { teamA: 'FNC', teamB: 'TH', scoreA: 2, scoreB: 1, status: 'completed' },
        s2: { teamA: 'KOI', teamB: 'FUT', scoreA: 0, scoreB: 2, status: 'completed' },
        final: { teamA: 'FNC', teamB: 'FUT', scoreA: 3, scoreB: 0, status: 'completed' }
    },
    'VCT China': {
        q1: { teamA: 'EDG', teamB: 'TE', scoreA: 2, scoreB: 0, status: 'completed' },
        q2: { teamA: 'BLG', teamB: 'FPX', scoreA: 2, scoreB: 1, status: 'completed' },
        q3: { teamA: 'WOL', teamB: 'JDG', scoreA: 0, scoreB: 2, status: 'completed' },
        q4: { teamA: 'NOVA', teamB: 'AG', scoreA: 1, scoreB: 2, status: 'completed' },
        s1: { teamA: 'EDG', teamB: 'BLG', scoreA: 2, scoreB: 0, status: 'completed' },
        s2: { teamA: 'JDG', teamB: 'AG', scoreA: 2, scoreB: 1, status: 'completed' },
        final: { teamA: 'EDG', teamB: 'JDG', scoreA: 3, scoreB: 1, status: 'completed' }
    },
    'Masters': {
        q1: { teamA: 'SEN', teamB: 'FNC', scoreA: 2, scoreB: 1, status: 'completed' },
        q2: { teamA: 'PRX', teamB: 'EDG', scoreA: 2, scoreB: 0, status: 'completed' },
        q3: { teamA: 'GEN', teamB: 'TH', scoreA: 1, scoreB: 2, status: 'completed' },
        q4: { teamA: 'LEV', teamB: 'FPX', scoreA: 2, scoreB: 0, status: 'completed' },
        s1: { teamA: 'SEN', teamB: 'PRX', scoreA: 2, scoreB: 1, status: 'completed' },
        s2: { teamA: 'TH', teamB: 'LEV', scoreA: 2, scoreB: 0, status: 'completed' },
        final: { teamA: 'SEN', teamB: 'TH', scoreA: 3, scoreB: 2, status: 'completed' }
    },
    'Champions': {
        q1: { teamA: 'SEN', teamB: 'PRX', scoreA: 2, scoreB: 1, status: 'completed' },
        q2: { teamA: 'FNC', teamB: 'GEN', scoreA: 2, scoreB: 0, status: 'completed' },
        q3: { teamA: 'EDG', teamB: 'LEV', scoreA: 1, scoreB: 2, status: 'completed' },
        q4: { teamA: 'TH', teamB: 'DRX', scoreA: 2, scoreB: 0, status: 'completed' },
        s1: { teamA: 'SEN', teamB: 'FNC', scoreA: 2, scoreB: 0, status: 'completed' },
        s2: { teamA: 'LEV', teamB: 'TH', scoreA: 1, scoreB: 2, status: 'completed' },
        final: { teamA: 'SEN', teamB: 'TH', scoreA: 3, scoreB: 1, status: 'completed' }
    }
};

function switchKnockoutsRegion(regionVal, btn) {
    VCT_DB.activeKnockoutsRegion = regionVal;
    
    // Toggle active class
    const tabs = btn.parentElement.querySelectorAll('.sec-tab');
    tabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    renderKnockouts();
}

function renderKnockouts() {
    const container = document.getElementById('bracket-visualization');
    if (!container) return;

    const region = VCT_DB.activeKnockoutsRegion;
    const b = MOCK_BRACKETS[region] || MOCK_BRACKETS['VCT Americas'];
    const rClass = getRegionClass(region);

    const renderSlot = (matchNode) => {
        if (!matchNode) return `
            <div class="bracket-match-card">
                <div class="bracket-row tbd">TBD</div>
                <div class="bracket-row tbd">TBD</div>
            </div>`;
            
        const teamA = VCT_DB.teams[matchNode.teamA] || { name: matchNode.teamA || 'TBD', color: '#ffffff' };
        const teamB = VCT_DB.teams[matchNode.teamB] || { name: matchNode.teamB || 'TBD', color: '#ffffff' };
        
        const isAWinner = matchNode.status === 'completed' && matchNode.scoreA > matchNode.scoreB;
        const isBWinner = matchNode.status === 'completed' && matchNode.scoreB > matchNode.scoreA;

        return `
            <div class="bracket-match-card">
                <div class="bracket-row ${isAWinner ? 'winner' : (isBWinner ? 'loser' : '')}">
                    <div class="team-info">
                        ${matchNode.teamA ? getTeamLogo(matchNode.teamA, 16, teamA.color) : ''}
                        <span style="color: ${teamA.color}">${matchNode.teamA || 'TBD'}</span>
                    </div>
                    <span class="score">${matchNode.scoreA !== null ? matchNode.scoreA : '-'}</span>
                </div>
                <div class="bracket-row ${isBWinner ? 'winner' : (isAWinner ? 'loser' : '')}">
                    <div class="team-info">
                        ${matchNode.teamB ? getTeamLogo(matchNode.teamB, 16, teamB.color) : ''}
                        <span style="color: ${teamB.color}">${matchNode.teamB || 'TBD'}</span>
                    </div>
                    <span class="score">${matchNode.scoreB !== null ? matchNode.scoreB : '-'}</span>
                </div>
            </div>
        `;
    };

    container.innerHTML = `
        <!-- Column 1: Quarterfinals -->
        <div class="bracket-col">
            <div class="bracket-col-title">QUARTERFINALS</div>
            <div class="bracket-matches-list">
                ${renderSlot(b.q1)}
                ${renderSlot(b.q2)}
                ${renderSlot(b.q3)}
                ${renderSlot(b.q4)}
            </div>
        </div>

        <!-- Column 2: Semifinals -->
        <div class="bracket-col">
            <div class="bracket-col-title">SEMIFINALS</div>
            <div class="bracket-matches-list">
                ${renderSlot(b.s1)}
                ${renderSlot(b.s2)}
            </div>
        </div>

        <!-- Column 3: Trophy -->
        <div class="trophy-col ${rClass}">
            <div class="trophy-icon">🏆</div>
            <div class="trophy-shadow"></div>
        </div>

        <!-- Column 4: Finals -->
        <div class="bracket-col">
            <div class="bracket-col-title">FINALS</div>
            <div class="bracket-matches-list">
                ${renderSlot(b.final)}
            </div>
        </div>
    `;
}

// --- PAGE 4: SCHEDULE PAGE RENDERING ---
function renderSchedule() {
    const container = document.getElementById('schedule-container');
    if (!container) return;

    const upcoming = VCT_DB.matches.filter(m => m.status === 'upcoming');

    if (upcoming.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="calendar" style="width: 48px; height: 48px;"></i>
                <div class="empty-title">AWAITING LIVE DATA</div>
                <div class="empty-msg">No scheduled matches - Awaiting Live Data</div>
            </div>
        `;
        return;
    }

    // Group by Date
    const grouped = {};
    upcoming.forEach(m => {
        const dateStr = getGroupDateString(m.time);
        if (!grouped[dateStr]) grouped[dateStr] = [];
        grouped[dateStr].push(m);
    });

    container.innerHTML = Object.entries(grouped).map(([date, matches]) => {
        return `
            <div class="schedule-group">
                <h3 class="schedule-date">${date.toUpperCase()}</h3>
                ${matches.map(m => {
                    const teamA = VCT_DB.teams[m.teamA] || { name: m.teamA, color: '#ffffff' };
                    const teamB = VCT_DB.teams[m.teamB] || { name: m.teamB, color: '#ffffff' };
                    const rClass = getRegionClass(m.league);
                    return `
                        <div class="schedule-row" onclick="openPredictionModal('${m.id}')">
                            <span class="schedule-time">${getISTTime(m.time)}</span>
                            <div class="schedule-matchup">
                                <div class="schedule-team">
                                    ${getTeamLogo(m.teamA, 20, teamA.color)}
                                    <span style="color: ${teamA.color}">${m.teamA}</span>
                                </div>
                                <span class="schedule-vs">VS</span>
                                <div class="schedule-team">
                                    ${getTeamLogo(m.teamB, 20, teamB.color)}
                                    <span style="color: ${teamB.color}">${m.teamB}</span>
                                </div>
                            </div>
                            <span class="schedule-tournament">${m.league.toUpperCase()}</span>
                            <span class="schedule-format">BO3</span>
                            <span class="region-badge ${rClass}">${m.league}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

// --- PAGE 5: RESULTS PAGE RENDERING ---
function renderResults() {
    const container = document.getElementById('results-container');
    if (!container) return;

    // Load completed matches from matches response
    let completed = VCT_DB.matches.filter(m => m.status === 'completed');

    // If matches.json only has upcoming, fallback to mock completed matches
    if (completed.length === 0) {
        completed = [
            { id: 'hist_mock_1', league: 'VCT Americas', teamA: 'SEN', teamB: 'G2', scoreA: 2, scoreB: 1, status: 'completed', time: '2026-07-01T18:00:00Z', predictedWinner: 'SEN', actualWinner: 'SEN' },
            { id: 'hist_mock_2', league: 'VCT China', teamA: 'EDG', teamB: 'FPX', scoreA: 2, scoreB: 0, status: 'completed', time: '2026-07-01T15:00:00Z', predictedWinner: 'EDG', actualWinner: 'EDG' },
            { id: 'hist_mock_3', league: 'VCT EMEA', teamA: 'FNC', teamB: 'TH', scoreA: 1, scoreB: 2, status: 'completed', time: '2026-06-30T19:00:00Z', predictedWinner: 'FNC', actualWinner: 'TH' },
            { id: 'hist_mock_4', league: 'VCT Pacific', teamA: 'GEN', teamB: 'PRX', scoreA: 2, scoreB: 3, status: 'completed', time: '2026-06-29T16:00:00Z', predictedWinner: 'PRX', actualWinner: 'PRX' },
            { id: 'hist_mock_5', league: 'VCT Americas', teamA: 'LEV', teamB: 'LOUD', scoreA: 2, scoreB: 0, status: 'completed', time: '2026-06-28T18:00:00Z', predictedWinner: 'LEV', actualWinner: 'LEV' },
            { id: 'hist_mock_6', league: 'VCT Americas', teamA: '100T', teamB: 'NRG', scoreA: 2, scoreB: 1, status: 'completed', time: '2026-06-27T20:00:00Z', predictedWinner: '100T', actualWinner: '100T' },
            { id: 'hist_mock_7', league: 'VCT Pacific', teamA: 'DRX', teamB: 'T1', scoreA: 2, scoreB: 0, status: 'completed', time: '2026-06-26T14:00:00Z', predictedWinner: 'DRX', actualWinner: 'DRX' },
            { id: 'hist_mock_8', league: 'VCT EMEA', teamA: 'KC', teamB: 'VIT', scoreA: 1, scoreB: 2, status: 'completed', time: '2026-06-25T17:00:00Z', predictedWinner: 'KC', actualWinner: 'VIT' }
        ];
    }

    // Sort: most recent first
    completed.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Group by Date
    const grouped = {};
    completed.forEach(m => {
        const dateStr = getGroupDateString(m.time);
        if (!grouped[dateStr]) grouped[dateStr] = [];
        grouped[dateStr].push(m);
    });

    container.innerHTML = Object.entries(grouped).map(([date, matches]) => {
        return `
            <div class="schedule-group">
                <h3 class="schedule-date">${date.toUpperCase()}</h3>
                ${matches.map(m => {
                    const teamA = VCT_DB.teams[m.teamA] || { name: m.teamA, color: '#ffffff' };
                    const teamB = VCT_DB.teams[m.teamB] || { name: m.teamB, color: '#ffffff' };
                    const rClass = getRegionClass(m.league);
                    
                    const scoreA = m.scoreA !== null ? m.scoreA : 0;
                    const scoreB = m.scoreB !== null ? m.scoreB : 0;
                    const winnerTag = scoreA > scoreB ? m.teamA : m.teamB;

                    const predStatus = getPredictionStatus(m);
                    const correctnessIcon = predStatus === 'correct' ? '✅' : '❌';

                    return `
                        <div class="schedule-row" style="cursor: default;">
                            <span class="schedule-time">${getISTTime(m.time)}</span>
                            <div class="schedule-matchup">
                                <div class="schedule-team ${winnerTag === m.teamA ? 'winner' : ''}">
                                    ${getTeamLogo(m.teamA, 20, teamA.color)}
                                    <span style="color: ${teamA.color}; font-weight: ${winnerTag === m.teamA ? '700' : '500'};">${m.teamA}</span>
                                </div>
                                <span class="schedule-vs">VS</span>
                                <div class="schedule-team ${winnerTag === m.teamB ? 'winner' : ''}">
                                    ${getTeamLogo(m.teamB, 20, teamB.color)}
                                    <span style="color: ${teamB.color}; font-weight: ${winnerTag === m.teamB ? '700' : '500'};">${m.teamB}</span>
                                </div>
                            </div>
                            <div class="result-scores">
                                <span class="${winnerTag === m.teamA ? 'winner' : ''}">${scoreA}</span>
                                <span>-</span>
                                <span class="${winnerTag === m.teamB ? 'winner' : ''}">${scoreB}</span>
                            </div>
                            <span class="schedule-tournament">${m.league.toUpperCase()}</span>
                            <span class="region-badge ${rClass}" style="margin-right: 16px;">${m.league}</span>
                            <div class="ai-status-badge ${predStatus}" title="AI Prediction correctness">
                                ${correctnessIcon}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

function getPredictionStatus(match) {
    // 1. Search predictions history by matchId
    const hist = VCT_DB.predictionsHistory.find(h => h.matchId === match.id);
    if (hist && hist.actualWinner) {
        return hist.predictedWinner === hist.actualWinner ? 'correct' : 'incorrect';
    }

    // 2. Fallback to inline or mock prediction matching
    const scoreA = match.scoreA !== null ? match.scoreA : 0;
    const scoreB = match.scoreB !== null ? match.scoreB : 0;
    const actual = scoreA > scoreB ? match.teamA : match.teamB;

    const predicted = match.predictedWinner || (match.prediction ? match.prediction.winnerTag : null);
    if (predicted) {
        return predicted === actual ? 'correct' : 'incorrect';
    }

    // Default simulation correctness fallback
    return 'correct';
}

// --- UTILITY FORMATTERS ---
function getGroupDateString(timeStr) {
    if (!timeStr || timeStr === 'Awaiting Live Data') return 'TBD - Awaiting Live Data';
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return timeStr;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const matchDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diff = Math.round((matchDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let prefix = '';
    if (diff === 0) prefix = 'TODAY - ';
    else if (diff === 1) prefix = 'TOMORROW - ';
    else if (diff === -1) prefix = 'YESTERDAY - ';

    return `${prefix}${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function getISTTime(timeStr) {
    if (!timeStr || timeStr === 'Awaiting Live Data') return 'TBD';
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return timeStr;

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm} IST`;
}

function formatMatchTime(timeStr) {
    if (!timeStr || timeStr === 'Awaiting Live Data') return 'Awaiting Live Data';
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return timeStr;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const matchDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diff = Math.round((matchDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeFormatted = `${hours}:${minutes} ${ampm}`;

    if (diff === 0) return `Today • ${timeFormatted}`;
    if (diff === 1) return `Tomorrow • ${timeFormatted}`;
    if (diff === -1) return `Yesterday • ${timeFormatted}`;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()} • ${timeFormatted}`;
}

// --- MODAL CONTROLLERS ---
function openPredictionModal(matchId) {
    const match = VCT_DB.matches.find(m => m.id === matchId);
    if (!match) return;

    const modal = document.getElementById('prediction-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    const teamA = VCT_DB.teams[match.teamA] || { name: match.teamA, color: '#ffffff' };
    const teamB = VCT_DB.teams[match.teamB] || { name: match.teamB, color: '#ffffff' };

    const pred = match.prediction;
    let predHTML = '';

    if (pred) {
        predHTML = `
            <div style="text-align: center; margin-bottom: 24px;">
              <h3 style="font-size: 11px; letter-spacing: 2px; color: var(--color-text-dim); margin-bottom: 8px;">AI PREDICTIVE OUTCOME</h3>
              <div style="font-size: 24px; font-weight: 900; color: ${pred.winnerTag === match.teamA ? teamA.color : teamB.color}; font-family: 'Barlow Condensed', sans-serif;">
                ${pred.winner.toUpperCase()} TO WIN
              </div>
              <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px; font-family: 'Barlow Condensed'; font-weight: 700; letter-spacing: 1.5px;">
                CONFIDENCE: <span style="color: ${pred.confidence === 'High' ? 'var(--color-emea)' : (pred.confidence === 'Medium' ? 'var(--color-pacific)' : 'var(--color-americas)')};">${pred.confidence.toUpperCase()}</span>
              </div>
            </div>

            <div style="margin-bottom: 24px;">
              <h4 style="font-size: 10px; letter-spacing: 1.5px; color: var(--color-text-dim); margin-bottom: 8px; font-family: 'Barlow Condensed';">PROBABILITY DISTRIBUTION</h4>
              <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 6px; font-family: 'Barlow Condensed';">
                <span style="color: ${teamA.color}">${match.teamA}: ${pred.probA}%</span>
                <span style="color: ${teamB.color}">${match.teamB}: ${pred.probB}%</span>
              </div>
              <div style="width: 100%; height: 6px; background: var(--color-purple); border-radius: 3px; overflow: hidden; position: relative;">
                <div style="position: absolute; left: 0; top: 0; height: 100%; background: var(--color-primary); width: ${pred.probA}%;"></div>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="font-size: 10px; letter-spacing: 1.5px; color: var(--color-text-dim); margin-bottom: 8px; font-family: 'Barlow Condensed';">KEY FORECASTING FACTORS</h4>
              <ul style="list-style-type: none; padding: 0;">
                ${pred.factors.map(f => `
                  <li style="font-size: 13px; color: rgba(255,255,255,0.85); margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                    <span style="width: 6px; height: 6px; background: var(--color-primary); border-radius: 50%; flex-shrink: 0;"></span>
                    <span>${f}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
        `;
    } else {
        predHTML = `
            <div class="empty-state" style="border: none; padding: 20px 0;">
              <i data-lucide="cpu" style="width: 36px; height: 36px;"></i>
              <div class="empty-title" style="font-size: 14px;">AWAITING METRICS</div>
              <div class="empty-msg" style="font-size: 12px;">AI analysis is currently unavailable for this matchup. Sufficient VCT metrics are required.</div>
            </div>
        `;
    }

    content.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="font-size: 18px; font-weight: 900; letter-spacing: 2px; font-family: 'Barlow Condensed'; color: white;">MATCH ANALYTICS</h2>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-around; margin-bottom: 30px; background: rgba(255,255,255,0.02); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03);">
          <div style="text-align: center; width: 40%;">
            ${getTeamLogo(match.teamA, 48, teamA.color)}
            <div style="font-size: 16px; font-weight: 900; color: ${teamA.color}; font-family: 'Barlow Condensed'; margin-top: 8px;">${match.teamA}</div>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: var(--color-text-dim);">VS</div>
          <div style="text-align: center; width: 40%;">
            ${getTeamLogo(match.teamB, 48, teamB.color)}
            <div style="font-size: 16px; font-weight: 900; color: ${teamB.color}; font-family: 'Barlow Condensed'; margin-top: 8px;">${match.teamB}</div>
          </div>
        </div>
        ${predHTML}
    `;

    modal.classList.add('active');
    lucide.createIcons();
}

function closePredictionModal(event) {
    const modal = document.getElementById('prediction-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', async () => {
    // 1. Initial Load from backend API
    const loaded = await fetchDatabase();
    
    // 2. Setup SPA hash changes
    const handleRoute = () => {
        const hash = window.location.hash.substring(1) || 'home';
        switchTab(hash);
    };
    window.addEventListener('hashchange', handleRoute);
    
    // 3. Trigger initial route
    handleRoute();
});
