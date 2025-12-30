// ================================
// USER HELPERS
// ================================
const STORAGE_KEY_USER = 'user';

function getUserKey(email, key) {
    return `fractionx_${email}_${key}`;
}

// ================================
// INIT
// ================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Profile Page Initialized");
    loadProfile();
});

// ================================
// LOAD PROFILE
// ================================
window.loadProfile = function () {

    // --- AUTH CHECK ---
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY_USER));
    if (!user || !user.email) {
        window.location.href = 'login.html';
        return;
    }

    // --- PER-USER BALANCE ---
    const balanceKey = getUserKey(user.email, 'balance');
    const balance = Number(localStorage.getItem(balanceKey)) || 0;

    // --- HEADER ---
    safeSetText('navUserName', user.name);
    safeSetText('profileInitials', user.name.charAt(0).toUpperCase());
    safeSetText('profileNameDisplay', user.name);
    safeSetText('profileEmailDisplay', user.email);

    // --- CREDIT CARD ---
    safeSetText('cardBalance', `₹${balance.toLocaleString('en-IN')}`);
    safeSetText('cardHolder', user.name.toUpperCase());

    // --- FORM FIELDS ---
    safeSetValue('inputName', user.name);
    safeSetValue('inputEmail', user.email);
    safeSetValue('inputPhone', user.phone || '');
    safeSetValue('inputLocation', user.location || '');
    safeSetValue('inputBio', user.bio || '');
};

// ================================
// ADD FUNDS
// ================================
window.openDepositModal = function () {
    const modal = document.getElementById('depositModal');
    modal && (modal.style.display = 'flex');
};

window.closeDepositModal = function () {
    const modal = document.getElementById('depositModal');
    if (modal) {
        modal.style.display = 'none';
        const input = document.getElementById('depositAmount');
        if (input) input.value = '';
    }
};

window.confirmDeposit = function () {

    const user = JSON.parse(localStorage.getItem(STORAGE_KEY_USER));
    if (!user || !user.email) return;

    const amountInput = document.getElementById('depositAmount');
    if (!amountInput) return;

    const amount = parseInt(amountInput.value);
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    const balanceKey = getUserKey(user.email, 'balance');
    const btn = document.querySelector('.confirm-btn');
    const originalText = btn?.innerText || 'Confirm';

    btn && (btn.innerText = "Processing...");
    btn && (btn.disabled = true);

    setTimeout(() => {
        let currentBalance = Number(localStorage.getItem(balanceKey)) || 0;
        currentBalance += amount;

        localStorage.setItem(balanceKey, currentBalance);

        loadProfile();
        closeDepositModal();

        btn && (btn.innerText = originalText);
        btn && (btn.disabled = false);

        alert(`✅ Successfully added ₹${amount.toLocaleString('en-IN')}!`);
    }, 1000);
};

// ================================
// SAVE PROFILE
// ================================
window.saveProfileData = function () {

    const user = JSON.parse(localStorage.getItem(STORAGE_KEY_USER));
    if (!user) return;

    const newName = document.getElementById('inputName').value;
    if (!newName) return alert("Name cannot be empty.");

    user.name = newName;
    user.phone = document.getElementById('inputPhone').value;
    user.location = document.getElementById('inputLocation').value;
    user.bio = document.getElementById('inputBio').value;

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));

    loadProfile();
    alert("✅ Profile Updated Successfully!");
};

// ================================
// HELPERS
// ================================
function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function safeSetValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

// ================================
// CLOSE MODAL ON OUTSIDE CLICK
// ================================
window.onclick = function (event) {
    const modal = document.getElementById('depositModal');
    if (event.target === modal) closeDepositModal();
};
