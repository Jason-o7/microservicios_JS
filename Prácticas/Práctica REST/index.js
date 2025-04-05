const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// ====== PRODUCTOS ======

// Crear producto
app.post('/productos', async (req, res) => {
  try {
    const { nombre, descripcion, marca, stock } = req.body;
    
    if (!nombre || !marca || stock === undefined) {
      return res.status(400).json({ mensaje: 'Datos incompletos' });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO productos (nombre, descripcion, marca, stock) VALUES (?, ?, ?, ?)',
      [nombre, descripcion || null, marca, stock]
    );
    
    const [nuevoProducto] = await pool.execute(
      'SELECT * FROM productos WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(nuevoProducto[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const [productos] = await pool.query('SELECT * FROM productos');
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Obtener producto por ID
app.get('/productos/:id', async (req, res) => {
  try {
    const [producto] = await pool.execute(
      'SELECT * FROM productos WHERE id = ?',
      [req.params.id]
    );
    
    if (producto.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    res.json(producto[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Actualizar producto
app.put('/productos/:id', async (req, res) => {
  try {
    const { nombre, descripcion, marca, stock } = req.body;
    
    // Verificar si el producto existe
    const [productoExistente] = await pool.execute(
      'SELECT * FROM productos WHERE id = ?',
      [req.params.id]
    );
    
    if (productoExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    // Actualizar producto
    await pool.execute(
      'UPDATE productos SET nombre = IFNULL(?, nombre), descripcion = IFNULL(?, descripcion), marca = IFNULL(?, marca), stock = IFNULL(?, stock) WHERE id = ?',
      [
        nombre || null,
        descripcion !== undefined ? descripcion : null,
        marca || null,
        stock !== undefined ? stock : null,
        req.params.id
      ]
    );
    
    // Obtener producto actualizado
    const [productoActualizado] = await pool.execute(
      'SELECT * FROM productos WHERE id = ?',
      [req.params.id]
    );
    
    res.json(productoActualizado[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Eliminar producto
app.delete('/productos/:id', async (req, res) => {
  try {
    // Verificar si el producto existe
    const [productoExistente] = await pool.execute(
      'SELECT * FROM productos WHERE id = ?',
      [req.params.id]
    );
    
    if (productoExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    // Eliminar producto
    await pool.execute(
      'DELETE FROM productos WHERE id = ?',
      [req.params.id]
    );
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// ====== CLIENTES ======

// Crear cliente
app.post('/clientes', async (req, res) => {
  try {
    const { ci, nombres, apellidos, sexo } = req.body;
    
    if (!ci || !nombres || !apellidos) {
      return res.status(400).json({ mensaje: 'Datos incompletos' });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO clientes (ci, nombres, apellidos, sexo) VALUES (?, ?, ?, ?)',
      [ci, nombres, apellidos, sexo || null]
    );
    
    const [nuevoCliente] = await pool.execute(
      'SELECT * FROM clientes WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(nuevoCliente[0]);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Obtener todos los clientes
app.get('/clientes', async (req, res) => {
  try {
    const [clientes] = await pool.query('SELECT * FROM clientes');
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Obtener cliente por ID
app.get('/clientes/:id', async (req, res) => {
  try {
    const [cliente] = await pool.execute(
      'SELECT * FROM clientes WHERE id = ?',
      [req.params.id]
    );
    
    if (cliente.length === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    res.json(cliente[0]);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Actualizar cliente
app.put('/clientes/:id', async (req, res) => {
  try {
    const { ci, nombres, apellidos, sexo } = req.body;
    
    // Verificar si el cliente existe
    const [clienteExistente] = await pool.execute(
      'SELECT * FROM clientes WHERE id = ?',
      [req.params.id]
    );
    
    if (clienteExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    // Actualizar cliente
    await pool.execute(
      'UPDATE clientes SET ci = IFNULL(?, ci), nombres = IFNULL(?, nombres), apellidos = IFNULL(?, apellidos), sexo = IFNULL(?, sexo) WHERE id = ?',
      [
        ci || null,
        nombres || null,
        apellidos || null,
        sexo !== undefined ? sexo : null,
        req.params.id
      ]
    );
    
    // Obtener cliente actualizado
    const [clienteActualizado] = await pool.execute(
      'SELECT * FROM clientes WHERE id = ?',
      [req.params.id]
    );
    
    res.json(clienteActualizado[0]);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Eliminar cliente
app.delete('/clientes/:id', async (req, res) => {
  try {
    // Verificar si el cliente existe
    const [clienteExistente] = await pool.execute(
      'SELECT * FROM clientes WHERE id = ?',
      [req.params.id]
    );
    
    if (clienteExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    // Verificar si tiene facturas asociadas
    const [facturasAsociadas] = await pool.execute(
      'SELECT COUNT(*) as count FROM facturas WHERE cliente_id = ?',
      [req.params.id]
    );
    
    if (facturasAsociadas[0].count > 0) {
      return res.status(400).json({ 
        mensaje: 'No se puede eliminar el cliente porque tiene facturas asociadas' 
      });
    }
    
    // Eliminar cliente
    await pool.execute(
      'DELETE FROM clientes WHERE id = ?',
      [req.params.id]
    );
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// ====== FACTURAS ======

// Crear factura
app.post('/facturas', async (req, res) => {
  try {
    const { fecha, cliente_id } = req.body;
    
    if (!fecha || !cliente_id) {
      return res.status(400).json({ mensaje: 'Datos incompletos' });
    }
    
    // Verificar si el cliente existe
    const [clienteExistente] = await pool.execute(
      'SELECT * FROM clientes WHERE id = ?',
      [cliente_id]
    );
    
    if (clienteExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    // Crear factura
    const [result] = await pool.execute(
      'INSERT INTO facturas (fecha, cliente_id, total) VALUES (?, ?, 0)',
      [fecha, cliente_id]
    );
    
    const [nuevaFactura] = await pool.execute(
      'SELECT * FROM facturas WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(nuevaFactura[0]);
  } catch (error) {
    console.error('Error al crear factura:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Obtener todas las facturas
app.get('/facturas', async (req, res) => {
  try {
    const [facturas] = await pool.query('SELECT * FROM facturas');
    res.json(facturas);
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Obtener factura por ID
app.get('/facturas/:id', async (req, res) => {
  try {
    const [factura] = await pool.execute(
      'SELECT * FROM facturas WHERE id = ?',
      [req.params.id]
    );
    
    if (factura.length === 0) {
      return res.status(404).json({ mensaje: 'Factura no encontrada' });
    }
    
    res.json(factura[0]);
  } catch (error) {
    console.error('Error al obtener factura:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Obtener facturas por cliente
app.get('/clientes/:id/facturas', async (req, res) => {
  try {
    const [facturas] = await pool.execute(
      'SELECT * FROM facturas WHERE cliente_id = ?',
      [req.params.id]
    );
    
    res.json(facturas);
  } catch (error) {
    console.error('Error al obtener facturas del cliente:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Actualizar factura
app.put('/facturas/:id', async (req, res) => {
  try {
    const { fecha, cliente_id } = req.body;
    
    // Verificar si la factura existe
    const [facturaExistente] = await pool.execute(
      'SELECT * FROM facturas WHERE id = ?',
      [req.params.id]
    );
    
    if (facturaExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Factura no encontrada' });
    }
    
    // Verificar si el cliente existe, si se está actualizando
    if (cliente_id) {
      const [clienteExistente] = await pool.execute(
        'SELECT * FROM clientes WHERE id = ?',
        [cliente_id]
      );
      
      if (clienteExistente.length === 0) {
        return res.status(404).json({ mensaje: 'Cliente no encontrado' });
      }
    }
    
    // Actualizar factura
    await pool.execute(
      'UPDATE facturas SET fecha = IFNULL(?, fecha), cliente_id = IFNULL(?, cliente_id) WHERE id = ?',
      [
        fecha || null,
        cliente_id || null,
        req.params.id
      ]
    );
    
    // Obtener factura actualizada
    const [facturaActualizada] = await pool.execute(
      'SELECT * FROM facturas WHERE id = ?',
      [req.params.id]
    );
    
    res.json(facturaActualizada[0]);
  } catch (error) {
    console.error('Error al actualizar factura:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Eliminar factura
app.delete('/facturas/:id', async (req, res) => {
  try {
    // Verificar si la factura existe
    const [facturaExistente] = await pool.execute(
      'SELECT * FROM facturas WHERE id = ?',
      [req.params.id]
    );
    
    if (facturaExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Factura no encontrada' });
    }
    
    // Eliminar detalles de factura
    await pool.execute(
      'DELETE FROM detalles_facturas WHERE factura_id = ?',
      [req.params.id]
    );
    
    // Eliminar factura
    await pool.execute(
      'DELETE FROM facturas WHERE id = ?',
      [req.params.id]
    );
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar factura:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// ====== DETALLES DE FACTURAS ======

// Añadir detalle a factura
app.post('/facturas/:id/detalles', async (req, res) => {
  try {
    const { producto_id, cantidad, precio } = req.body;
    const factura_id = req.params.id;
    
    if (!producto_id || !cantidad || !precio) {
      return res.status(400).json({ mensaje: 'Datos incompletos' });
    }
    
    // Verificar si la factura existe
    const [facturaExistente] = await pool.execute(
      'SELECT * FROM facturas WHERE id = ?',
      [factura_id]
    );
    
    if (facturaExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Factura no encontrada' });
    }
    
    // Verificar si el producto existe
    const [productoExistente] = await pool.execute(
      'SELECT * FROM productos WHERE id = ?',
      [producto_id]
    );
    
    if (productoExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    // Calcular subtotal
    const subtotal = cantidad * precio;
    
    // Crear detalle de factura
    const [result] = await pool.execute(
      'INSERT INTO detalles_facturas (factura_id, producto_id, cantidad, precio, subtotal) VALUES (?, ?, ?, ?, ?)',
      [factura_id, producto_id, cantidad, precio, subtotal]
    );
    
    // Actualizar el total de la factura
    await pool.execute(
      'UPDATE facturas SET total = total + ? WHERE id = ?',
      [subtotal, factura_id]
    );
    
    // Obtener detalle creado
    const [nuevoDetalle] = await pool.execute(
      'SELECT * FROM detalles_facturas WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(nuevoDetalle[0]);
  } catch (error) {
    console.error('Error al crear detalle de factura:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Obtener detalles de una factura
app.get('/facturas/:id/detalles', async (req, res) => {
  try {
    const [detalles] = await pool.execute(
      'SELECT df.*, p.nombre as producto_nombre FROM detalles_facturas df JOIN productos p ON df.producto_id = p.id WHERE df.factura_id = ?',
      [req.params.id]
    );
    
    res.json(detalles);
  } catch (error) {
    console.error('Error al obtener detalles de factura:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Actualizar detalle de factura
app.put('/detalles/:id', async (req, res) => {
  try {
    const { cantidad, precio } = req.body;
    
    // Verificar si el detalle existe
    const [detalleExistente] = await pool.execute(
      'SELECT * FROM detalles_facturas WHERE id = ?',
      [req.params.id]
    );
    
    if (detalleExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Detalle no encontrado' });
    }
    
    const oldSubtotal = detalleExistente[0].subtotal;
    const oldCantidad = detalleExistente[0].cantidad;
    const oldPrecio = detalleExistente[0].precio;
    const factura_id = detalleExistente[0].factura_id;
    
    // Calcular nuevo subtotal
    const newCantidad = cantidad || oldCantidad;
    const newPrecio = precio || oldPrecio;
    const newSubtotal = newCantidad * newPrecio;
    
    // Actualizar detalle
    await pool.execute(
      'UPDATE detalles_facturas SET cantidad = ?, precio = ?, subtotal = ? WHERE id = ?',
      [newCantidad, newPrecio, newSubtotal, req.params.id]
    );
    
    // Actualizar el total de la factura
    await pool.execute(
      'UPDATE facturas SET total = total - ? + ? WHERE id = ?',
      [oldSubtotal, newSubtotal, factura_id]
    );
    
    // Obtener detalle actualizado
    const [detalleActualizado] = await pool.execute(
      'SELECT * FROM detalles_facturas WHERE id = ?',
      [req.params.id]
    );
    
    res.json(detalleActualizado[0]);
  } catch (error) {
    console.error('Error al actualizar detalle de factura:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Eliminar detalle de factura
app.delete('/detalles/:id', async (req, res) => {
  try {
    // Verificar si el detalle existe
    const [detalleExistente] = await pool.execute(
      'SELECT * FROM detalles_facturas WHERE id = ?',
      [req.params.id]
    );
    
    if (detalleExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Detalle no encontrado' });
    }
    
    const subtotal = detalleExistente[0].subtotal;
    const factura_id = detalleExistente[0].factura_id;
    
    // Eliminar detalle
    await pool.execute(
      'DELETE FROM detalles_facturas WHERE id = ?',
      [req.params.id]
    );
    
    // Actualizar el total de la factura
    await pool.execute(
      'UPDATE facturas SET total = total - ? WHERE id = ?',
      [subtotal, factura_id]
    );
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar detalle de factura:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor API REST iniciado en http://localhost:${PORT}`);
}); 