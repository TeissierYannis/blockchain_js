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

    static calculateBalance({ chain, address}) {
        let outputsTotal = 0;

        for (let i = chain.length - 1; i >= 0; i--) {
            const block = chain[i];

            for (let transaction of block.data) {
                const addressOutput = transaction.outputMap[address];

                if (addressOutput) {
                    outputsTotal += addressOutput;
                }
            }
        }

        return STARTING_BALANCE + outputsTotal;
    }
}

module.exports = Wallet;