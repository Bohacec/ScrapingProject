const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/buscar', async (req, res) => {
  const query = req.query.producto;
  if (!query) return res.status(400).json({ error: 'Falta el parámetro "producto"' });

  //Cetrogar
  const url = `https://www.cetrogar.com.ar/catalogsearch/result/?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(response.data);
    const productos = [];

    if($('.base').text().trim()){
        //con la descripcion encontro 1 solo resultado. De esta manera la pagina tiene otra estructura
         const nombre = $('.base').text().trim()
         const precio = $('span#price-including-tax-product-price-42661 > span.price').text().trim();

         let urlImagenProcesada = ''

         productos.push({
                origen: 'Cetrogar',
                nombre:nombre,
                precio:precio,
                urlProducto:urlImagenProcesada
            })
    }else{
        //son varios resultados
        $('li.item.product').each(function() {
            const nombre = $(this).find('.product-item-name .name-container').text().trim();
            const precio = $(this).find('.price-final_price .final-price .price').first().text().trim();
            const urlImagen = $(this).find('.product-image-photo').attr('src');
            let urlImagenProcesada = ''
            //const urlProducto = $(this).find('a.product-item-info').attr('href');

            if(urlImagen !== undefined){
                urlImagenProcesada = urlImagen.split("?")[0]
            }

            productos.push({
                origen: 'Cetrogar',
                nombre:nombre,
                precio:precio,
                urlProducto:urlImagenProcesada
            })
        });
    }

    

    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar en Cetrogar', detalle: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
