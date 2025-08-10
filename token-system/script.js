// Token System Core Data
class TokenSystem {
    constructor() {
        this.tokenName = "KuKu Coin";
        this.tokenSymbol = "K";
        this.creatorId = "admin";
        this.currentUser = null;
        this.storageKey = "kukuCoinData";
        
        // Load data from localStorage or initialize defaults
        this.loadFromStorage();
        this.init();
    }
    
    // Load data from localStorage
    loadFromStorage() {
        const savedData = localStorage.getItem(this.storageKey);
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.totalSupply = data.totalSupply || 1000000;
                this.balances = data.balances || {};
                this.transactions = data.transactions || [];
                
                // Ensure admin exists with initial balance if no data exists
                if (Object.keys(this.balances).length === 0) {
                    this.balances[this.creatorId] = this.totalSupply;
                }
            } catch (error) {
                console.error("Error loading data from storage:", error);
                this.initializeDefaults();
            }
        } else {
            this.initializeDefaults();
        }
    }
    
    // Initialize default values
    initializeDefaults() {
        this.totalSupply = 1000000; // Initial supply of 1 million tokens
        this.balances = {
            [this.creatorId]: this.totalSupply
        };
        this.transactions = [];
        this.saveToStorage();
    }
    
    // Save data to localStorage
    saveToStorage() {
        const dataToSave = {
            totalSupply: this.totalSupply,
            balances: this.balances,
            transactions: this.transactions,
            lastUpdated: new Date().toISOString()
        };
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Error saving data to storage:", error);
        }
    }
    
    init() {
        this.updateTotalSupplyDisplay();
        this.addTransaction("system", "Initial token distribution", this.totalSupply, this.creatorId);
    }
    
    // Check if user exists, create if not
    ensureUserExists(userId) {
        if (!this.balances.hasOwnProperty(userId)) {
            this.balances[userId] = 0;
            this.saveToStorage(); // Save when new user is created
        }
    }
    
    // Get balance for a user
    getBalance(userId) {
        this.ensureUserExists(userId);
        return this.balances[userId];
    }
    
    // Transfer tokens between users
    transfer(fromId, toId, amount) {
        if (amount <= 0) {
            return { success: false, message: "Amount must be greater than 0" };
        }
        
        this.ensureUserExists(fromId);
        this.ensureUserExists(toId);
        
        if (this.balances[fromId] < amount) {
            return { success: false, message: "Not enough tokens!" };
        }
        
        this.balances[fromId] -= amount;
        this.balances[toId] += amount;
        
        this.addTransaction("transfer", `${fromId} → ${toId}`, amount, toId);
        this.saveToStorage(); // Save after transfer
        
        return { success: true, message: `Transfer successful! Sent ${amount} <span class="bitcoin-k medium-k">K</span> to ${toId}` };
    }
    
    // Mint new tokens (admin only)
    mint(toId, amount) {
        if (amount <= 0) {
            return { success: false, message: "Amount must be greater than 0" };
        }
        
        this.ensureUserExists(toId);
        
        this.balances[toId] += amount;
        this.totalSupply += amount;
        
        this.addTransaction("mint", `Minted to ${toId}`, amount, toId);
        this.updateTotalSupplyDisplay();
        this.saveToStorage(); // Save after minting
        
        return { success: true, message: `Minted ${amount} <span class="bitcoin-k medium-k">K</span> tokens to ${toId}` };
    }
    
    // Add transaction to history
    addTransaction(type, description, amount, recipient) {
        const transaction = {
            type,
            description,
            amount,
            recipient,
            timestamp: new Date().toLocaleString()
        };
        
        this.transactions.unshift(transaction); // Add to beginning
        
        // Keep only last 20 transactions for better history
        if (this.transactions.length > 20) {
            this.transactions = this.transactions.slice(0, 20);
        }
        
        this.updateTransactionHistory();
        // Note: saveToStorage() is called by the operation that adds the transaction
    }
    
    // Update total supply display
    updateTotalSupplyDisplay() {
        document.getElementById('totalSupply').textContent = this.totalSupply.toLocaleString();
    }
    
    // Update last saved timestamp
    updateLastSavedDisplay() {
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.lastUpdated) {
                    const lastSaved = new Date(data.lastUpdated).toLocaleString();
                    const lastSavedElement = document.getElementById('lastSaved');
                    if (lastSavedElement) {
                        lastSavedElement.textContent = lastSaved;
                    }
                }
            } catch (error) {
                console.error("Error reading last saved time:", error);
            }
        }
    }
    
    // Update transaction history display
    updateTransactionHistory() {
        const historyContainer = document.getElementById('transactionHistory');
        
        if (this.transactions.length === 0) {
            historyContainer.innerHTML = '<p class="info">No transactions yet</p>';
            return;
        }
        
        historyContainer.innerHTML = this.transactions.map(tx => `
            <div class="transaction-item ${tx.type}">
                <strong>${tx.description}</strong><br>
                <span>Amount: ${tx.amount.toLocaleString()} <span class="bitcoin-k small-k">K</span></span><br>
                <small>${tx.timestamp}</small>
            </div>
        `).join('');
    }
}

// Initialize the token system
const tokenSystem = new TokenSystem();

// UI Functions
function login() {
    const userId = document.getElementById('userIdInput').value.trim();
    
    if (!userId) {
        alert('Please enter a User ID');
        return;
    }
    
    tokenSystem.currentUser = userId;
    tokenSystem.ensureUserExists(userId);
    
    // Show dashboard, hide login
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    // Update user info
    document.getElementById('currentUser').textContent = userId;
    updateUserBalance();
    
    // Show mint section for all users
    document.getElementById('mintSection').classList.remove('hidden');
    
    // Update transaction history
    tokenSystem.updateTransactionHistory();
    
    // Update last saved display
    tokenSystem.updateLastSavedDisplay();
    
    // Clear login input
    document.getElementById('userIdInput').value = '';
}

function logout() {
    tokenSystem.currentUser = null;
    
    // Hide dashboard, show login
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
    
    // Clear all result messages
    clearAllResults();
}

function updateUserBalance() {
    if (tokenSystem.currentUser) {
        const balance = tokenSystem.getBalance(tokenSystem.currentUser);
        document.getElementById('userBalance').textContent = balance.toLocaleString();
    }
}

function checkBalance() {
    const userId = document.getElementById('checkBalanceInput').value.trim();
    const resultDiv = document.getElementById('balanceResult');
    
    if (!userId) {
        showResult(resultDiv, 'Please enter a User ID', 'error');
        return;
    }
    
    const balance = tokenSystem.getBalance(userId);
    showResult(resultDiv, `${userId}'s balance: ${balance.toLocaleString()} <span class="bitcoin-k medium-k">K</span>`, 'info');
    
    // Clear input
    document.getElementById('checkBalanceInput').value = '';
}

function transferTokens() {
    const toId = document.getElementById('transferToInput').value.trim();
    const amount = parseInt(document.getElementById('transferAmountInput').value);
    const resultDiv = document.getElementById('transferResult');
    
    if (!toId) {
        showResult(resultDiv, 'Please enter receiver\'s User ID', 'error');
        return;
    }
    
    if (!amount || amount <= 0) {
        showResult(resultDiv, 'Please enter a valid amount', 'error');
        return;
    }
    
    if (toId === tokenSystem.currentUser) {
        showResult(resultDiv, 'Cannot transfer to yourself', 'error');
        return;
    }
    
    const result = tokenSystem.transfer(tokenSystem.currentUser, toId, amount);
    
    if (result.success) {
        showResult(resultDiv, result.message, 'success');
        updateUserBalance();
        
        // Clear inputs
        document.getElementById('transferToInput').value = '';
        document.getElementById('transferAmountInput').value = '';
    } else {
        showResult(resultDiv, result.message, 'error');
    }
}

function mintTokens() {
    const toId = document.getElementById('mintToInput').value.trim();
    const amount = parseInt(document.getElementById('mintAmountInput').value);
    const resultDiv = document.getElementById('mintResult');
    
    if (!toId) {
        showResult(resultDiv, 'Please enter recipient\'s User ID', 'error');
        return;
    }
    
    if (!amount || amount <= 0) {
        showResult(resultDiv, 'Please enter a valid amount', 'error');
        return;
    }
    
    const result = tokenSystem.mint(toId, amount);
    
    if (result.success) {
        showResult(resultDiv, result.message, 'success');
        updateUserBalance(); // Update admin's balance display if needed
        
        // Clear inputs
        document.getElementById('mintToInput').value = '';
        document.getElementById('mintAmountInput').value = '';
    } else {
        showResult(resultDiv, result.message, 'error');
    }
}

function showResult(element, message, type) {
    element.textContent = message;
    element.className = `result ${type}`;
    
    // Auto-clear success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            element.textContent = '';
            element.className = 'result';
        }, 5000);
    }
}

function clearAllResults() {
    const results = document.querySelectorAll('.result');
    results.forEach(result => {
        result.textContent = '';
        result.className = 'result';
    });
    
    // Clear all input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
}

// Data Management Functions
function exportData() {
    try {
        const data = {
            tokenName: tokenSystem.tokenName,
            tokenSymbol: tokenSystem.tokenSymbol,
            totalSupply: tokenSystem.totalSupply,
            balances: tokenSystem.balances,
            transactions: tokenSystem.transactions,
            exportDate: new Date().toISOString(),
            version: "1.0"
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `kukucoin-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        alert('✅ Data exported successfully!');
    } catch (error) {
        console.error('Export error:', error);
        alert('❌ Error exporting data');
    }
}

function importData() {
    document.getElementById('importFileInput').click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!importedData.balances || !importedData.transactions) {
                throw new Error('Invalid data format');
            }
            
            // Confirm import
            if (confirm('⚠️ This will replace all current data. Are you sure?')) {
                tokenSystem.totalSupply = importedData.totalSupply || 1000000;
                tokenSystem.balances = importedData.balances || {};
                tokenSystem.transactions = importedData.transactions || [];
                
                tokenSystem.saveToStorage();
                tokenSystem.updateTotalSupplyDisplay();
                tokenSystem.updateTransactionHistory();
                tokenSystem.updateLastSavedDisplay();
                
                if (tokenSystem.currentUser) {
                    updateUserBalance();
                }
                
                alert('✅ Data imported successfully!');
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('❌ Error importing data. Please check the file format.');
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

function clearAllData() {
    if (confirm('⚠️ This will delete ALL data including balances and transactions. This cannot be undone. Are you sure?')) {
        if (confirm('🚨 FINAL WARNING: All KuKu Coin data will be permanently deleted. Continue?')) {
            localStorage.removeItem(tokenSystem.storageKey);
            
            // Reinitialize system
            tokenSystem.initializeDefaults();
            tokenSystem.updateTotalSupplyDisplay();
            tokenSystem.updateTransactionHistory();
            tokenSystem.updateLastSavedDisplay();
            
            if (tokenSystem.currentUser) {
                updateUserBalance();
            }
            
            alert('✅ All data has been reset to defaults.');
        }
    }
}

// Initialize UI on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set focus on login input
    document.getElementById('userIdInput').focus();
    
    // Add enter key support for login
    document.getElementById('userIdInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
    
    // Add enter key support for other inputs
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            
            if (activeElement.id === 'checkBalanceInput') {
                checkBalance();
            } else if (activeElement.id === 'transferToInput' || activeElement.id === 'transferAmountInput') {
                transferTokens();
            } else if (activeElement.id === 'mintToInput' || activeElement.id === 'mintAmountInput') {
                mintTokens();
            }
        }
    });
});
