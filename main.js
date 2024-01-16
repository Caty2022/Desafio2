import { promises as fs } from "fs";
const path = "./productos.json";

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  static ultId = 0;

  async addProduct({ title, description, price, image, code, stock }) {
    if (!title || !description || !price || !image || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    // Validamos que el código sea único
    if (this.products.some((item) => item.code === code)) {
      console.log("El código debe ser único");
      return;
    }

    const newProduct = {
      id: ++ProductManager.ultId,
      title,
      description,
      price,
      image,
      code,
      stock,
    };

    // Lo agrego al array
    this.products.push(newProduct);

    // Acá, después de pushear el nuevo producto, tiene que guardar el array en el archivo.
    await this.guardarArchivo(this.products);
  }

  async getProducts() {
    try {
      const arrayProductos = await this.leerArchivo();
      return arrayProductos;
    } catch (error) {
      console.error("Error al obtener los productos");
      return [];
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find((item) => item.id === id);

      if (buscado) {
        console.log(buscado);
      } else {
        console.log("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar producto por ID");
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const arrayProductos = await this.leerArchivo();
      const indice = arrayProductos.findIndex((item) => item.id === id);

      if (indice !== -1) {
        // Actualizar las propiedades del producto
        arrayProductos[indice].title = updatedProduct.title;
        arrayProductos[indice].description = updatedProduct.description;
        arrayProductos[indice].price = updatedProduct.price;
        arrayProductos[indice].image = updatedProduct.image;
        arrayProductos[indice].code = updatedProduct.code;
        arrayProductos[indice].stock = updatedProduct.stock;

        await this.guardarArchivo(arrayProductos);
        console.log("Producto actualizado correctamente");
      } else {
        console.log("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al actualizar producto");
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find((item) => item.id === id);

      if (buscado) {
        await fs.writeFile(
          this.path,
          JSON.stringify(
            arrayProductos.filter((producto) => producto.id !== id),
            null,
            2
          )
        );
        console.log("Producto eliminado correctamente");
      } else {
        console.log("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al eliminar producto");
    }
  }

  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.error("Error al leer el archivo");
      return [];
    }
  }
  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.error("Error al guardar el archivo");
    }
  }
}

//Testing
//Se creará una instancia de la clase “ProductManager”
const productManager = new ProductManager(path);


//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
//console.log(await productManager.getProducts());

//Se llamará al método “addProduct” con los campos:
 //title: “producto prueba”
 //description:”Este es un producto prueba”
  //price:200,
 //image:”Sin imagen”
 //code:”abc123”,
 //stock:25
//productManager.addProduct({title:"Producto prueba", description:"esto es un producto prueba",price: 200,image: "sin imagen", code:"abc123", stock:25});
//productManager.addProduct({title: "Producto prueba",description: "esto es un producto prueba",price: 300,image: "sin imagen",code: "abc124",stock: 20,});
//productManager.addProduct({title: "Producto prueba",description: "esto es un producto prueba",price: 300,image: "sin imagen",code: "abc125",stock: 20,});
//4)El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
//5)Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
//console.log(await productManager.getProducts());

//Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
//console.log(await productManager.getProductById(3));

//Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
//productManager.updateProduct(1,{title: "remera"});

//Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
console.log( await productManager.deleteProduct(1));