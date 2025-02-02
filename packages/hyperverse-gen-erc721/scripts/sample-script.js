// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const GENERC721 = await hre.ethers.getContractFactory("GENERC721");
  // Gas cost: 1875000000
  const masterContract = await GENERC721.deploy();
  console.log("Master contract deployment");
  console.log(masterContract);

  const GENERC721Factory = await hre.ethers.getContractFactory("GENERC721Factory");
  const factoryContract = await GENERC721Factory.deploy(masterContract.address);

  await masterContract.deployed();
  await factoryContract.deployed();

  // Gas cost: 29022808
  let tx = await factoryContract.createInstance("Jacob", "JMT");
  console.log("Clone deployment");
  console.log(tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
