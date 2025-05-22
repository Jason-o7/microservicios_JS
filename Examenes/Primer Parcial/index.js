const express = require('express');
const { connect } = require('./db');
const { ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

app.get('/libro', async (req, res) => {
    try {
        const libros = await connect();
        const result = await libros.find({}).toArray();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener libros' });
    }
});

app.post('/libro', async (req, res) => {
    try {
        const libros = await connect();
        const result = await libros.insertOne(req.body);
        res.status(201).json({ ...req.body, _id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear libro' });
    }
});

app.put('/libro/:id', async (req, res) => {
    try {
        const libros = await connect();
        const result = await libros.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar libro' });
    }
});

app.delete('/libro/:id', async (req, res) => {
    try {
        const libros = await connect();
        await libros.deleteOne({ _id: new ObjectId(req.params.id) });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar libro' });
    }
});

app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
}); 