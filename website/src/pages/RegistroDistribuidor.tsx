import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Upload, X, CheckCircle2, ChevronRight, ChevronLeft, Building2, User, FileImage } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

export default function RegistroDistribuidor() {
    const [step, setStep] = useState<Step>(1);

    const [formData, setFormData] = useState({
        // Paso 1: Datos Generales
        businessName: '',
        fullName: '',
        nationality: '',
        establishmentType: '',
        managerName: '',
        
        // Paso 2: Dirección y Contacto
        street: '',
        exteriorNumber: '',
        interiorNumber: '',
        betweenStreets: '',
        neighborhood: '',
        city: '',
        zipCode: '',
        businessPhone: '',
        whatsapp: '',
        addressReferences: '',
        workingHours: '',
        municipality: '',
        state: '',
        phone: '', // Teléfono de cliente
        email: '',
        socialMedia: '',
        
        // Paso 3: Detalles de Distribución y Archivos
        howDidYouHear: [] as string[],
        hasExperience: '',
        interests: [] as string[],
        message: '',
        shareDataConsent: false
    });

    const [files, setFiles] = useState<{
        idCard: File | null;
        photos: File[];
    }>({
        idCard: null,
        photos: []
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleNextStep = () => {
        // Validación básica por paso
        if (step === 1) {
            if (!formData.businessName || !formData.fullName || !formData.nationality || !formData.establishmentType || !formData.managerName) {
                setError('Por favor completa todos los campos obligatorios del paso 1.');
                return;
            }
        } else if (step === 2) {
            if (!formData.street || !formData.exteriorNumber || !formData.neighborhood || !formData.city || !formData.zipCode || !formData.state || !formData.email || !formData.phone) {
                setError('Por favor completa los campos de dirección y contacto marcados como obligatorios.');
                return;
            }
        } else if (step === 3) {
            if (!files.idCard) {
                setError('Debes subir una identificación oficial vigente.');
                return;
            }
            if (files.photos.length === 0) {
                setError('Debes subir al menos una fotografía de tu establecimiento.');
                return;
            }
            if (!formData.hasExperience) {
                setError('Por favor indícanos si tienes experiencia previa en el ramo.');
                return;
            }
        }
        
        setError('');
        setStep((prev) => (prev < 4 ? (prev + 1) as Step : prev));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevStep = () => {
        setError('');
        setStep((prev) => (prev > 1 ? (prev - 1) as Step : prev));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'idCard' | 'photos') => {
        const selectedFiles = e.target.files;
        if (!selectedFiles) return;

        if (type === 'idCard') {
            setFiles(prev => ({ ...prev, idCard: selectedFiles[0] }));
        } else {
            // Limitar a máximo 5 fotos
            const newPhotos = Array.from(selectedFiles);
            setFiles(prev => ({ 
                ...prev, 
                photos: [...prev.photos, ...newPhotos].slice(0, 5) 
            }));
        }
    };

    const removePhoto = (index: number) => {
        setFiles(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const uploadFile = async (file: File, folder: string): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('distributor_documents')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        // Obtain public URL
        const { data } = supabase.storage
            .from('distributor_documents')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Upload ID Card
            let idCardUrl = '';
            if (files.idCard) {
                idCardUrl = await uploadFile(files.idCard, 'id_cards');
            }

            // 2. Upload Photos
            const photosUrls: string[] = [];
            for (const photo of files.photos) {
                const url = await uploadFile(photo, 'establishment_photos');
                photosUrls.push(url);
            }

            // 3. Save to database
            const payload = {
                // Viejos campos requeridos por la estructura original / nuevos
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone, // Cliente Phone
                business_name: formData.businessName,
                city: formData.city,
                state: formData.state,
                has_experience: formData.hasExperience === 'yes',
                interests: formData.interests,
                message: formData.message,
                status: 'pending',
                
                // Nuevos campos
                nationality: formData.nationality,
                establishment_type: formData.establishmentType,
                manager_name: formData.managerName,
                street: formData.street,
                exterior_number: formData.exteriorNumber,
                interior_number: formData.interiorNumber || null,
                between_streets: formData.betweenStreets || null,
                neighborhood: formData.neighborhood,
                zip_code: formData.zipCode,
                business_phone: formData.businessPhone,
                whatsapp: formData.whatsapp || null,
                address_references: formData.addressReferences || null,
                working_hours: formData.workingHours,
                municipality: formData.municipality,
                social_media: formData.socialMedia || null,
                how_did_you_hear: formData.howDidYouHear,
                share_data_consent: formData.shareDataConsent,
                photos_urls: photosUrls,
                id_card_url: idCardUrl
            };

            const { error: dbError } = await supabase
                .from('distributor_applications')
                .insert([payload]);

            if (dbError) throw dbError;

            // Trigger email notification via Supabase Edge Function (Optional)
            try {
                await supabase.functions.invoke('send-email', {
                    body: {
                        type: 'distributor',
                        name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        business_name: formData.businessName,
                        city: formData.city,
                        state: formData.state,
                        message: formData.message
                    }
                });
            } catch (emailErr) {
                console.error("Error al disparar notificación de correo:", emailErr);
            }

            setSuccess(true);
            setStep(4);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Intenta nuevamente.';
            setError(`Hubo un error al enviar tu solicitud: ${errorMsg}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxArrayChange = (field: 'interests' | 'howDidYouHear', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(i => i !== value)
                : [...prev[field], value]
        }));
    };

    const establishmentTypes = ['Academia', 'Establecimiento', 'Otro'];
    const hearSources = ['Eventos', 'Cursos', 'Talleres', 'Tiendas', 'Folletos', 'Academia', 'Revistas', 'Internet'];

    if (success && step === 4) {
        return (
            <div className="min-h-screen bg-forest flex items-center justify-center px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-lg bg-white p-10 rounded-2xl shadow-xl border border-gold/20"
                >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="font-serif text-3xl text-forest mb-4">¡Solicitud Enviada Exitosamente!</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Gracias por tu interés en ser distribuidor J. Denis. Hemos recibido tu información y documentos completos.
                        Nuestro equipo revisará tu solicitud y te contactaremos en un plazo de 24-48 horas hábiles.
                    </p>
                    <Link to="/" className="btn bg-forest text-cream w-full py-4 text-center rounded-lg hover:bg-forest-light transition-colors">
                        Volver al Inicio
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                
                {/* Header Section */}
                <div className="text-center mb-10">
                    <span className="inline-block px-4 py-2 bg-gold/10 border border-gold/30 text-gold-dark text-sm font-medium rounded-full mb-4">
                        Formato de Compra Inicial
                    </span>
                    <h1 className="font-serif text-3xl md:text-5xl text-forest mb-4">
                        Registro de Distribuidor
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Completa este formato para unirte a nuestra red oficial. Asegúrate de tener a la mano una identificación oficial y fotografías de tu establecimiento.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded">
                            <motion.div 
                                className="h-full bg-gold rounded"
                                initial={{ width: "0%" }}
                                animate={{ width: `${((step - 1) / 2) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        
                        {[
                            { icon: User, label: "Generales" },
                            { icon: Building2, label: "Dirección" },
                            { icon: FileImage, label: "Documentos" }
                        ].map((s, i) => {
                            const stepNum = i + 1;
                            const isActive = step >= stepNum;
                            const Icon = s.icon;
                            
                            return (
                                <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${isActive ? 'bg-gold border-white text-white shadow-md' : 'bg-white border-gray-200 text-gray-400'}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-xs font-medium md:text-sm absolute -bottom-6 w-max ${isActive ? 'text-forest font-bold' : 'text-gray-400'}`}>
                                        {s.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-12 border border-gray-100">
                    <div className="p-6 md:p-10">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start gap-3">
                                <span>⚠️</span>
                                <p className="text-sm font-medium leading-relaxed">{error}</p>
                            </div>
                        )}

                        <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
                            
                            {/* PASO 1: DATOS GENERALES */}
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-serif text-forest border-b pb-3 mb-6">1. Datos Personales y del Establecimiento</h2>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo del cliente *</label>
                                            <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad *</label>
                                            <input type="text" required value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de su local o comercio *</label>
                                            <input type="text" required value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de establecimiento *</label>
                                            <select required value={formData.establishmentType} onChange={e => setFormData({...formData, establishmentType: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold">
                                                <option value="">Selecciona...</option>
                                                {establishmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la persona encargada de hacer pedidos *</label>
                                        <input type="text" required value={formData.managerName} onChange={e => setFormData({...formData, managerName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                    </div>
                                </motion.div>
                            )}

                            {/* PASO 2: DIRECCIÓN */}
                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-serif text-forest border-b pb-3 mb-6">2. Domicilio de su Establecimiento y Contacto</h2>
                                    
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Calle *</label>
                                            <input type="text" required value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Número exterior *</label>
                                            <input type="text" required value={formData.exteriorNumber} onChange={e => setFormData({...formData, exteriorNumber: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Número interior</label>
                                            <input type="text" value={formData.interiorNumber} onChange={e => setFormData({...formData, interiorNumber: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Entre qué calles está</label>
                                            <input type="text" value={formData.betweenStreets} onChange={e => setFormData({...formData, betweenStreets: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Colonia *</label>
                                            <input type="text" required value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
                                            <input type="text" required value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                                            <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alcaldía / Municipio *</label>
                                            <input type="text" required value={formData.municipality} onChange={e => setFormData({...formData, municipality: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                                            <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono del establecimiento *</label>
                                            <input type="tel" required value={formData.businessPhone} onChange={e => setFormData({...formData, businessPhone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp del negocio</label>
                                            <input type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Días y horario laborable del local *</label>
                                            <input type="text" required value={formData.workingHours} onChange={e => setFormData({...formData, workingHours: e.target.value})} placeholder="Lunes a Sábado 9am - 6pm" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Referencias adicionales a la dirección</label>
                                            <input type="text" value={formData.addressReferences} onChange={e => setFormData({...formData, addressReferences: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg mt-6">
                                        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Contacto Directo del Cliente</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Móvil (Celular) *</label>
                                                <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                                                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Página Web, Facebook, Instagram (Links)</label>
                                                <input type="text" value={formData.socialMedia} onChange={e => setFormData({...formData, socialMedia: e.target.value})} placeholder="@tucuenta, www.tusitio.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* PASO 3: DOCUMENTOS Y PERMISOS */}
                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-xl font-serif text-forest border-b pb-3 mb-6">3. Documentación y Encuesta</h2>
                                    
                                    {/* Encuestas */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-3">¿Medio por el cual se enteró de J. Denis?</label>
                                            <div className="flex flex-wrap gap-3">
                                                {hearSources.map(source => (
                                                    <label key={source} className={`px-4 py-2 rounded-full border cursor-pointer text-sm transition-colors ${formData.howDidYouHear.includes(source) ? 'bg-gold text-white border-gold font-medium' : 'bg-white text-gray-600 hover:border-gold'}`}>
                                                        <input type="checkbox" className="hidden" checked={formData.howDidYouHear.includes(source)} onChange={() => handleCheckboxArrayChange('howDidYouHear', source)} />
                                                        {source}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-3">¿Tienes experiencia en el ramo de belleza? *</label>
                                            <div className="flex gap-6">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" value="yes" checked={formData.hasExperience === 'yes'} onChange={e => setFormData({...formData, hasExperience: e.target.value})} className="accent-gold w-4 h-4" />
                                                    Sí
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" value="no" checked={formData.hasExperience === 'no'} onChange={e => setFormData({...formData, hasExperience: e.target.value})} className="accent-gold w-4 h-4" />
                                                    No, pero me interesa
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 mb-2">Intereses principales (comerciales)</label>
                                            <div className="flex flex-wrap gap-3">
                                                {['Productos', 'Cursos', 'Distribución', 'Todo'].map(interest => (
                                                    <label key={interest} className={`px-4 py-2 rounded border cursor-pointer text-sm transition-colors ${formData.interests.includes(interest) ? 'bg-forest/10 border-forest text-forest font-medium' : 'bg-white text-gray-600 hover:border-gray-400'}`}>
                                                        <input type="checkbox" className="hidden" checked={formData.interests.includes(interest)} onChange={() => handleCheckboxArrayChange('interests', interest)} />
                                                        {interest}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    {/* Carga de Archivos */}
                                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                        <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-2">
                                            <Upload className="w-5 h-5" /> Suba sus documentos 
                                        </h3>
                                        
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* ID Card */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-800 mb-2">1. Identificación oficial vigente (INE/Pasaporte) *</label>
                                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-white hover:border-gold transition-colors cursor-pointer relative">
                                                    <input 
                                                        type="file" 
                                                        accept="image/*,.pdf" 
                                                        onChange={(e) => handleFileChange(e, 'idCard')}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    {files.idCard ? (
                                                        <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                                                            <CheckCircle2 className="w-5 h-5" /> {files.idCard.name}
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-500 flex flex-col items-center">
                                                            <Upload className="w-6 h-6 mb-2 text-gray-400" />
                                                            <span className="text-sm">Clic para subir PDF o Imagen</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Photos */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-800 mb-2">2. Fotografías de su establecimiento *</label>
                                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-white hover:border-gold transition-colors cursor-pointer relative mb-3">
                                                    <input 
                                                        type="file" 
                                                        multiple
                                                        accept="image/*" 
                                                        onChange={(e) => handleFileChange(e, 'photos')}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <div className="text-gray-500 flex flex-col items-center">
                                                        <Upload className="w-6 h-6 mb-2 text-gray-400" />
                                                        <span className="text-sm">Subir imágenes (Máx 5)</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Image Previews */}
                                                {files.photos.length > 0 && (
                                                    <div className="grid grid-cols-5 gap-2 mt-2">
                                                        {files.photos.map((photo, index) => (
                                                            <div key={index} className="relative aspect-square rounded overflow-hidden group">
                                                                <img src={URL.createObjectURL(photo)} alt="preview" className="w-full h-full object-cover" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removePhoto(index)}
                                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X className="text-white w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Consent */}
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Permisos y Observaciones</h3>
                                        
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones / Comentarios adicionales</label>
                                            <textarea 
                                                rows={3}
                                                value={formData.message}
                                                onChange={e => setFormData({...formData, message: e.target.value})}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gold focus:border-gold resize-none"
                                            ></textarea>
                                        </div>

                                        <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                                            <input 
                                                type="checkbox" 
                                                className="mt-1 w-5 h-5 accent-gold cursor-pointer" 
                                                checked={formData.shareDataConsent}
                                                onChange={e => setFormData({...formData, shareDataConsent: e.target.checked})}
                                            />
                                            <span className="text-sm text-gray-700 leading-relaxed">
                                                Acepto que los datos de mi establecimiento se compartan con alumnas, estilistas y público en general cercanos a la zona de mi establecimiento, para que adquieran productos de la línea J. Denis. <br/><br/>
                                                <strong className="text-xs text-gray-500">J. Denis S.A. de C.V. es responsable del manejo de los datos personales. Se utilizarán para facturación y guías de envío. Confirmo que los datos asentados son correctos.</strong>
                                            </span>
                                        </label>
                                    </div>

                                </motion.div>
                            )}

                            {/* Acciones de Navegación del Formulario */}
                            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={handlePrevStep}
                                        disabled={loading}
                                        className="btn btn-outline flex items-center gap-2 px-6"
                                    >
                                        <ChevronLeft className="w-5 h-5" /> Atrás
                                    </button>
                                ) : (
                                    <div /> // Spacer
                                )}

                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="btn bg-forest hover:bg-forest-light text-white flex items-center gap-2 px-8"
                                    >
                                        Siguiente paso <ChevronRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn bg-gold hover:bg-gold-light text-forest font-bold flex items-center gap-2 px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                                                Enviando Datos y Archivos...
                                            </span>
                                        ) : (
                                            <>Finalizar y Enviar <CheckCircle2 className="w-5 h-5" /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
