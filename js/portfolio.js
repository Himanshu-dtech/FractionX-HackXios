// ================================
// USER HELPERS
// ================================
function getUserKey(email, key) {
    return `fractionx_${email}_${key}`;
}

// ================================
// INIT
// ================================
document.addEventListener('DOMContentLoaded', loadPortfolio);

async function loadPortfolio() {

    // --- 1. AUTH CHECK ---
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
        window.location.href = "login.html";
        return;
    }

    // --- DOM ELEMENTS ---
    const listContainer = document.getElementById('portfolioList');
    const netWorthEl = document.getElementById('totalNetWorth');
    const chartCanvas = document.getElementById('allocationChart');
    const navName = document.getElementById('navUserName');
    const avatarEls = document.querySelectorAll('.avatar-circle');

    // --- 2. PER-USER STORAGE KEYS ---
    const balanceKey = getUserKey(user.email, 'balance');
    const investmentsKey = getUserKey(user.email, 'investments');

    const investments = JSON.parse(localStorage.getItem(investmentsKey)) || [];
    const walletBalance = Number(localStorage.getItem(balanceKey)) || 0;

    // --- HEADER UI ---
    if (user.name) {
        navName && (navName.innerText = user.name);
        avatarEls.forEach(el => el.innerText = user.name.charAt(0).toUpperCase());
    }

    // --- 3. EMPTY STATE ---
    if (investments.length === 0) {
        if (listContainer) {
            listContainer.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center; padding:30px; color:var(--text-muted);">
                        No investments yet.
                        <a href="marketplace.html" style="color:#6366f1; font-weight:600;">Start Investing</a>
                    </td>
                </tr>`;
        }

        netWorthEl && (netWorthEl.innerText =
            "₹" + walletBalance.toLocaleString('en-IN'));

        chartCanvas && renderChart([], []);
        return;
    }

    // --- 4. CALCULATIONS ---
    let totalInvested = 0;
    let categoryMap = {
        'Vehicle': 0,
        'Real Estate': 0,
        'Luxury': 0,
        'Art': 0
    };

    let html = '';

    investments.slice().reverse().forEach(inv => {
        const principal = inv.amount || 0;
        totalInvested += principal;

        let category = 'Art';
        const name = inv.assetName.toLowerCase();

        if (/ferrari|tesla|bmw|car|vehicle/.test(name)) category = 'Vehicle';
        else if (/villa|apartment|estate|city|house/.test(name)) category = 'Real Estate';
        else if (/rolex|watch|gold|diamond/.test(name)) category = 'Luxury';

        categoryMap[category] += principal;

        const dateStr = inv.date
            ? new Date(inv.date).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'short', day: 'numeric'
              })
            : 'Just now';

        const initials = inv.assetName.substring(0, 2).toUpperCase();

        html += `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:15px;">
                    <div style="display:flex;gap:12px;align-items:center;">
                        <div style="width:35px;height:35px;border-radius:10px;
                            background:rgba(99,102,241,.1);
                            color:#6366f1;
                            display:flex;align-items:center;justify-content:center;
                            font-weight:700;font-size:.8rem;">
                            ${initials}
                        </div>
                        <div>
                            <div style="font-weight:600;color:var(--text-main)">
                                ${inv.assetName}
                            </div>
                            <div style="font-size:.75rem;color:var(--text-muted)">
                                ${dateStr}
                            </div>
                        </div>
                    </div>
                </td>
                <td style="padding:15px;">${inv.tokens}</td>
                <td style="padding:15px;font-weight:600;">
                    ₹${principal.toLocaleString('en-IN')}
                </td>
                <td style="padding:15px;text-align:right;">
                    <span style="background:rgba(16,185,129,.1);
                        color:#10b981;
                        padding:4px 10px;
                        border-radius:20px;
                        font-size:.75rem;
                        font-weight:700;">
                        +12.5%
                    </span>
                </td>
            </tr>
        `;
    });

    listContainer && (listContainer.innerHTML = html);

    // --- 5. NET WORTH ---
    const profit = Math.floor(totalInvested * 0.125);
    const totalNetWorth = walletBalance + profit;

    netWorthEl && (netWorthEl.innerText =
        "₹" + totalNetWorth.toLocaleString('en-IN'));

    // --- 6. CHART ---
    const chartLabels = Object.keys(categoryMap).filter(k => categoryMap[k] > 0);
    const chartData = Object.values(categoryMap).filter(v => v > 0);

    chartCanvas && renderChart(chartLabels, chartData);
}

// ================================
// CHART
// ================================
function renderChart(labels, data) {
    const ctx = document.getElementById('allocationChart');
    if (!ctx) return;

    if (window.portfolioChartInstance) {
        window.portfolioChartInstance.destroy();
    }

    window.portfolioChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    '#6366f1',
                    '#10b981',
                    '#f59e0b',
                    '#ec4899'
                ],
                borderWidth: 0,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#94a3b8',
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}
