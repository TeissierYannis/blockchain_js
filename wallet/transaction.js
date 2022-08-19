const uuid = require('uuid');

class Transaction {
    constructor({ senderWallet, recipient, amount }) {
        this.id = uuid.v1();
        this.outputMap = this.createOutputMap({senderWallet, recipient, amount});
        this.input = this.createInput({
            senderWallet,
            outputMap: this.outputMap
        });
    }

    createOutputMap({ senderWallet, recipient, amount }) {
        this.outputMap = {};

        this.outputMap[recipient] = amount;
        this.outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return this.outputMap;
    }

    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    }
}

module.exports = Transaction;