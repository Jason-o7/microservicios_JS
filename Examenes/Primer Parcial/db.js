const { MongoClient } = require('mongodb');
// const client = new MongoClient('mongodb://localhost:27017');
const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/libros');

async function connect() {
    try {
        await client.connect();
        const db = client.db('libros');
        return db.collection('libros');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        throw error;
    }
}

module.exports = { connect }; 