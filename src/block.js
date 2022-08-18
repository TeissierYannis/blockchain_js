const {GENESIS_DATA, MINE_RATE} = require("../config");
const cryptoHash = require("./crypto-hash");
const hexToBinary = require('hex-to-binary');
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
     * @param nonce nonce
     * @param difficulty difficulty
     */
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
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
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty } = lastBlock;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = this.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            data,
            difficulty,
            nonce,
            hash
        });
    }

    /**
     * Adjust the difficulty
     *
     * @param originalBlock block.
     * @param timestamp timestamp.
     *
     * @returns {number|*}
     */
    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;

        if (difficulty < 1) return 1;

        if ((timestamp - originalBlock.timestamp) > MINE_RATE ) return difficulty - 1;

        return difficulty + 1;
    }
}

module.exports = Block;