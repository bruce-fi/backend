import express from "express";
import type { Request, Response } from "express";
import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

app.use(cors());
app.use(express.json());

const MOCK_TOKENS = {
  UNI: {
    token: "0x40199Df02e052bE29bBf289FbB7717CD0BE8eE80",
    staking: "0x32ecd5f7442ae3b4257557D696c6D68722000008",
    nameProject: "Pendle"
  },
  USDC: {
    token: "0x9a53dbaaCCbBFf2721168673aC7738422bD4d1E9",
    staking: "0x5C2c580bC9A9f7C7C3E7c768b77c6a34510606CC",
    nameProject: "AaveV3"
  },
  USDT: {
    token: "0xe7ba244c2597ADA3e6181577b9758c90f5802F13",
    staking: "0x67D9572A17C8d7cCfe4d45972d96d6462640b931",
    nameProject: "CompoundV3"
  },
  DAI: {
    token: "0xDb5B12196f4195DB9f0a03536CCb217deDF79C0a",
    staking: "0xE3e657Ae4d01343E74050B73f4Bc4D434431D228",
    nameProject: "StargateV3"
  },
  WETH: {
    token: "0x0D36746783656989F8D7c03F6bFB80910D32f778",
    staking: "0x80e6A5e648E97FF1dA61c4484d1f41b068c737D3",
    nameProject: "Moonwell"
  }
};

const LOGOS = {
  [MOCK_TOKENS.UNI.token]: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
  [MOCK_TOKENS.USDC.token]: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  [MOCK_TOKENS.USDT.token]: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  [MOCK_TOKENS.DAI.token]: "https://cryptologos.cc/logos/dai-dai-logo.png",
  [MOCK_TOKENS.WETH.token]: "https://img.cryptorank.io/coins/weth1701090834118.png",
};

const stakingABI = [
  "function fixedAPY() public view returns (uint8)",
  "function totalAmountStaked() public view returns (uint256)",
];

async function updateStakingData(tokenKey: keyof typeof MOCK_TOKENS) {
  try {
    const { token, staking } = MOCK_TOKENS[tokenKey];
    const contract = new ethers.Contract(staking, stakingABI, provider);

    const apy = await contract.fixedAPY();
    const totalStaked = await contract.totalAmountStaked();

    const formattedTVL = Number(ethers.formatUnits(totalStaked, 6));
    const formattedAPY = Number(apy);

    await prisma.staking.upsert({
      where: { addressToken: token },
      update: {
        tvl: formattedTVL,
        apy: formattedAPY,
        updatedAt: new Date()
      },
      create: {
        idProtocol: MOCK_TOKENS[tokenKey].nameProject + "_" + tokenKey,
        addressToken: token,
        addressStaking: staking,
        nameToken: tokenKey,
        nameProject: MOCK_TOKENS[tokenKey].nameProject,
        chain: "Base Sepolia",
        apy: formattedAPY,
        stablecoin: tokenKey === "USDC" || tokenKey === "USDT" ? true : false,
        categories: ["Staking", tokenKey === "USDC" || tokenKey === "USDT" ? "Stablecoin" : ""].filter(Boolean),
        logo: LOGOS[token] || "",
        tvl: formattedTVL,
      },
    });

    console.log(`Updated staking data for ${tokenKey}`);
  } catch (error) {
    console.error(`Error updating staking data for ${tokenKey}:`, error);
  }
}

const getStakingData = async (req: Request, res: Response) => {
  try {
    const data = await prisma.staking.findMany();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staking data" });
  }
};

const getStakingByIdProtocol = async (req: any, res: any) => {
  try {
    const data = await prisma.staking.findMany({
      where: { idProtocol: req.params.idProtocol },
    });

    if (!data) {
      return res.status(404).json({ error: "Staking data not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staking data" });
  }
};

const getStakingByAddress = async (req: any, res: any) => {
  try {
    const data = await prisma.staking.findUnique({
      where: { addressToken: req.params.address },
    });

    if (!data) {
      return res.status(404).json({ error: "Staking data not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staking data" });
  }
};

const updateStaking = async (req: Request, res: Response) => {
  try {
    const updatePromises = Object.keys(MOCK_TOKENS).map((tokenKey) =>
      updateStakingData(tokenKey as keyof typeof MOCK_TOKENS)
    );

    await Promise.all(updatePromises);

    res.json({ message: "All staking data updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update staking data" });
  }
};

app.get("/staking", getStakingData);
app.get("/staking/id/:idProtocol", getStakingByIdProtocol);
app.get("/staking/address/:address", getStakingByAddress);
app.post("/staking/update", updateStaking);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
