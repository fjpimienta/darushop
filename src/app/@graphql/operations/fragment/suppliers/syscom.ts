import gql from 'graphql-tag';

export const ORDER_RESPONSE_SYSCOM_FRAGMENT = gql`
  fragment OrderResponseSyscomObject on OrderResponseSyscom {
    error
    cliente {
      num_cliente
      rfc
      whatsapp
      email
      telefono
      direccion {
        calle
        num_exterior
        num_interior
        colonia
        ciudad
        estado
        pais
      }
    }
    resumen {
      peso_total
      peso_vol_total
      moneda
      forma_pago
      tipo_cambio
      plazo
      codigo_pago
      folio
      folio_pedido
      fecha_creacion
      iva_aplicado
    }
    datos_entrega {
      calle
      num_exterior
      num_interior
      colonia
      ciudad
      estado
      pais
    }
    productos {
      id
      cantidad
      tipo
      modelo
      titulo
      marca
      link
      imagen
      precio_lista
      precio_oferta
      precio_unitario
      importe
      descuentos {
        distribucion
        clasificacion
        volumen
        financiero
      }
    }
    totales {
      subtotal
      flete
      iva
      total
    }
  }
`;
