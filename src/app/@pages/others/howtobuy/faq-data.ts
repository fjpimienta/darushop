import { Card, Accordion, AccordionGroup } from '../../elements/accordions/accordion-data';

const card1: Card = {
  title: '¿Cómo seleccionar un producto?',
  body: 'Puedes seleccionar un producto navegando a través de las categorías en nuestra tienda en línea. Una vez que encuentres el producto que te interesa, puedes hacer clic en él para obtener más detalles y opciones de compra.'
};

const card2: Card = {
  title: '¿Cómo seleccionar el método de pago?',
  body: 'En el proceso de pago, después de agregar los productos a tu carrito, te dirigirás a la página de pago. Allí, podrás elegir entre diferentes métodos de pago, como tarjeta de crédito, OpenPay o transferencia bancaria. Simplemente selecciona el método de pago que prefieras y sigue las instrucciones para completar la transacción.'
};

const card3: Card = {
  title: '¿Cómo selecciono la paquetería de envío?',
  body: 'Durante el proceso de compra y pago, se te presentarán varias opciones de envío. Puedes seleccionar la paquetería y el tipo de envío que mejor se adapte a tus necesidades. Las opciones pueden incluir envío estándar, exprés u otras alternativas disponibles.'
};

const card4: Card = {
  title: '¿Dónde están mis productos para comprar?',
  body: 'Puedes explorar y encontrar nuestros productos en la sección de "Tienda" en nuestro sitio web. Aquí encontrarás una amplia gama de productos en diferentes categorías, desde electrónica hasta moda y más.'
};

const card5: Card = {
  title: '¿Puedo agregar más productos a mi carrito de compras?',
  body: 'Si aún no has terminado, puedes grega más productos a tu carrito para aprovechar al máximo tu compra. Puedes agregar tantos productos como necesites. Solo busca, encuentra y compra.'
};

const card6: Card = {
  title: '¿Puedo quitar productos a mi carrito de compras?',
  body: 'Sí, puedes administrar los productos en tu carrito de compras. En la página del carrito de compras, verás una lista de los productos que has agregado. Junto a cada producto, normalmente habrá una opción para eliminarlo del carrito. Solo tienes que hacer clic en esa opción para quitar el producto que ya no deseas comprar.'
};

const card7: Card = {
  title: '¿Cómo puedo pagar mis productos?',
  body: 'Ofrecemos varias opciones de pago para tu comodidad. Durante el proceso de pago, podrás elegir entre opciones como tarjeta de crédito, débito, PayPal o incluso pago en efectivo en algunos casos. Simplemente selecciona la opción de pago que prefieras y sigue las instrucciones para completar el pago de tus productos. '
};

const faq1: Accordion = {
  adClass: 'accordion-rounded',
  cardAclass: 'card-box card-sm bg-light',
  cards: [
    card1, card2, card3, card4, card5, card6, card7
  ]
};

export const faqGroups: AccordionGroup[] = [
  {
    title: 'Como Comprar en DARU?',
    items: [
      faq1
    ]
  }
];
