const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/buscar', async (req, res) => {
  const query = req.query.producto;
  if (!query) return res.status(400).json({ error: 'Falta el parámetro "producto"' });

  const url = `https://www.cetrogar.com.ar/catalogsearch/result/?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(response.data);
    console.log(response)
    const productos = [];

    $('.product-item-info').each((i, el) => {
      const titulo = $(el).find('.product.name a').text().trim();
      const precio = $(el).find('.price').first().text().trim();
      if (titulo) productos.push({ titulo, precio });
    });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar en Cetrogar', detalle: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
