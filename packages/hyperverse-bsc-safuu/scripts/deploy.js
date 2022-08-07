const hre = require('hardhat');
const { ethers } = require("hardhat");
const fs = require('fs-extra');
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");


const main = async () => {
	this.accounts = await ethers.getSigners();
	const deployer = this.accounts[0];
	console.log('Deployer Address: ', deployer.address);

	this.GOLD_LIST = [...this.accounts.slice(0, 3)];
	this.WHITE_LIST = [...this.accounts.splice(3, 3)];
	console.log('GOLD LIST', this.GOLD_LIST.map((account) => account.address));
	console.log('WHITE_LIST', this.WHITE_LIST.map((account) => account.address));
	const SafuuToken = await ethers.getContractFactory("TestERC20");
	this.safuuToken = await SafuuToken.deploy();
	await this.safuuToken.deployed();
	const BaseModule = await hre.ethers.getContractFactory('SafuuX');
	const baseContract = await BaseModule.deploy(
		"Safuu",
		"Safuu",
		this.safuuToken.address,
		generateMerkleRoot(this.GOLD_LIST),
		generateMerkleRoot(this.WHITE_LIST),
		"ipfs://ipfs/...."
	);
	await baseContract.deployed();

	console.log('Module Contract deployed to: ', baseContract.address);
	console.log('Safuu Token deployed to: ', this.safuuToken.address);

	const env = JSON.parse(fs.readFileSync('contracts.json').toString());
	env[hre.network.name] = env[hre.network.name] || {};
	env[hre.network.name].testnet = env[hre.network.name].testnet || {};

	env[hre.network.name].testnet.contractAddress = baseContract.address;

	// Save contract addresses back to file
	fs.writeJsonSync('contracts.json', env, { spaces: 2 });
};

function generateMerkleRoot(signers) {
	const leafNodes = signers.map((signer) => keccak256(signer.address));
	const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
	return "0x" + merkleTree.getRoot().toString("hex");
}

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

runMain();
