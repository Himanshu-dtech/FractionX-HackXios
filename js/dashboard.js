// ================================
// CONFIG
// ================================
const STORAGE_KEYS = {
  USER: 'user'
};

// ================================
// UTILS
// ================================
const $ = (id) => document.getElementById(id);

function getUserKey(email, key) {
  return `fractionx_${email}_${key}`;
}

const getFromStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const formatINR = (amount = 0) =>
  `₹${Number(amount).toLocaleString('en-IN')}`;

// ================================
// INIT
// ================================
document.addEventListener('DOMContentLoaded', initDashboard);

function initDashboard() {
  console.log('Dashboard Loaded');

  const user = getFromStorage(STORAGE_KEYS.USER, null);
  if (!isAuthenticated(user)) return redirectToLogin();

  const data = loadData(user);
  renderUser(user);
  renderStats(data);
  renderActivity(data.investments);
  renderChart(data);
}

// ================================
// AUTH
// ================================
function isAuthenticated(user) {
  return user && user.email;
}

function redirectToLogin() {
  window.location.href = 'login.html';
}

// ================================
// DATA (PER USER)
// ================================
function loadData(user) {
  const balanceKey = getUserKey(user.email, 'balance');
  const investmentsKey = getUserKey(user.email, 'investments');

  return {
    balance: Number(localStorage.getItem(balanceKey)) || 0,
    investments: getFromStorage(investmentsKey, [])
  };
}

// ================================
// RENDER FUNCTIONS
// ================================
function renderUser(user) {
  const firstName = user.name?.split(' ')[0] || 'User';

  $('dashUserName') && ($('dashUserName').innerText = firstName);
  $('navUserName') && ($('navUserName').innerText = user.name);
}

function renderStats({ balance, investments }) {
  $('dashBalance') && ($('dashBalance').innerText = formatINR(balance));
  $('totalAssetsCount') && ($('totalAssetsCount').innerText = investments.length);

  const totalInvested = investments.reduce(
    (sum, inv) => sum + (inv.amount || 0),
    0
  );

  const estimatedProfit = Math.floor(totalInvested * 0.125);
  $('dashProfit') && ($('dashProfit').innerText = `+${formatINR(estimatedProfit)}`);
}

function renderActivity(investments = []) {
  const container = $('dashActivityList');
  if (!container) return;

  if (investments.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-wallet"></i>
        <p>No investments yet.<br>Go to Marketplace to start!</p>
      </div>`;
    return;
  }

  const recent = [...investments]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  container.innerHTML = recent.map(renderActivityItem).join('');
}

function renderActivityItem(inv) {
  const initials = inv.assetName?.slice(0, 2).toUpperCase() || 'FX';
  const date = inv.date ? new Date(inv.date).toLocaleDateString() : 'Just now';

  return `
    <div class="activity-item">
      <div class="act-icon">${initials}</div>
      <div class="act-info">
        <h4>${inv.assetName || 'Unknown Asset'}</h4>
        <span>Bought on ${date}</span>
      </div>
      <div class="act-amount">
        <h4>${formatINR(inv.amount)}</h4>
        <span class="positive">+${inv.tokens || 1} Tokens</span>
      </div>
    </div>`;
}

// ================================
// CHART
// ================================
function renderChart({ balance, investments }) {
  const ctx = $('portfolioChart');
  if (!ctx || typeof Chart === 'undefined') return;

  if (window.portfolioChart instanceof Chart) {
    window.portfolioChart.destroy();
  }

  const { labels, values } = buildPortfolioSeries(balance, investments);

  window.portfolioChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: values,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.15)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}

function buildPortfolioSeries(initialBalance, investments = []) {
  let netWorth = initialBalance || 0;

  const labels = ['Start'];
  const values = [netWorth];

  investments
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach(inv => {
      netWorth = netWorth - inv.amount + inv.amount * 1.125;
      labels.push(new Date(inv.date).toLocaleDateString());
      values.push(Math.round(netWorth));
    });

  return { labels, values };
}
