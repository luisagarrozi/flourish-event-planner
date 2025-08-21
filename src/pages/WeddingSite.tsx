import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

interface WeddingSite extends Tables<'wedding_sites'> {}
interface SiteSection extends Tables<'site_sections'> {}
interface Wedding extends Tables<'weddings'> {}

export default function WeddingSite() {
  const { siteUrl } = useParams();
  const [site, setSite] = useState<WeddingSite | null>(null);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadSite = async () => {
      if (!siteUrl) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Load published wedding site
        const { data: siteData, error: siteError } = await supabase
          .from('wedding_sites')
          .select('*')
          .eq('site_url', siteUrl)
          .eq('published', true)
          .maybeSingle();

        if (siteError || !siteData) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setSite(siteData);

        // Load wedding details
        const { data: weddingData } = await supabase
          .from('weddings')
          .select('*')
          .eq('id', siteData.wedding_id)
          .maybeSingle();

        if (weddingData) {
          setWedding(weddingData);
        }

        // Load sections
        const { data: sectionsData } = await supabase
          .from('site_sections')
          .select('*')
          .eq('site_id', siteData.id)
          .order('section_order');

        setSections(sectionsData || []);
      } catch (error) {
        console.error('Error loading wedding site:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadSite();
  }, [siteUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-brand/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-charcoal-soft">Carregando...</p>
        </div>
      </div>
    );
  }

  if (notFound || !site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-brand/10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Site não encontrado</h1>
          <p className="text-charcoal-soft">Este site de casamento não existe ou não está publicado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-brand/10">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-brand/20 to-brand/5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-charcoal mb-6">
            {site.site_title}
          </h1>
          {wedding?.wedding_date && (
            <p className="text-xl md:text-2xl text-charcoal-soft mb-8">
              {new Date(wedding.wedding_date).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
          {wedding?.venue && (
            <p className="text-lg text-charcoal-soft">
              📍 {wedding.venue}
            </p>
          )}
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {sections.map((section, index) => (
          <section
            key={section.id}
            className={`py-12 ${index > 0 ? 'border-t border-charcoal-soft/20' : ''}`}
            style={{
              backgroundImage: section.background_image_url
                ? `url(${section.background_image_url})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div 
              className={`${
                section.background_image_url 
                  ? 'bg-white/90 backdrop-blur-sm rounded-lg p-8' 
                  : ''
              }`}
            >
              <h2 className="text-3xl font-bold text-charcoal mb-6 text-center">
                {section.title}
              </h2>
              <div className="prose prose-lg max-w-none text-charcoal-soft">
                {section.content?.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 text-center">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ))}

        {sections.length === 0 && (
          <section className="py-12 text-center">
            <p className="text-charcoal-soft">Este site ainda está sendo preparado...</p>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-charcoal text-cream py-8 px-4 text-center">
        <p className="text-sm">
          Criado com 💝 para {site.site_title}
        </p>
      </footer>
    </div>
  );
}