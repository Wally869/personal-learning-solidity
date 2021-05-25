const Web3 = require("web3");
const fs = require("fs");

const CONTRACT_ADDRESS = "0xe72DE56C81Ce099135B2B6A03EbeE50EFfF3ebB3";

const config = {
  node: "127.0.0.1:9545",
  address: CONTRACT_ADDRESS, // set to contract address
};

const provider = new Web3.providers.WebsocketProvider(`ws://${config.node}`);

const clientWeb3 = new Web3(provider);

let rawdata = fs.readFileSync("ABI/MyLottery.json");
let jsonABI = JSON.parse(rawdata);
let lotteryContract = new clientWeb3.eth.Contract(
  jsonABI.abi,
  CONTRACT_ADDRESS
);

var ACCOUNTS = [
  "0xCC1D095BbDB3A0A022fDf61fA6051f76e9F6B44c",
  "0xeB0f998402382d3142E142d10ca06F4566f10c50",
  "0x8f729c88DD04F3a0351AFc1e056f245Ba6B72A16",
  "0x2C2b97c033570B906c3722bBFCc8b79f5df98D8e",
  "0x610bDf7805562507B1f05DD707166A240E7e4BE0",
  "0xe711c9944526d3122b1B97c2EfE6A481983e2522",
  "0xB89e8cD7c09A1205883e17A164FA391AE7882BF0",
  "0x5C9Ab5D09F739a510Ea8062B4076Fc2dD15E29d5",
  "0xaB3805721AEB6c0f37EC434eEa7fbe8971094C11",
  "0x3e03E7A16C32B44B43A9cc04555c5baE81a3DC44",
];

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

async function performRound() {
  let idBuyer = Math.floor(Math.random() * ACCOUNTS.length);

  await lotteryContract.methods
    .buyTicket()
    .send({ from: ACCOUNTS[idBuyer], value: 1000000000000000000 });

  return idBuyer;
}

const startBuying = async (_) => {
  while (true) {
    const idBuyer = await performRound();
    console.log(idBuyer);

    //const nb = getNb

    sleep((Math.floor(Math.random() * 5) + 2) * 1000);
  }
};

startBuying();

/*

export function delay(time: number) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
 */
