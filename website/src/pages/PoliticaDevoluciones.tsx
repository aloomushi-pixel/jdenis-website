import { useEffect } from 'react';

export default function PoliticaDevoluciones() {
    useEffect(() => {
        document.title = 'Política de Cambios y Devoluciones | J. Denis México';
    }, []);

    return (
        <div className="bg-cream min-h-screen">
            {/* Hero */}
            <section className="bg-forest py-20">
                <div className="container-luxury text-center">
                    <h1 className="font-serif text-4xl md:text-5xl text-cream mb-4">
                        Política de Cambios y Devoluciones
                    </h1>
                    <div className="w-16 h-px bg-gold mx-auto" />
                </div>
            </section>

            {/* Content */}
            <section className="container-luxury py-16 max-w-3xl mx-auto">
                <div className="prose prose-lg text-forest/80 leading-relaxed space-y-6">
                    <p>
                        En <strong>J. Denis</strong> nos esforzamos por mantener altos estándares de calidad en todos
                        nuestros productos e insumos cosméticos profesionales. La presente política describe los
                        lineamientos generales aplicables a solicitudes de revisión, cambio o devolución de pedidos
                        realizados a través de nuestros canales oficiales.
                    </p>

                    <h2 className="font-serif text-2xl text-forest mt-10 mb-4">
                        1. Disposiciones Generales
                    </h2>
                    <p>
                        Debido a la naturaleza higiénica, cosmética y de uso profesional de nuestros productos, toda
                        solicitud de cambio o devolución está sujeta a una evaluación previa por parte de nuestro
                        equipo de atención a clientes, conforme a las características específicas de cada pedido y
                        lote de producto.
                    </p>

                    <h2 className="font-serif text-2xl text-forest mt-10 mb-4">
                        2. Condiciones de Revisión
                    </h2>
                    <p>
                        Para que una solicitud pueda ser canalizada a revisión, de manera enunciativa más no
                        limitativa, se tomarán en cuenta los siguientes criterios generales:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-forest/70">
                        <li>
                            Contar con el comprobante de compra o número de pedido correspondiente.
                        </li>
                        <li>
                            El producto deberá conservar su empaque original, sellos de seguridad íntegros y no
                            presentar señales de uso, apertura o alteración.
                        </li>
                        <li>
                            En caso de incidencias derivadas del traslado o defectos de origen, será necesario
                            proporcionar evidencia visual al momento de la recepción del paquete para su valoración.
                        </li>
                    </ul>

                    <h2 className="font-serif text-2xl text-forest mt-10 mb-4">
                        3. Artículos de Uso Cosmético e Higiene
                    </h2>
                    <p>
                        Por razones de bioseguridad, salud e higiene, los productos cosméticos, químicos, pigmentos,
                        adhesivos o insumos cuyos sellos hayan sido abiertos o manipulados, así como artículos en
                        promoción, liquidación o pedidos especiales, podrían no ser elegibles para cambios o
                        devoluciones, salvo determinación expresa del área de calidad tras el análisis del caso.
                    </p>

                    <h2 className="font-serif text-2xl text-forest mt-10 mb-4">
                        4. Proceso de Solicitud y Contacto
                    </h2>
                    <p>
                        Cada caso es atendido de manera individual para brindar una solución adecuada según
                        corresponda. Para iniciar una consulta o reportar cualquier incidencia relacionada con su
                        pedido, por favor comuníquese con nuestro equipo de atención indicando su número de orden a
                        través de cualquiera de nuestros medios de contacto:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-forest/70">
                        <li>
                            <strong>Correo electrónico:</strong>{' '}
                            <a href="mailto:hola@jdenis.com" className="text-gold hover:underline">
                                hola@jdenis.com
                            </a>{' '}
                            /{' '}
                            <a href="mailto:contacto@jdenis.com.mx" className="text-gold hover:underline">
                                contacto@jdenis.com.mx
                            </a>
                        </li>
                        <li>
                            <strong>Atención vía WhatsApp:</strong>{' '}
                            <a
                                href="https://wa.me/525527271067"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold hover:underline"
                            >
                                +52 55 2727 1067
                            </a>
                        </li>
                    </ul>

                    <p className="text-sm text-forest/60 pt-6 border-t border-forest/10">
                        J. Denis se reserva el derecho de actualizar o precisar los presentes lineamientos en
                        cualquier momento para adecuarlos a sus procesos operativos vigentes.
                    </p>
                </div>
            </section>
        </div>
    );
}
