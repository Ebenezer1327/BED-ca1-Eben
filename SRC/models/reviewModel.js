const db = require('../config/db');

module.exports = {
    
    // Use async/await for promise-based database queries
    async selectAll() {
        const SQLSTATMENT = `
        SELECT * FROM Reviews;
        `;
        try {
            const [rows] = await db.query(SQLSTATMENT); // Await the result
            return rows;
        } catch (error) {
            throw error; // Handle error
        }
    },

    async selectById(data) {
        const SQLSTATMENT = `
        SELECT * FROM Reviews
        WHERE id = ?;
        `;
        const VALUES = [data.id];
        try {
            const [rows] = await db.query(SQLSTATMENT, VALUES);
            return rows;
        } catch (error) {
            throw error; // Handle error
        }
    },

    async insertSingle(data, callback) {
        const SQLSTATMENT = `
        INSERT INTO Reviews (review_amt, user_id, message)
        VALUES (?, ?, ?);
        `;
        const VALUES = [data.review_amt, data.user_id, data.message];
        
        db.query(SQLSTATMENT, VALUES, callback);
    },
    

    async updateById(data) {
        const SQLSTATMENT = `
        UPDATE Reviews 
        SET review_amt = ?, user_id = ?, message = ?
        WHERE id = ?;
        `;
        const VALUES = [data.review_amt, data.user_id, data.message, data.id];
        try {
            const [result] = await db.query(SQLSTATMENT, VALUES);
            return result; // Return result of update
        } catch (error) {
            throw error; // Handle error
        }
    },

    async deleteById(data) {
        const SQLSTATMENT = `
        DELETE FROM Reviews 
        WHERE id = ?;
        `;
        const VALUES = [data.id];
        try {
            const [result] = await db.query(SQLSTATMENT, VALUES);
            return result; // Return result of delete
        } catch (error) {
            throw error; // Handle error
        }
    }

};
