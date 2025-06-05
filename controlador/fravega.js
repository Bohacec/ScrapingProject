const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer'); //simula un navegador, carga el JS y deja el DOM listo.

async function buscarEnFravega(query) {
  const url = `https://www.fravega.com/l/?keyword=${encodeURIComponent(query)}`;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const productos = await page.evaluate(() => {
    const items = [];
    const productosDOM = document.querySelectorAll('article[data-test-id="result-item"]');
    const origen = "Frávega"
    
    productosDOM.forEach(producto => {
        const descripcion = producto.querySelector('span')?.innerText?.trim();
        const precio = producto.querySelector('div[data-test-id="product-price"] span')?.innerText?.trim();
        const urlImagen = producto.querySelector('img')?.src;
        const linkRelativo = producto.querySelector('a[rel="bookmark"]')?.getAttribute('href');
        const link = linkRelativo ? 'https://www.fravega.com' + linkRelativo : null;

        if (descripcion && precio && urlImagen) {
            items.push({ origen, descripcion, precio, urlImagen });
        }
        });

        return items;
    });

    await browser.close();
    return productos;

  } catch (error) {
    console.error('Error al buscar en Frávega:', error.message);
    return [];
  }
}

// 👇 Exportar la función para usarla en otros archivos
module.exports = { buscarEnFravega };
