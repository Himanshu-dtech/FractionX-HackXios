console.log("🚀 Global Script Loaded");

// CHANGE THIS IF NEEDED (Use your 5000 or 5001 port)
const API_URL = "https://fractionx-hackxios.onrender.com";

document.addEventListener('DOMContentLoaded', async () => {
    
    // --- 1. HEADER USERNAME FIX ---
    await updateGlobalHeader();

    // --- 2. SIDEBAR TOGGLE LOGIC (UPDATED FOR MOBILE) ---
    setupSidebar();

    // --- 3. DARK MODE TOGGLE ---
    setupDarkMode();

    // --- 4. LOGOUT LOGIC (PRESERVED) ---
    const logoutLinks = document.querySelectorAll('.logout-link');
    
    if (logoutLinks.length === 0) {
        console.warn("⚠️ No logout links found in the DOM.");
    }

    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            console.log("🚪 Logout clicked");

            if(confirm("Are you sure you want to logout?")) {
                localStorage.removeItem('user');
                window.location.href = "login.html";
            }
        });
    });
});

// --- HELPER FUNCTIONS ---

async function updateGlobalHeader() {
    try {
        const localUser = JSON.parse(localStorage.getItem('user'));
        
        if (localUser && localUser.name) {
            updateUserUI(localUser);
        } else {
            // Fallback to Server Fetch
            const res = await fetch(`${API_BASE_URL}/user`);
            if (res.ok) {
                const user = await res.json();
                updateUserUI(user);
            }
        }
    } catch (err) { 
        console.error("User fetch error:", err); 
    }
}

function updateUserUI(user) {
    const navName = document.getElementById('navUserName');
    if (navName) navName.innerText = user.name;

    const avatars = document.querySelectorAll('.avatar-circle');
    avatars.forEach(el => el.innerText = user.name.charAt(0).toUpperCase());

    const dashName = document.getElementById('dashUserName');
    if (dashName) dashName.innerText = user.name.split(' ')[0];
}

function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content');
    
    // Check saved preference for Desktop Collapse
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if(isCollapsed && window.innerWidth > 900 && sidebar) {
        sidebar.classList.add('collapsed');
        if(mainContent) mainContent.style.marginLeft = '80px';
    }

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (window.innerWidth > 900) {
                // DESKTOP: Collapse Mode
                sidebar.classList.toggle('collapsed');
                const collapsed = sidebar.classList.contains('collapsed');
                if(mainContent) mainContent.style.marginLeft = collapsed ? '80px' : '260px';
                localStorage.setItem('sidebar-collapsed', collapsed);
            } else {
                // MOBILE: Slide Mode (Changed '.open' to '.active' to match CSS)
                sidebar.classList.toggle('active');
            }
        });

        // Mobile: Click outside to close
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 900 && sidebar.classList.contains('active')) { 
                if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }
}

function setupDarkMode() {
    const themeBtn = document.getElementById('themeToggle');
    const body = document.body;
    
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        updateThemeUI(true);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeUI(isLight);
        });
    }

    function updateThemeUI(isLight) {
        if (!themeBtn) return;
        themeBtn.innerHTML = isLight 
            ? `<i class="fas fa-moon"></i> <span class="link-text">Dark Mode</span>` 
            : `<i class="fas fa-sun"></i> <span class="link-text">Light Mode</span>`;
    }
}