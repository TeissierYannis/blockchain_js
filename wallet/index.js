const {STARTING_BALANCE} = require("../config/config");
const {ec, cryptoHash } = require("../util");
const Transaction = require("./transaction");

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keypair = ec.genKeyPair();
        this.publicKey = this.keypair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keypair.sign(cryptoHash(data));
    }

    createTransaction({amount, recipient}) {
        if (amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }

        return new Transaction({
            senderWallet: this,
            recipient,
            amount
        });
    }
}

module.exports = Wallet;