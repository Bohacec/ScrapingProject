const axios = require('axios');
const cheerio = require('cheerio');

async function buscarEnCetrogar(query) {
  const url = `https://www.cetrogar.com.ar/catalogsearch/result/?q=${encodeURIComponent(query)}`;
  const productos = [];

  const response = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  const $ = cheerio.load(response.data);

  if($('.base').text().trim().includes('Resultados de búsqueda para')){
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
    }else{
        //con la descripcion encontro 1 solo resultado. De esta manera la pagina tiene otra estructura
        const nombre = $('.base').text().trim()
        //const precio = $('span.price-wrapper.price-including-tax > span.price').first().text().trim();
        const precio = $('span.price-wrapper.price-including-tax > span.price').eq(1).text().trim();
        const urlImagen = $('.fotorama__stage__frame.fotorama__active img').attr('src');
        
        let urlImagenProcesada = ''
        if(urlImagen !== undefined){
            urlImagenProcesada = urlImagen.split("?")[0]
        }

        productos.push({
            origen: 'Cetrogar',
            nombre:nombre,
            precio:precio,
            urlImagen:urlImagenProcesada
        })
    }

  return productos;
}

module.exports = { buscarEnCetrogar };
