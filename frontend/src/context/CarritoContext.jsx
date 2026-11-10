import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('carrito');
    return saved ? JSON.parse(saved) : [];
  });

  const addItem = (producto, talla, cantidad = 1) => {
    setItems(prevItems => {
      const existente = prevItems.find(
        item => item.producto_id === producto.id && item.talla_id === talla.id
      );

      let nuevosItems;
      if (existente) {
        nuevosItems = prevItems.map(item =>
          item.producto_id === producto.id && item.talla_id === talla.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        nuevosItems = [...prevItems, {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          talla_id: talla.id,
          talla: talla.talla,
          cantidad,
          imagen: producto.imagen_principal
        }];
      }

      localStorage.setItem('carrito', JSON.stringify(nuevosItems));
      return nuevosItems;
    });
  };

  const removeItem = (productoId, tallaId) => {
    setItems(prevItems => {
      const nuevosItems = prevItems.filter(
        item => !(item.producto_id === productoId && item.talla_id === tallaId)
      );
      localStorage.setItem('carrito', JSON.stringify(nuevosItems));
      return nuevosItems;
    });
  };

  const updateCantidad = (productoId, tallaId, cantidad) => {
    if (cantidad <= 0) {
      removeItem(productoId, tallaId);
      return;
    }

    setItems(prevItems => {
      const nuevosItems = prevItems.map(item =>
        item.producto_id === productoId && item.talla_id === tallaId
          ? { ...item, cantidad }
          : item
      );
      localStorage.setItem('carrito', JSON.stringify(nuevosItems));
      return nuevosItems;
    });
  };

  const limpiarCarrito = () => {
    setItems([]);
    localStorage.removeItem('carrito');
  };

  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  return (
    <CarritoContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateCantidad,
      limpiarCarrito,
      total,
      cantidad: items.length
    }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};
