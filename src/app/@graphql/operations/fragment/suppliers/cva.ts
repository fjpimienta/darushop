import gql from 'graphql-tag';

export const BRANDSCVA_FRAGMENT = gql`
  fragment BrandsCvaObject on ResponseBrandsCva {
    clave
    descripcion
  }
`;

export const GROUPSCVA_FRAGMENT = gql`
  fragment GroupsCvaObject on ResponseGroupsCva {
    grupo
  }
`;

export const SOLUCIONESCVA_FRAGMENT = gql`
  fragment SolucionesCvaObject on ResponseSolucionesCva {
    clave
    descripcion
  }
`;

export const SUCURSALESCVA_FRAGMENT = gql`
  fragment SucursalCvaObject on ResponseSucursalesCva {
    clave
    nombre
    cp
  }
`;

export const PAQUETERIASCVA_FRAGMENT = gql`
  fragment PaqueteriasCvaObject on ResponsePaqueteriasCva {
    clave
    descripcion
  }
`;

export const SHIPMENTS_CVA_RATES_FRAGMENT = gql`
  fragment ShippingCvaRatesObject on ResponseCvasShipping {
    result
    cotizacion {
      cajas
      subtotal
      iva
      montoTotal
    }
  }
`;

export const PRODUCTOSCVA_FRAGMENT = gql`
  fragment ProductosCvaObject on ResponseProductCva {
    clave
    upc
    codigo_fabricante
    descripcion
    solucion
    grupo
    marca
    garantia
    clase
    disponible
    precio
    moneda
    ficha_tecnica
    ficha_comercial
    imagen
    disponibleCD
    tipocambio
    fechaactualizatipoc
    TotalDescuento
    MonedaDescuento
    PrecioDescuento
    MonedaPrecioDescuento
    ClavePromocion
    DescripcionPromocion
    VencimientoPromocion
    DisponibleEnPromocion
    CEDIS_PROYECTO_IPN
    TALLER_PROYECTO_IPN
    VENTAS_ACAPULCO
    VENTAS_AGUASCALIENTES
    VENTAS_CAMPECHE
    VENTAS_CANCUN
    VENTAS_CHIHUAHUA
    VENTAS_COLIMA
    VENTAS_CUERNAVACA
    VENTAS_CULIACAN
    VENTAS_DF_TALLER
    VENTAS_DURANGO
    VENTAS_GUADALAJARA
    VENTAS_HERMOSILLO
    VENTAS_LEON
    VENTAS_MERIDA
    VENTAS_MONTERREY
    VENTAS_MORELIA
    VENTAS_OAXACA
    VENTAS_PACHUCA
    VENTAS_PUEBLA
    VENTAS_QUERETARO
    VENTAS_SAN_LUIS_POTOSI
    VENTAS_TAMPICO
    VENTAS_TEPIC
    VENTAS_TOLUCA
    VENTAS_TORREON
    VENTAS_TUXTLA
    VENTAS_VERACRUZ
    VENTAS_ZACATECAS
    ExsTotal
    dimensiones
    peso
  }
`;

export const ORDERCVA_FRAGMENT = gql`
  fragment OrderCvaObject on ResponseCvaOrder {
    error
    estado
    pedido
    total
    agentemail
    almacenmail
  }
`;
