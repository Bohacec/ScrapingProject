const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer'); //simula un navegador, carga el JS y deja el DOM listo.

async function buscarEnChemesweb(query) {
  try {
    const url = `https://chemesweb.com.ar/module/iqitsearch/searchiqit?s=${encodeURIComponent(query)}`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const productos = await page.evaluate(() => {
        const items = [];
        const productosDOM = document.querySelectorAll('.product-miniature');

        productosDOM.forEach(producto => {
            console.log("Entro en el foreach chemes")
            const origen = 'Chemes'
            const descripcion = producto.querySelector('.product-title a')?.innerText.trim();
            const precio = producto.querySelector('.product-price')?.innerText.trim();
            const urlImagen = producto.querySelector('.product-thumbnail img')?.src;

            if (descripcion && precio && urlImagen) {
                items.push({ origen, descripcion, precio, urlImagen });
            }
        });

        return items;
    });

    await browser.close();

    return productos;

  } catch (error) {
    console.error('Error buscando en Chemesweb:', error.message);
    return [];
  }
}

module.exports = { buscarEnChemesweb };