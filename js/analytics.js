// ================================
// CONFIG
// ================================
const STORAGE_KEY_USER = 'user';

// ================================
// INIT
// ================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js not loaded');
        return;
    }

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = '"Plus Jakarta Sans", sans-serif';
    Chart.defaults.scale.grid.color = 'rgba(255,255,255,0.05)';

    initAnalytics();
});

function initAnalytics() {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY_USER));
    if (!user || !user.email) {
        window.location.href = "login.html";
        return;
    }

    renderKPIs(user);
    renderCharts(user);
}

// ================================
// HELPERS
// ================================
function getUserKey(email, key) {
    return `fractionx_${email}_${key}`;
}

function toCr(amount) {
    return `₹${(amount / 1e7).toFixed(2)} Cr`;
}

function toLakh(amount) {
    return `₹${(amount / 1e5).toFixed(2)} L`;
}

// ================================
// KPI LOGIC (REAL DATA)
// ================================
function renderKPIs(user) {
    const balance = Number(localStorage.getItem(getUserKey(user.email, 'balance'))) || 0;
    const investments = JSON.parse(
        localStorage.getItem(getUserKey(user.email, 'investments'))
    ) || [];

    let totalInvested = 0;
    let volume24h = 0;
    const now = Date.now();

    investments.forEach(inv => {
        const amt = Number(inv.amount) || 0;
        totalInvested += amt;

        if (inv.date && now - new Date(inv.date).getTime() <= 86400000) {
            volume24h += amt;
        }
    });

    const profit = Math.floor(totalInvested * 0.125);
    const marketCap = balance + totalInvested + profit;

    replaceCardData("Total Market Cap", toCr(marketCap));
    replaceCardData("Active Investors", investments.length ? "1 (You)" : "0");
    replaceCardData("Volume (24h)", toLakh(volume24h));
}

// ================================
// CHARTS (REAL DATA)
// ================================
function renderCharts(user) {
    const investments = JSON.parse(
        localStorage.getItem(getUserKey(user.email, 'investments'))
    ) || [];

    // -------- Market Trend --------
    let runningTotal = 0;
    const trendLabels = ['Start'];
    const trendData = [0];

    investments
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(inv => {
            runningTotal += Number(inv.amount) || 0;
            trendLabels.push(
                new Date(inv.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                })
            );
            trendData.push(runningTotal);
        });

    renderTrendChart(trendLabels, trendData);

    // -------- Category Map --------
    const categoryMap = {
        'Real Estate': 0,
        'Vehicle': 0,
        'Luxury': 0,
        'Art': 0
    };

    investments.forEach(inv => {
        const amt = Number(inv.amount) || 0;
        const name = (inv.assetName || '').toLowerCase();

        if (name.match(/villa|estate|city|house/)) categoryMap['Real Estate'] += amt;
        else if (name.match(/car|tesla|ferrari|bmw/)) categoryMap['Vehicle'] += amt;
        else if (name.match(/rolex|watch|gold/)) categoryMap['Luxury'] += amt;
        else categoryMap['Art'] += amt;
    });

    
    renderCategoryChart(categoryMap);
    renderTopAssetsChart(investments);
    renderDemographicsChart(investments);

}

// ================================
// TREND CHART
// ================================
function renderTrendChart(labels, data) {
    const canvas = document.getElementById('marketTrendChart');
    if (!canvas) return;

    if (window.trendChart instanceof Chart) {
        window.trendChart.destroy();
    }

    const gradient = canvas
        .getContext('2d')
        .createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(99,102,241,0.4)');
    gradient.addColorStop(1, 'rgba(99,102,241,0)');

    window.trendChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels.length ? labels : ['Start', 'Today'],
            datasets: [{
                data: data.length ? data : [0, 0],
                borderColor: '#6366f1',
                backgroundColor: gradient,
                fill: true,
                tension: 0.35,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}

// ================================
// CATEGORY CHART
// ================================
function renderCategoryChart(map) {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;

    if (window.categoryChart instanceof Chart) {
        window.categoryChart.destroy();
    }

    const labels = Object.keys(map).filter(k => map[k] > 0);
    const values = Object.values(map).filter(v => v > 0);

    window.categoryChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: labels.length ? labels : ['No Assets'],
            datasets: [{
                data: values.length ? values : [1],
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: { legend: { position: 'right' } }
        }
    });
}

// ================================
// CARD TEXT REPLACER
// ================================
function replaceCardData(titleText, newValue) {
    const nodes = document.querySelectorAll('*');
    for (const el of nodes) {
        if (el.innerText?.trim() === titleText) {
            const valueEl =
                el.parentElement.querySelector('.value') ||
                el.parentElement.querySelector('h2') ||
                el.nextElementSibling;

            if (valueEl) valueEl.innerText = newValue;
            return;
        }
    }
}
function renderTopAssetsChart(investments) {
    const canvas = document.getElementById('topAssetsChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (window.topAssetsChart instanceof Chart) {
        window.topAssetsChart.destroy();
    }

    if (!investments.length) {
        // Empty state
        window.topAssetsChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ['No Data'],
                datasets: [{ data: [0], backgroundColor: '#1e293b' }]
            },
            options: { plugins: { legend: { display: false } } }
        });
        return;
    }

    // Top 5 by investment amount
    const top = [...investments]
        .sort((a, b) => (b.amount || 0) - (a.amount || 0))
        .slice(0, 5);

    window.topAssetsChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: top.map(a =>
                a.assetName.length > 12
                    ? a.assetName.slice(0, 12) + '…'
                    : a.assetName
            ),
            datasets: [{
                data: top.map(a => a.amount || 0),
                backgroundColor: '#6366f1',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}
function renderDemographicsChart(investments) {
    const canvas = document.getElementById('demographicsChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (window.demographicsChart instanceof Chart) {
        window.demographicsChart.destroy();
    }

    const demoMap = {
        Retail: 0,
        HNIs: 0,
        Institutions: 0,
        Corporates: 0
    };

    investments.forEach(inv => {
        const amt = Number(inv.amount) || 0;
        const name = (inv.assetName || '').toLowerCase();

        if (name.match(/car|tesla|ferrari/)) demoMap.Retail += amt;
        else if (name.match(/rolex|gold|watch/)) demoMap.HNIs += amt;
        else if (name.match(/estate|villa|city/)) demoMap.Institutions += amt;
        else demoMap.Corporates += amt;
    });

    const labels = Object.keys(demoMap).filter(k => demoMap[k] > 0);
    const values = Object.values(demoMap).filter(v => v > 0);

    window.demographicsChart = new Chart(canvas, {
        type: 'polarArea',
        data: {
            labels: labels.length ? labels : ['No Data'],
            datasets: [{
                data: values.length ? values : [1],
                backgroundColor: [
                    'rgba(99,102,241,0.7)',
                    'rgba(16,185,129,0.7)',
                    'rgba(236,72,153,0.7)',
                    'rgba(245,158,11,0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' } },
            scales: {
                r: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { display: false }
                }
            }
        }
    });
}
