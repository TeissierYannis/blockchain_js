const PubNub = require("pubnub/src/titanium");

const CREDENTIALS = {
    publishKey: '',
    subscribeKey: '',
    secretKey: '',
}

const CHANNELS = {
    TEST: 'TEST'
}

class Pubsub {
    constructor(){
        this.pubnub = new PubNub(CREDENTIALS);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
            message: (messageObject) => {
                const {channel, message} = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}`);
            }
        }
    }

    publish({channel, message}) {
        this.pubnub.publish({ channel, message });
    }
}

module.exports = Pubsub;