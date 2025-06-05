const axios = require('axios');
const cheerio = require('cheerio');

async function buscarEnMercadoLibre(query) {

  const url = `https://listado.mercadolibre.com.ar/${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(response.data);
    const productos = [];

    $('.poly-card').each(function () {
      const nombre = $(this).find('.poly-component__title').text().trim();
      const precio = $(this).find('.poly-price__current .andes-money-amount__fraction').first().text().trim();
      const urlImagen = $(this).find('.poly-card__portada img').attr('src');

      if (nombre && precio && urlImagen) {
        productos.push({
          origen: 'MercadoLibre',
          nombre: nombre,
          precio: precio,
          urlImagen: urlImagen,
        });
      }
    });

    return productos;
  } catch (error) {
    console.error('Error al buscar en MercadoLibre:', error.message);
    return [];
  }
}

module.exports = { buscarEnMercadoLibre };
