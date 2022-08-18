const PubNub = require('pubnub');
const CREDENTIALS = require("../config/pubsub_key");

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
    constructor({ blockchain, transactionPool, wallet }) {
        this.blockchain = blockchain;
        this. transactionPool = transactionPool;
        this.wallet = wallet;

        this.pubnub = new PubNub(CREDENTIALS);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }

    subscribeToChannels() {
        this.pubnub.subscribe({
            channels: [Object.values(CHANNELS)]
        });
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}.`);
                const parsedMessage = JSON.parse(message);

                switch(channel) {
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(parsedMessage, true, () => {
                            this.transactionPool.clearBlockchainTransactions(
                                { chain: parsedMessage }
                            );
                        });
                        break;
                    case CHANNELS.TRANSACTION:
                        if (parsedMessage.input.address !== this.wallet.publicKey)
                        {
                            this.transactionPool.setTransaction(parsedMessage);
                        }else{
                            console.log('TRANSACTION broadcast recieved from self, ignoring..');
                        }
                        break;
                    default:
                        return;
                }
            }
        }
    }

    publish({ channel, message }) {
        // unsubscribe from the channel,and  resubscribe before publishing to it
        this.pubnub.unsubscribe({ channels: [channel] });
        this.pubnub.subscribe({ channels: [channel] });

        this.pubnub.publish({ message, channel });
    }
}

module.exports = PubSub;