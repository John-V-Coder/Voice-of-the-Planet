// services/idGenerator.js
const Counter = require('../models/Counter'); 

async function getNextSequenceValue(organizationId) {
    const counter = await Counter.findByIdAndUpdate(
        organizationId,
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true } 
    );
    return counter.sequence_value;
}

module.exports = { getNextSequenceValue };