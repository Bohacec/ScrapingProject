const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const { buscarEnCetrogar } = require('./controlador/cetrogar.js');
const { buscarEnMercadoLibre } = require('./controlador/mercadoLibre.js');
const { buscarEnFravega } = require('./controlador/fravega.js');
const { buscarEnChemesweb } = require('./controlador/chemes.js');

const app = express();
app.use(cors());

app.get('/buscar', async (req, res) => {
    const query = req.query.producto;
    if (!query) return res.status(400).json({ error: 'Falta el parámetro "producto"' });

    try {
        const resultadosCetro = await buscarEnCetrogar(query);
        const resultadosML = await buscarEnMercadoLibre(query);
        const resultadosFra = await buscarEnFravega(query);
        const resultadosChe = await buscarEnChemesweb(query);

        const resultadoFinal = [...resultadosCetro, ...resultadosML, ...resultadosFra, ...resultadosChe];

        res.json({version:"1.1.0",data:resultadoFinal});
    } catch (error) {
        res.status(500).json({ error: 'Error general de búsqueda', detalle: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
