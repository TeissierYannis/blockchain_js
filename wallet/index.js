const {STARTING_BALANCE} = require("../config/config");
const cryptoHash = require("../util/crypto-hash");
const {ec} = require("../util");

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keypair = ec.genKeyPair();
        this.publicKey = this.keypair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keypair.sign(cryptoHash(data));
    }
}

module.exports = Wallet;