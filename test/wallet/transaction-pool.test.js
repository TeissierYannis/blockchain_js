const TransactionPool = require('../../wallet/transaction-pool');
const Transaction = require('../../wallet/transaction');
const Wallet = require('../../wallet');

describe('TransactionPool', () => {
    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet,
            recipient: 'recipient',
            amount: 50
        });
    });

    describe('setTransaction()', () => {
        it('adds a transaction to the pool', () => {
           transactionPool.setTransaction(transaction);

           expect(transactionPool.transactionMap[transaction.id])
               .toEqual(transaction);
        });
    });
});