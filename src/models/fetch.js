const db = require('./db'); 


async function getStockByBranch(branch) {
    try {
        const [rows, fields] = await db.execute(
            'SELECT * FROM stock WHERE branch = ?',
            [branch]
        );
        return rows;
    } catch (error) {
        console.error('Error querying database:', error);
        throw error;
    }
}

module.exports = {
    getStockByBranch
};
