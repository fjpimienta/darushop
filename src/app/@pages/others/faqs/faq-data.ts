import { Card, Accordion, AccordionGroup } from '../../elements/accordions/accordion-data';

const card1: Card = {
    title: '¿Cómo se entregará mi paquete?',
    body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. Aenean dignissim pellentesque felis. Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi. '
}

const card2: Card = {
    title: '¿Pago por la entrega',
    body: 'Ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. '
}

const card3: Card = {
    title: '¿Me cobrarán tasas de aduana?',
    body: 'Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. '
}

const card4: Card = {
    title: 'Mi artículo se ha vuelto defectuoso',
    body: 'Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. '
}

const card5: Card = {
    title: 'Seguimiento de mi pedido',
    body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum.'
}

const card6: Card = {
    title: 'No he recibido mi pedido',
    body: 'Ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. '
}

const card7: Card = {
    title: '¿Cómo puedo devolver un artículo?',
    body: 'Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. '
}

const card8: Card = {
    title: '¿Qué tipos de pago puedo utilizar?',
    body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum.'
}

const card9: Card = {
    title: '¿Puedo pagar con Tarjeta Regalo?',
    body: 'Ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. '
}

const card10: Card = {
    title: "No puedo hacer un pago",
    body: 'Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. '
}

const card11: Card = {
    title: "¿Se ha realizado mi pago?",
    body: 'Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. '
}

const faq1: Accordion = {
    adClass: 'accordion-rounded',
    cardAclass: "card-box card-sm bg-light",
    cards: [
        card1, card2, card3, card4
    ]
}

const faq2: Accordion = {
    adClass: 'accordion-rounded',
    cardAclass: "card-box card-sm bg-light",
    cards: [
        card5, card6, card7
    ]
}

const faq3: Accordion = {
    adClass: 'accordion-rounded',
    cardAclass: "card-box card-sm bg-light",
    cards: [
        card8, card9, card10, card11
    ]
}

export const faqGroups: AccordionGroup[] = [
    {
        title: 'Información de envío',
        items: [
            faq1
        ]
    },
    {
        title: 'Pedidos y Devoluciones',
        items: [
            faq2
        ]
    },
    {
        title: 'Pagos',
        items: [
            faq3
        ]
    }
]
