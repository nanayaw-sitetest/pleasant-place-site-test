let sermonArchive = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log("Sermon Script Initialized");
    initSermonArchive();
    setupModalListeners();
});

// --- LIGHTBOX MODAL HANDLERS ---
function setupModalListeners() {
    const modal = document.getElementById('videoModal');
    const closeBtn = document.querySelector('.close-modal');

    if (closeBtn) {
        closeBtn.onclick = () => closeSermonModal();
    }

    window.onclick = (event) => {
        if (event.target == modal) closeSermonModal();
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeSermonModal();
    });
}

function openSermonModal(videoUrl) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');

    if (!videoUrl || videoUrl === "#") return;

    let embedUrl = videoUrl;
    if (videoUrl.includes("watch?v=")) {
        embedUrl = videoUrl.replace("watch?v=", "embed/");
    } else if (videoUrl.includes("youtu.be/")) {
        embedUrl = videoUrl.replace("youtu.be/", "youtube.com/embed/");
    }

    player.src = `${embedUrl}?autoplay=1&rel=0`;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Dims background and stops scroll
}

function closeSermonModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    modal.style.display = 'none';
    player.src = ""; 
    document.body.style.overflow = 'auto';
}

// --- DATA & FILTERING ---
async function initSermonArchive() {
    const grid = document.getElementById('sermon-grid');
    const searchInput = document.getElementById('sermon-search');
    const searchBtn = document.getElementById('search-btn');

    try {
        const response = await fetch('data/sermons.json');
        const data = await response.json();
        sermonArchive = data.sermons;
        
        renderSermons(sermonArchive);

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                executeFilter(e.target.value);
            });
        }

        if (searchBtn) {
            searchBtn.onclick = (e) => {
                e.preventDefault();
                executeFilter(searchInput.value);
            };
        }

    } catch (e) {
        console.error("Archive Error:", e);
        if(grid) grid.innerHTML = "<p>Error loading sermons.</p>";
    }
}

function executeFilter(term) {
    const query = term.toLowerCase().trim();
    const filteredResults = sermonArchive.filter(sermon => {
        return (
            (sermon.title || "").toLowerCase().includes(query) ||
            (sermon.speaker || "").toLowerCase().includes(query) ||
            (sermon.topic || "").toLowerCase().includes(query) ||
            (sermon.series || "").toLowerCase().includes(query)
        );
    });
    renderSermons(filteredResults);
}

function renderSermons(list) {
    const grid = document.getElementById('sermon-grid');
    if (!grid) return;

    grid.innerHTML = list.map(sermon => `
        <div class="sermon-card">
            <div class="sermon-thumb" style="background-image: url('${sermon.thumbnail}')" onclick="openSermonModal('${sermon.videoUrl}')" style="cursor:pointer;">
                <div class="play-overlay"><div class="play-btn">▶</div></div>
            </div>
            <div class="sermon-content">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span class="gold-text" style="font-size: 0.7rem; font-weight: bold;">${sermon.date}</span>
                    <span style="background:var(--forest-green); color:white; font-size:0.6rem; padding:2px 8px; border-radius:10px;">${sermon.topic}</span>
                </div>
                <h4>${sermon.title}</h4>
                <p style="font-size:0.85rem; color:#666; margin-bottom:15px;">${sermon.summary}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top:1px solid #eee; padding-top:15px;">
                    <small style="font-weight: 700;">${sermon.speaker}</small>
                    <button onclick="openSermonModal('${sermon.videoUrl}')" class="gold-text" style="background:none; border:none; cursor:pointer; font-size: 0.75rem; font-weight: 800; text-decoration: none;">WATCH</button>
                </div>
            </div>
        </div>
    `).join('');
}