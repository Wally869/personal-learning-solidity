const Web3 = require("web3");
const fs = require("fs");

const CONTRACT_ADDRESS = "0xe72DE56C81Ce099135B2B6A03EbeE50EFfF3ebB3";

const OWNER_ADDRESS = "0xCC1D095BbDB3A0A022fDf61fA6051f76e9F6B44c";



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
  CONTRACT_ADDRESS,
  {gas: 3000000}
);


async function performDraw() {
    lotteryContract.methods
        .drawWinner()
        .send({from: OWNER_ADDRESS});

}


var countTicketsBought = 0;
var ticketsBoughtSubscription = lotteryContract.events.OnTicketBought({}).on("data", async function(event) {
    console.log("New Ticket Bought by: " + event.returnValues.participantAddress)
    countTicketsBought++;

    if (countTicketsBought >= 3) {
        console.log("Target number of tickets reached, performing draw")
        performDraw();
        countTicketsBought = 0;
    }
}); 


var ticketsBoughtSubscription = lotteryContract.events.OnDrawWinner({}).on("data", async function(event) {
    console.log("Drawn Winner: " + event.returnValues.winnerAddress)

}); 


