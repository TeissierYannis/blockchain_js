const uuid = require('uuid');

class Transaction {
    constructor({ senderWallet, recipient, amount }) {
        this.id = uuid.v1();
        this.outputMap = this.createOutputMap({senderWallet, recipient, amount});
    }

    createOutputMap({ senderWallet, recipient, amount }) {
        this.outputMap = {};

        this.outputMap[recipient] = amount;
        this.outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return this.outputMap;
    }
}

module.exports = Transaction;