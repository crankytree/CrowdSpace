const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");
const dotenv = require("dotenv").config();

let provider;
try{
  
   provider = new HDWalletProvider(
    `${process.env.NUMONIC}`,
    `${process.env.SEPOLIA}`
  );
}
catch(err){
  console.log(err);
  
}

const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log("Attepting to deploy from account => ", accounts[0]);

    const result = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data:compiledFactory.evm.bytecode.object })
      .send({ from: accounts[0], gas: "1400000" });

    
    console.log("Contract Deployed to", result.options.address);
    provider.engine.stop();
  } catch (err) {
    console.log(err.message);
  }
};

deploy();
