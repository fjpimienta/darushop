import { EntityState } from '@ngrx/entity';

import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART,
  CLEAR_CART,
  REFRESH_STORE
} from '../constants/constants';

import { CartItem } from '@shared/classes/cart-item';

export interface CartItemState extends EntityState<CartItem> {
  data: CartItem[];
}

function getState(key: string): any {
  const initialState = {
    data: []
  };
  const localStorag = localStorage.getItem(key);
  if (localStorag && JSON.parse(localStorag) && JSON.parse(localStorag).cart && JSON.parse(localStorag).cart.data && JSON.parse(localStorag).cart.data.length > 0) {
    const cartData = JSON.parse(localStorage.getItem(key)).cart.data;
    for (let i = 0; i < cartData.length; i++) {
      const item = cartData[i];
      const fecha = new Date(item.fecha);
      const fechaActual = new Date();
      //fecha.setDate(fecha.getDate() - 1);
      const diferenciaEnMilisegundos = fechaActual.getTime() - fecha.getTime();
      const diferenciaEnHoras = diferenciaEnMilisegundos / (1000 * 60 * 60);
      const haPasadoMasDe10Horas = diferenciaEnHoras > 10;
      if (haPasadoMasDe10Horas) {
        console.log("Ha pasado más de 10 horas");
        const storageValue = localStorage.getItem(key);
        const cartData = storageValue ? JSON.parse(storageValue).cart.data : [];
        function eliminarItemPorId(id: string): void {
          const indice = cartData.findIndex((item: any) => item.id === id);
          if (indice !== -1) {
            cartData.splice(indice, 1); // Elimina 1 elemento en el índice encontrado
          }
        }
        eliminarItemPorId(item.id);
        localStorage.setItem(key, JSON.stringify({ ...JSON.parse(storageValue), cart: { data: cartData } }));
      }
    }
  }

  return (localStorage.getItem(key) && JSON.parse(localStorage.getItem(key)).cart)
    ? JSON.parse(localStorage.getItem(key)).cart
    : initialState;
}

export function cartReducer(state = getState('molla'), action): any {
  const fecha = new Date(Date.now());
  switch (action.type) {
    case ADD_TO_CART:
      let findIndex = state.data.findIndex(item => item.id === action.payload.product.id);
      const qty = action.payload.qty ? action.payload.qty : 1;
      if (findIndex !== -1 && action.payload.product.variants.length > 0) {
        findIndex = state.data.findIndex(item => item.name === action.payload.product.name);
      }

      if (findIndex !== -1) {
        return {
          data: [
            ...state.data.reduce((acc, product, index) => {
              if (findIndex === index) {
                acc.push({
                  ...product,
                  qty: product.qty + qty,
                  sum: (action.payload.product.sale_price
                    ? action.payload.product.sale_price
                    : action.payload.product.price) * (product.qty + qty),
                  fecha: fecha
                });
              } else {
                acc.push(product);
              }
              return acc;
            }, [])
          ]
        };
      } else {
        return {
          data: [
            ...state.data,
            {
              ...action.payload.product,
              qty,
              price: action.payload.product.sale_price ? action.payload.product.sale_price : action.payload.product.price,
              sum: qty * (action.payload.product.sale_price ? action.payload.product.sale_price : action.payload.product.price),
              fecha: fecha
            }
          ]
        };
      }

    case REMOVE_FROM_CART:
      return {
        data: [
          ...state.data.filter(item => {
            if (item.id !== action.payload.product.id) { return true; }
            if (item.name !== action.payload.product.name) { return true; }
            return false;
          })
        ]
      };

    case UPDATE_CART:
      return {
        data: [
          ...action.payload.cartItems
        ]
      };

    case CLEAR_CART:
      return { data: [] };


    case REFRESH_STORE:
      return { data: [] };

    default:
      return state;
  }
}
