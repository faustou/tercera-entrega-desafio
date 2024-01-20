import fs from 'fs';
/*const fs = require('fs');
const fsPath = require('path');*/
import * as fsPath from 'path';
const dbFile = './src/db.json';


export class ProductManager {
    constructor(path = process.cwd(), file = dbFile) {
        this.path = path;
        this.file = file;
        this.originalProducts = {};
        this.currentId = 0;

        if (!fs.existsSync(fsPath.join(this.path, this.file))) {
            try {
                fs.writeFileSync(fsPath.join(this.path, this.file), JSON.stringify(this.originalProducts, null, 2));
            } catch (err) {
                console.log(err);
            }
        }

        const readProducts = fs.readFileSync(fsPath.join(this.path, this.file), 'utf-8');
        this.products = JSON.parse(readProducts);
        this.currentId = Object.keys(this.products)[Object.keys(this.products).length - 1];
    }

    addProduct(title, description, price, thumbnail, stock, code) {
        if (stock <= 0 || typeof stock !== 'number') {
            console.log('debe ingresar un numero mayor a 0');
            return '';
        }

        let ids = [];
        let codigos = [];
        Object.entries(this.products).forEach((producto) => {
            ids.push(producto[0]);
            codigos.push(producto[1]['code']);
        });

        let max = Math.max(...ids);

        if (max == '-Infinity') {
            max = 0;
        }

        if (codigos.includes(code)) {
            console.log('no repetir codigo');
            return '';
        }

        let thisItem = {};

        thisItem.id = max + 1;
        thisItem.title = title;
        thisItem.description = description;
        thisItem.price = price;
        thisItem.thumbnail = thumbnail;
        thisItem.stock = stock;
        thisItem.code = code;

        this.products[thisItem.id] = thisItem;

        fs.writeFileSync(fsPath.join(this.path, this.file), JSON.stringify(this.products, null, 2), 'utf-8');
        console.log(`Producto con el id: ${thisItem.id} agregado correctamente.`);
    }

    getProducts() {
        const readProducts = fs.readFileSync(fsPath.join(this.path, this.file), 'utf-8');
        this.products = JSON.parse(readProducts);
        
        if (Object.keys(this.products).length >= 1) {
            return this.products;
        } else {
            console.log('No se encontraron productos');
            return '';
        }
    }    
    
    deleteProduct(id) {
        if (this.products[id] === undefined) {
            console.log(`no hay producto con el codigo ${id}`);
            return '';
        }

        delete this.products[id];

        fs.writeFileSync(fsPath.join(this.path, this.file), JSON.stringify(this.products, null, 2), 'utf-8');
        console.log(`El producto ${id} se eliminado`);
        return '';
    }
    
    updateProduct(id, title, description, price, thumbnail, stock, code) {
        if (this.products[id] === undefined) {
            console.log(`No hay id:  ${id} en ningun producto`);
            return '';
        } else {
            for (let i = 0; i < Object.keys(this.products).length; i = i + 1) {
                if (this.products[i + 1] && Object.values(this.products).find((value) => value['code'] === code) !== undefined) {
                    if (id - 1 !== i) {
                        console.log('No repetir codigo');
                        return '';
                    }
                }
            }
        }

        let thisItem = {};
        
        thisItem.id = id;
        thisItem.title = title;
        thisItem.description = description;
        thisItem.price = price;
        thisItem.thumbnail = thumbnail;
        thisItem.stock = stock;
        thisItem.code = code;

        this.products[id] = thisItem;
        
        fs.writeFileSync(fsPath.join(this.path, this.file), JSON.stringify(this.products, null, 2), 'utf-8');
        console.log(`El producto ${id} cambio`);
        return '';
    }
    
    getProductById(id = null) {
        if (this.products[id] === undefined) {
            console.log(`No existe un producto con el codigo ${id}`);
            return '';
        } else if (this.products[id]['title'] === undefined) {
            console.log(`produco no definido`);
            return '';
        } else {
            return this.products[id];
        }
    }
    
}

/*const manager = new ProductManager();
manager.addProduct('pan', '1kl pan flaua', 1200, 'pan.png', 5, 'pan-abc');
manager.addProduct('cereal', 'cerealmix grande', 800, 'cereal.png', 10, 'cereal-abc1');
manager.addProduct('fruta', '2kl de frutilla', 2600, 'fruta.png', 15, 'fruta-abc2');
manager.addProduct('bebida', 'pack de gaseosas', 850, 'bebida.png', 30, 'bebida-abc3');
manager.addProduct('verdura', 'brocoli de temporada', 550, 'brocoli.png', 5, 'brocoli-abc4');

console.log(manager.getProducts()); // Se consulta todo el array de productos.
console.log(manager.getProductById(2)); // Se consulta un producto a traves de su ID.
console.log(manager.updateProduct(2, 'cereal', 'cerealmix grande', 800, 'cereal.png', 9, 'cereal-abc2')); //Cambio el stock. (en el cual el codigo debe ser distinto)
console.log(manager.getProductById(2)); // Se consulta el producto modificado a traves de su ID.
console.log(manager.deleteProduct(4)); // Se elimina
console.log(manager.deleteProduct(5)); // Se elimina
console.log(manager.getProducts()); //Se consulta todo el array de productos nuevamente.*/ 