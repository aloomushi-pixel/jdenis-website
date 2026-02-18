export default function AvisoPrivacidad() {
    return (
        <div className="bg-cream min-h-screen">
            {/* Hero */}
            <section className="bg-forest py-20">
                <div className="container-luxury text-center">
                    <h1 className="font-serif text-4xl md:text-5xl text-cream mb-4">
                        Aviso de Privacidad
                    </h1>
                    <div className="w-16 h-px bg-gold mx-auto" />
                </div>
            </section>

            {/* Content */}
            <section className="container-luxury py-16 max-w-3xl mx-auto">
                <div className="prose prose-lg text-forest/80 leading-relaxed space-y-6">
                    <p>
                        <strong>J.J. Denis S.A. de C.V. (J Denis)</strong> es responsable del tratamiento de sus datos
                        personales con domicilio en Huehuecalotl Mz. 57 Lt. 07 S/N Col. Santa Isabel Tola,
                        Del. Gustavo A. Madero, México D.F. C.P. 07010.
                    </p>

                    <p>
                        Los datos que le solicitamos y que tenemos en nuestro poder serán utilizados para las
                        finalidades señaladas en el presente aviso de privacidad, podemos recabar sus datos
                        personales de distintas formas: cuando usted nos lo proporciona directamente, cuando
                        visita nuestro sitio de internet o utiliza servicios en línea y cuando obtenemos
                        información a través de otras fuentes que están permitidas por la ley.
                    </p>

                    <h2 className="font-serif text-2xl text-forest mt-10 mb-4">
                        Datos recabados directamente
                    </h2>
                    <p>
                        Recabamos sus datos personales de forma directa cuando usted mismo nos los proporciona
                        por diversos medios, como cuando participa en nuestras promociones, ferias, expos o
                        nos da información con objeto de que le prestemos un servicio (como la facturación de
                        nuestros productos). Los datos que obtendremos por este medio pueden ser, entre otros:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-forest/70">
                        <li>Razón social o en su caso nombre completo</li>
                        <li>Dirección fiscal completa</li>
                        <li>Teléfonos de contacto</li>
                        <li>Correo electrónico</li>
                        <li>Página web</li>
                    </ul>

                    <h2 className="font-serif text-2xl text-forest mt-10 mb-4">
                        Datos recabados en línea
                    </h2>
                    <p>
                        Datos personales que recabaremos cuando visita nuestro sitio de internet o utiliza
                        nuestros servicios en línea:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-forest/70">
                        <li>Razón social o en su caso nombre completo</li>
                        <li>Dirección fiscal completa</li>
                        <li>Teléfonos de contacto</li>
                        <li>Correo electrónico</li>
                    </ul>

                    <h2 className="font-serif text-2xl text-forest mt-10 mb-4">
                        Datos de otras fuentes
                    </h2>
                    <p>
                        Podemos obtener información de usted de otras fuentes permitidas por la ley, tales
                        como directorios telefónicos, directorios de expos y ferias. Los datos que obtendremos
                        por estos medios pueden ser, entre otros:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-forest/70">
                        <li>Razón social o en su caso nombre completo</li>
                        <li>Dirección fiscal completa</li>
                        <li>Teléfonos de contacto</li>
                        <li>Correo electrónico</li>
                        <li>Página web</li>
                    </ul>

                    <h2 className="font-serif text-2xl text-forest mt-10 mb-4">
                        Mensajes promocionales
                    </h2>
                    <p>
                        Si usted desea dejar de recibir mensajes promocionales de nuestra parte puede
                        solicitarlo a través del correo electrónico{' '}
                        <a
                            href="mailto:contacto@jdenis.com.mx"
                            className="text-gold hover:underline"
                        >
                            contacto@jdenis.com.mx
                        </a>.
                    </p>

                    <h2 className="font-serif text-2xl text-forest mt-10 mb-4">
                        Transferencia de datos
                    </h2>
                    <p>
                        J Denis podrá transferir sus datos personales para promover sus servicios como
                        profesional de la belleza entre sus clientes, si así usted lo autoriza por escrito.
                    </p>
                </div>
            </section>
        </div>
    );
}
