import express from 'express';
import { ProductManager } from './productManager.js';

const app = express();
const port = 6500;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(
        'MERCADO: Utilice los botones para buscar productos. </br></br>Lista de productos <a href="http://localhost:6500/products"><button>TODOS LOS PRODUCTOS</button></a></br>Cuantos productos queres ver?: <a href="http://localhost:6500/products?limit=1"><button>1</button></a><a href="http://localhost:6500/products?limit=2"><button>2</button></a><a href="http://localhost:6500/products?limit=3"><button>3</button></a><a href="http://localhost:6500/products?limit=4"><button>4</button></a><a href="http://localhost:6500/products?limit=5"><button>5</button></a></br>Un producto especifico segun ID?: <a href="http://localhost:6500/products/1"><button>ID:1</button></a><a href="http://localhost:6500/products/2"><button>ID:2</button></a><a href="http://localhost:6500/products/3"><button>ID:3</button></a><a href="http://localhost:6500/products/4"><button>ID:4</button></a><a href="http://localhost:6500/products/5"><button>ID:5</button></a>'
    );
});

app.get('/products', (req, res) => {
    const allProducts = new ProductManager();
    const productList = allProducts.getProducts();
    const indexMaxProducts = Object.keys(productList).length;
    const addLimit = req.query.limit;

    if (addLimit !== undefined) {
        if (addLimit > indexMaxProducts || addLimit <= 0 || isNaN(addLimit)) {
            res.send('El límite debe ser un número positivo y estar dentro del rango de la cantidad total de productos disponibles.');
        } else {
            res.send(Object.entries(productList).slice(0, addLimit));
        }
    } else {
        res.send(allProducts.getProducts());
    }
});


app.get('/products/:pid', (req, res) => {
    const allProducts = new ProductManager();
    const Pid = req.params.pid;
    const ParamsProduct = allProducts['products'][Pid];
    if (Pid !== undefined && ParamsProduct !== undefined) {
        if (Pid <= 0 || isNaN(Pid)) {
            res.send('El ID debe ser un número positivo y estar en la lista de productos.');
        } else {
            res.send(ParamsProduct);
        }
    } else {
        res.send('El número ID debe ser positivo y debe encontrarse en la lista de productos.');
    }
});

app.get('*', (req, res) => {
    res.send('Parametros incorrectos. <a href="http://localhost:6500"><button>Volver al inicio </button></a>');
});

app.listen(port, () => console.log(`Running at http://localhost:${port}`));