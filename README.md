# bruceFi Backend

bruceFi simplifies decentralized finance (DeFi) by leveraging AI, smart contracts, and an innovative agent wallet system managed by AI to automate portfolio management and optimize returns.

## 🚀 Features
- 🔥 **AI-Driven Portfolio Management**: Automate your investments with AI-powered strategies.
- 💡 **Smart Contracts Integration**: Secure and trustless DeFi operations.
- 🏦 **Automated Staking Data Updates**: Fetch and update staking information from multiple protocols.
- 🌉 **Base Sepolia Network**: Built on Base Sepolia for efficient transactions.
- 📊 **Real-Time APY & TVL Fetching**: Get accurate staking data from integrated DeFi protocols.

---

## 🏗️ Tech Stack
- **Backend**: Node.js, Express.js, Prisma ORM
- **Blockchain**: Solidity, Ethers.js, Base Sepolia
- **Database**: PostgreSQL
- **Environment Variables**: dotenv for secure API key management

---

## 📦 Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/bruceFi/backend.git
cd backend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
PORT=3000
RPC_URL=YOUR_BLOCKCHAIN_RPC_URL
DATABASE_URL=YOUR_DATABASE_URL
```

### 4️⃣ Start the Server
```sh
npm run dev
```

---

## 📡 API Endpoints

### 🔍 Fetch All Staking Data
```http
GET /staking
```

### 🔍 Fetch Staking Data by Protocol ID
```http
GET /staking/id/:idProtocol
```

### 🔍 Fetch Staking Data by Token Address
```http
GET /staking/address/:address
```

### 🔄 Update Staking Data
```http
POST /staking/update
```

---

## 🏦 Supported Tokens & Staking Contracts
| Token | Contract Address | Staking Address | Project |
|--------|-----------------|-----------------|---------|
| UNI    | `0x40199D...`   | `0x32ecd5...`   | Pendle  |
| USDC   | `0x9a53db...`   | `0x5C2c58...`   | AaveV3  |
| USDT   | `0xe7ba24...`   | `0x67D957...`   | CompoundV3 |
| DAI    | `0xDb5B12...`   | `0xE3e657...`   | StargateV3 |
| WETH   | `0x0D3674...`   | `0x80e6A5...`   | Moonwell |

---

## 👨‍💻 Contributing
We welcome contributions! Feel free to submit a pull request or open an issue.

---

## 📜 License
This project is licensed under the MIT License. See `LICENSE` for details.

---

🚀 **bruceFi - Simplifying DeFi with AI!**