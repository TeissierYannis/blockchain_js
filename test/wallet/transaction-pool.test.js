const TransactionPool = require('../../wallet/transaction-pool');
const Transaction = require('../../wallet/transaction');
const Wallet = require('../../wallet');
const Blockchain = require('../../blockchain');

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

    describe('existingTransaction()', () => {
        it('returns an existing transaction given an input address', () => {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.existingTransaction({inputAddress: senderWallet.publicKey}))
                .toEqual(transaction);
        });
    });

    describe('validTransactions()', () => {
        let validTransactions, errorMock;

        beforeEach(() => {
            validTransactions = [];
            errorMock = jest.fn();
            global.console.error = errorMock;

            for (let i = 0; i < 10; i++) {
                transaction = new Transaction({
                    senderWallet,
                    recipient: 'recipient',
                    amount: 30
                });

                if (i % 3 === 0) {
                    transaction.input.amount = 9999999;
                } else if (i % 3 === 1) {
                    transaction.input.signature = new Wallet().sign('foo');
                } else {
                    validTransactions.push(transaction);
                }

                transactionPool.setTransaction(transaction);
            }
        });

        it('returns valid transactions', () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });

        it('logs an error for invalid transactions', () => {
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        });
    });

    describe('clear()', () => {
        it('clears the transactions', () => {
            transactionPool.clear();

            expect(transactionPool.transactionMap).toEqual({});
        });
    });

    describe('clearBlockchainTransactions()', () => {
        it('clears the pool of any existing blockchain transactions', () => {
            const blockchain = new Blockchain();
            const expectedTransactionMap = {};

            for (let i = 0; i < 6; i++) {
                const transaction = new Wallet().createTransaction(
                    {recipient: 'foo', amount: 20},
                );

                transactionPool.setTransaction(transaction);

                if (i % 2 === 0) {
                    blockchain.addBlock({data: [transaction]});
                } else {
                    expectedTransactionMap[transaction.id] = transaction;
                }
            }
            transactionPool.clearBlockchainTransactions({chain: blockchain.chain});
            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
        });
    });
});