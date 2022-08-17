const {GENESIS_DATA} = require("../config");
const cryptoHash = require("./crypto-hash");

/**
 * Block class.
 */
class Block {
    /**
     * Generate a new block.
     *
     * @param timestamp timestamp of the block.
     * @param lastHash hash of the block before.
     * @param hash hash of the block.
     * @param data data of the block.
     */
    constructor({ timestamp, lastHash, hash, data }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    /**
     * Generate the genesis block.
     *
     * @returns {Block}
     */
    static genesis() {
        return new this(GENESIS_DATA);
    }

    /**
     * Mine the block.
     * @param lastBlock lastBlock.
     * @param data the data of the block.
     *
     * @returns {Block}
     */
    static mineBlock({ lastBlock, data }) {

        const timestamp = Date.now();
        const lastHash = lastBlock.hash;

        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            data,
            hash: cryptoHash(timestamp, lastHash, data)
        });
    }
}

module.exports = Block;