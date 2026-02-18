import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Newspaper, Loader } from 'lucide-react';
import { getNewsPost, type BlogPost } from '../lib/supabase';

export default function NewsPost() {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!slug) return;
        const loadPost = async () => {
            try {
                setLoading(true);
                const data = await getNewsPost(slug);
                setPost(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-cream pt-32 px-4">
                <div className="container-luxury text-center">
                    <Newspaper className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
                    <h1 className="font-serif text-3xl text-forest mb-4">Noticia no encontrada</h1>
                    <p className="text-charcoal/60 mb-8">La noticia que buscas no existe o no está disponible.</p>
                    <Link to="/blog" className="btn btn-primary">
                        ← Volver al Blog
                    </Link>
                </div>
            </div>
        );
    }

    const publishedDate = post.published_at
        ? new Date(post.published_at).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        : '';

    // Simple markdown-to-HTML: headings, bold, italic, lists, paragraphs
    const renderMarkdown = (md: string) => {
        const lines = md.split('\n');
        const elements: React.ReactNode[] = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            // Headings
            if (line.startsWith('### ')) {
                elements.push(<h3 key={i} className="font-serif text-xl text-forest mt-8 mb-3">{line.slice(4)}</h3>);
            } else if (line.startsWith('## ')) {
                elements.push(<h2 key={i} className="font-serif text-2xl text-forest mt-10 mb-4">{line.slice(3)}</h2>);
            } else if (line.startsWith('# ')) {
                elements.push(<h1 key={i} className="font-serif text-3xl text-forest mt-10 mb-4">{line.slice(2)}</h1>);
            }
            // List items
            else if (line.startsWith('- ') || line.startsWith('* ')) {
                const listItems: string[] = [];
                while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
                    listItems.push(lines[i].slice(2));
                    i++;
                }
                elements.push(
                    <ul key={`list-${i}`} className="list-disc list-inside space-y-2 my-4 text-charcoal/80">
                        {listItems.map((item, j) => <li key={j}>{formatInline(item)}</li>)}
                    </ul>
                );
                continue; // skip the i++ at bottom
            }
            // Empty line
            else if (line.trim() === '') {
                // skip
            }
            // Paragraph
            else {
                elements.push(
                    <p key={i} className="text-charcoal/80 leading-relaxed mb-4">
                        {formatInline(line)}
                    </p>
                );
            }

            i++;
        }

        return elements;
    };

    const formatInline = (text: string): React.ReactNode => {
        // Bold and italic
        const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-semibold text-forest">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={i}>{part.slice(1, -1)}</em>;
            }
            return part;
        });
    };

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero */}
            <section className="relative pt-24 pb-0 bg-forest overflow-hidden">
                <div className="absolute inset-0 botanical-pattern opacity-20" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                <div className="container-luxury relative z-10 pb-12">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-cream/60 hover:text-gold transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Blog
                    </Link>

                    {post.tag && (
                        <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-gold to-gold-light text-forest text-xs font-bold tracking-wider uppercase mb-4">
                            {post.tag}
                        </span>
                    )}

                    <h1 className="font-serif text-3xl md:text-5xl text-cream mb-4 max-w-4xl leading-tight">
                        {post.title}
                    </h1>

                    {publishedDate && (
                        <div className="flex items-center gap-2 text-cream/50 text-sm">
                            <Clock className="w-4 h-4" />
                            {publishedDate}
                        </div>
                    )}
                </div>

                {/* Featured Image */}
                {post.featured_image && (
                    <div className="relative w-full max-w-5xl mx-auto px-4">
                        <div className="aspect-video overflow-hidden rounded-t-lg shadow-2xl">
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* Content */}
            <section className="section section-cream">
                <div className="container-luxury">
                    <div className="max-w-3xl mx-auto">
                        {post.excerpt && (
                            <p className="text-lg text-charcoal/70 leading-relaxed mb-8 pb-8 border-b border-kraft/30 italic">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="prose-jdenis">
                            {renderMarkdown(post.content)}
                        </div>
                    </div>
                </div>
            </section>

            {/* Back CTA */}
            <section className="section section-kraft">
                <div className="container-luxury text-center">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-forest text-cream font-medium hover:bg-forest-light transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Ver más noticias y artículos
                    </Link>
                </div>
            </section>
        </div>
    );
}
