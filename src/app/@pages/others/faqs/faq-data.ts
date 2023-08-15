import { Card, Accordion, AccordionGroup } from '../../elements/accordions/accordion-data';

const card1: Card = {
    title: '¿Cómo se entregará mi paquete?',
    body: 'Utilizamos servicios de paquetería confiables para la entrega de tus productos. Puedes elegir entre diferentes opciones de envío, como envío estándar, exprés o urgente, según tus necesidades.'
}

const card2: Card = {
    title: '¿Pago por la entrega?',
    body: 'Los cargos de envío pueden variar según la opción de envío que elijas y la ubicación de entrega. Al realizar tu compra, se te mostrará el costo total, incluidos los cargos de envío.'
}

const card3: Card = {
    title: '¿Me cobrarán tasas de aduana?',
    body: 'Las tasas de aduana pueden aplicarse según las leyes y regulaciones de importación de tu país. Estas tasas son responsabilidad del cliente y pueden variar. Te recomendamos consultar con las autoridades aduaneras locales para obtener información precisa.'
}

const card4: Card = {
    title: 'Mi artículo se ha vuelto defectuoso',
    body: 'Lamentamos la situación. Si tu artículo llega defectuoso, por favor contáctanos de inmediato. Procederemos con el reemplazo o reembolso según nuestras políticas de devolución.'
}

const card5: Card = {
    title: 'Seguimiento de mi pedido',
    body: 'Puedes realizar un seguimiento de tu pedido en línea utilizando el número de seguimiento que te proporcionamos. Ingresa este número en la sección de seguimiento en nuestro sitio web.'
}

const card6: Card = {
    title: 'No he recibido mi pedido',
    body: 'Si no has recibido tu pedido en el tiempo estimado, por favor contáctanos. Te ayudaremos a rastrear el envío y resolver cualquier problema.'
}

const card7: Card = {
    title: '¿Cómo puedo devolver un artículo?',
    body: 'Si deseas devolver un artículo, consulta nuestra política de devoluciones en nuestro sitio web. Allí encontrarás instrucciones detalladas sobre cómo iniciar el proceso de devolución.'
}

const card8: Card = {
    title: '¿Qué tipos de pago puedo utilizar?',
    body: 'Aceptamos una variedad de métodos de pago, incluyendo tarjetas de crédito y débito, PayPal y otros métodos de pago en línea. La lista completa de métodos de pago se muestra durante el proceso de pago.'
}

const card9: Card = {
    title: '¿Puedo pagar con Tarjeta Regalo?',
    body: 'No, por el momento no puedes usar una Tarjeta Regalo válida para pagar tus compras. pr&oacuete;ximamente, habrá una opción para ingresar el número de tu Tarjeta Regalo.'
}

const card10: Card = {
    title: "No puedo hacer un pago",
    body: 'Si estás teniendo problemas para realizar un pago, asegúrate de que los detalles de pago sean correctos. Si el problema persiste, comunícate con nuestro equipo de atención al cliente para obtener ayuda.'
}

const card11: Card = {
    title: "¿Se ha realizado mi pago?",
    body: 'Después de realizar un pago, recibirás una confirmación por correo electrónico. Si tienes dudas sobre si el pago se ha procesado correctamente, contáctanos y te proporcionaremos la información necesaria.'
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
