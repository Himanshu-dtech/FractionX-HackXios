

// ================================
// USER HELPERS
// ================================
function getUserKey(email, key) {
    return `fractionx_${email}_${key}`;
}

// ================================
// MOCK DATA (Fallback)
// ================================
const MOCK_ASSETS = [
    { _id: '1', title: 'Ferrari SF90 Spider', category: 'Vehicle', price: 45000000, fractionPrice: 500, roi: 24.5, image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800', location: 'Milan, Italy' },
    { _id: '2', title: 'Cyber City Tech Park', category: 'Real Estate', price: 850000000, fractionPrice: 5000, roi: 12.8, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800', location: 'Gurgaon, India' },
    { _id: '3', title: 'Rolex Daytona', category: 'Luxury', price: 2500000, fractionPrice: 1000, roi: 18.2, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800', location: 'London, UK' }
];

// ================================
// GLOBAL STATE
// ================================
let allProperties = [];
let walletBalance = 0;
let currentUser = null;

// ================================
// INIT
// ================================
document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('user'));

    if (!currentUser || !currentUser.email) {
        window.location.href = "login.html";
        return;
    }

    loadUserWallet();
    updateAllBalances();
    loadMarketplace();
});

// ================================
// WALLET LOGIC
// ================================
function loadUserWallet() {
    const balanceKey = getUserKey(currentUser.email, 'balance');
    walletBalance = Number(localStorage.getItem(balanceKey)) || 0;
}

function updateAllBalances() {
    const balanceKey = getUserKey(currentUser.email, 'balance');
    walletBalance = Number(localStorage.getItem(balanceKey)) || 0;

    const cardDisplay = document.getElementById('card-balance-display');
    if (cardDisplay) cardDisplay.innerText = `₹${walletBalance.toLocaleString('en-IN')}`;

    const sidebarDisplay = document.getElementById('user-balance');
    if (sidebarDisplay) sidebarDisplay.innerText = `₹${walletBalance.toLocaleString('en-IN')}`;
}

// ================================
// MARKETPLACE
// ================================
// ================================
// MARKETPLACE LOAD LOGIC (Fixed)
// ================================
async function loadMarketplace() {
    const container = document.getElementById('assetsGrid');
    if (!container) return;

    container.innerHTML = '<p style="color:white;text-align:center;">Loading assets...</p>';

    // 1. Get Locally Tokenized Assets (The missing link!)
    // This reads the assets you created in the Tokenize page
    const localKey = getUserKey(currentUser.email, 'tokenized_assets');
    const localAssets = JSON.parse(localStorage.getItem(localKey)) || [];

    // 2. Get Backend/Mock Assets
    let backendAssets = [];
    try {
        const res = await fetch(`${API_URL}/properties`);
        if (!res.ok) throw new Error("Backend Offline");
        backendAssets = await res.json();
    } catch {
        console.warn("Backend offline -> Using MOCK DATA");
        backendAssets = MOCK_ASSETS;
    }

    // 3. Merge Them (Local first, so your new asset shows at top)
    allProperties = [...localAssets, ...backendAssets];

    renderGrid(allProperties);
}

function renderGrid(properties) {
    const container = document.getElementById('assetsGrid');
    container.innerHTML = '';

    properties.forEach(prop => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${prop.image}" alt="${prop.title}">
                <span class="badge-roi">ROI: ${prop.roi}%</span>
            </div>
            <div class="card-details">
                <h3>${prop.title}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${prop.location}</p>
                <div class="stats-row">
                    <div><small>Valuation</small><strong>₹${prop.price.toLocaleString('en-IN')}</strong></div>
                    <div><small>Token Price</small><strong>₹${prop.fractionPrice.toLocaleString('en-IN')}</strong></div>
                </div>
                <button class="invest-btn"
                    onclick="openModal('${prop._id}','${prop.title}',${prop.fractionPrice})">
                    Invest Now
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// ================================
// FILTER
// ================================
window.filterMarketplace = function(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (category === 'All') renderGrid(allProperties);
    else renderGrid(allProperties.filter(p => p.category === category));
};

// ================================
// INVEST MODAL
// ================================
const modal = document.getElementById('investModal');

window.openModal = function(id, title, price) {
    document.getElementById('modalAssetId').value = id;
    document.getElementById('modalAssetName').innerText = title;
    document.getElementById('modalTokenPrice').value = price;
    document.getElementById('investTokens').value = 1;
    calculateTotal();
    modal.style.display = 'flex';
};

window.closeModal = () => modal.style.display = 'none';

window.calculateTotal = function() {
    const tokens = document.getElementById('investTokens').value;
    const price = document.getElementById('modalTokenPrice').value;
    document.getElementById('totalPay').innerText =
        `₹${(tokens * price).toLocaleString('en-IN')}`;
};

// ================================
// CONFIRM INVESTMENT
// ================================
window.confirmInvestment = function() {
    const tokens = parseInt(document.getElementById('investTokens').value);
    const price = parseInt(document.getElementById('modalTokenPrice').value);
    const assetName = document.getElementById('modalAssetName').innerText;
    const assetId = document.getElementById('modalAssetId').value;

    const totalAmount = tokens * price;

    if (walletBalance < totalAmount) {
        alert("❌ Insufficient Balance");
        return;
    }

    const balanceKey = getUserKey(currentUser.email, 'balance');
    const investmentsKey = getUserKey(currentUser.email, 'investments');

    walletBalance -= totalAmount;
    localStorage.setItem(balanceKey, walletBalance);

    const investments =
        JSON.parse(localStorage.getItem(investmentsKey)) || [];

    investments.push({
        assetId,
        assetName,
        tokens,
        amount: totalAmount,
        date: new Date().toISOString()
    });

    localStorage.setItem(investmentsKey, JSON.stringify(investments));

    updateAllBalances();
    closeModal();

    alert(`🎉 Investment Successful!\nYou bought ${tokens} tokens of ${assetName}`);
};

// ================================
// ADD FUNDS
// ================================
window.processPayment = function() {
    const amount = parseInt(document.getElementById('fund-amount').value);
    if (!amount || amount <= 0) return alert("Invalid amount");

    const balanceKey = getUserKey(currentUser.email, 'balance');
    walletBalance += amount;
    localStorage.setItem(balanceKey, walletBalance);

    updateAllBalances();
    alert(`✅ Added ₹${amount.toLocaleString('en-IN')}`);
};
