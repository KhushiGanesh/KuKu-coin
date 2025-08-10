# KuKu Coin Token System

A comprehensive web-based token management system built with vanilla HTML, CSS, and JavaScript.

## Features

### ✅ Core Token Data
- **Total Supply Tracking**: Displays the total number of tokens in existence
- **User Balance Management**: Tracks individual user token balances
- **Unique User IDs**: Each user has a unique identifier
- **Admin/Creator System**: Special permissions for the token creator

### ✅ Token Information
- **Token Name**: KuKu Coin
- **Token Symbol**: K
- **Initial Supply**: 1,000,000 K tokens (all given to creator initially)

### ✅ Core Features

#### 🔍 Balance Checking
- View your own token balance
- Check any user's balance by entering their ID

#### 💸 Token Transfers
- Send tokens to other users
- Automatic balance validation
- Real-time balance updates
- Transfer confirmation messages

#### 🏭 Token Minting (Available to All Users)
- Any user can mint new tokens
- Mint tokens to any user (including yourself)
- Updates total supply automatically
- Accessible to all logged-in users

#### 📋 Transaction History
- View recent transactions
- Different transaction types (transfers, mints)
- Timestamps for all transactions

## How to Use

### 1. Login
- Use `admin` to login as the creator/admin
- Use any other ID to login as a regular user
- New users are automatically created with 0 balance

### 2. Minting Features (Available to All Users)
- **Mint Tokens**: Create new tokens and assign them to any user
- **Self-Minting**: Users can mint tokens to themselves
- **No Restrictions**: All users have minting capabilities

### 3. Regular User Features
- **Check Balance**: View your own or others' token balances
- **Transfer Tokens**: Send tokens to other users
- **View History**: See recent transaction activity

## Technical Details

### File Structure
```
token-system/
├── index.html      # Main HTML structure
├── styles.css      # Modern, responsive styling
├── script.js       # Token system logic and UI interactions
└── README.md       # This file
```

### Token System Architecture
- **TokenSystem Class**: Core logic for all token operations
- **Balance Management**: Automatic user creation and balance tracking
- **Transaction Validation**: Prevents invalid transfers and operations
- **Admin Controls**: Restricted minting functionality

### Security Features
- Balance validation before transfers
- Admin-only minting restrictions
- Input validation and sanitization
- Error handling for all operations

## Getting Started

1. Open `index.html` in a web browser
2. Login with `admin` to access all features
3. Create additional users by logging in with different IDs
4. Start transferring and minting tokens!

## UI Features

- **Responsive Design**: Works on desktop and mobile
- **Modern Styling**: Gradient backgrounds and smooth animations
- **Real-time Updates**: Instant balance and supply updates
- **User Feedback**: Success/error messages for all operations
- **Transaction History**: Visual transaction log with timestamps

## Default Setup

- **Creator ID**: `admin`
- **Initial Balance**: 1,000,000 K tokens (all to admin)
- **Token Name**: KuKu Coin
- **Token Symbol**: K

Start by logging in as `admin` to mint K tokens to other users, or create regular user accounts to receive and transfer tokens!
