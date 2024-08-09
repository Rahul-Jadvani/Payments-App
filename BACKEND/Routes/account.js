const express = require('express');
const mongoose = require('mongoose');
const { authMiddleware } = require('../Auth/authMiddleware');
const zod = require('zod');
const router = express.Router();
const { Account } = require('../DataBase/db');

router.use(authMiddleware);

router.get('/balance', async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        return res.json({ balance: account.balance });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const transferSchema = zod.object({
    amount: zod.number().positive().int(),  // Ensure amount is a positive integer
    to: zod.string().min(1)
});

router.post('/transfer', async (req, res) => {
    const { success, error } = transferSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: 'Invalid input', error: error.errors });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;
        const fromAccount = await Account.findOne({ userId: req.userId }).session(session);
        if (!fromAccount || fromAccount.balance < amount) {
            await session.abortTransaction();
            session.endSession();  // Ensure session ends if transaction is aborted
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            session.endSession();  // Ensure session ends if transaction is aborted
            return res.status(400).json({ message: 'Invalid account' });
        }

        fromAccount.balance -= amount;
        toAccount.balance += amount;

        await fromAccount.save({ session });
        await toAccount.save({ session });

        await session.commitTransaction();
        session.endSession();  // Ensure session ends after committing the transaction

        return res.json({ message: 'Transfer successful' });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();  // Ensure session ends if there's an error
        return res.status(500).json({ message: 'Transfer failed', error: error.message });
    }
});

module.exports = router;
