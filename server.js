const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors()); // permite llamadas desde cualquier origen

app.get('/buscar', async (req, res) => {
  const producto = req.query.producto;
  if (!producto) return res.status(400).json({ error: 'Falta parámetro ?producto=' });

  const url = `https://www.cetrogar.com.ar/catalogsearch/result/?q=${encodeURIComponent(producto)}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(data);
    const resultados = [];

    $('.product-item-info').each((i, elem) => {
      const titulo = $(elem).find('.product-item-link').text().trim();
      const precio = $(elem).find('.price').first().text().trim();
      const enlace = $(elem).find('.product-item-link').attr('href');
      const imagen = $(elem).find('img').attr('src');

      if (titulo && precio && enlace) {
        resultados.push({ titulo, precio, enlace, imagen });
      }
    });

    res.json({ resultados });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener resultados', detalles: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Microservicio corriendo en http://localhost:${PORT}`);
});
