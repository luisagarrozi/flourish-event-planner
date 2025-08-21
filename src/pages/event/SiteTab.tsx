import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, GripVertical, Globe, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

interface SiteTabProps {
  weddingId: string;
  brideName?: string | null;
  groomName?: string | null;
}

interface WeddingSite extends Tables<'wedding_sites'> {}
interface SiteSection extends Tables<'site_sections'> {}

export default function SiteTab({ weddingId, brideName, groomName }: SiteTabProps) {
  const [site, setSite] = useState<WeddingSite | null>(null);
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Generate default URL from names
  const generateDefaultUrl = () => {
    if (brideName && groomName) {
      const brideSlug = brideName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const groomSlug = groomName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return `${brideSlug}-e-${groomSlug}`;
    }
    return '';
  };

  const loadSiteData = async () => {
    try {
      // Load wedding site
      const { data: siteData } = await supabase
        .from('wedding_sites')
        .select('*')
        .eq('wedding_id', weddingId)
        .maybeSingle();

      if (siteData) {
        setSite(siteData);
        
        // Load sections
        const { data: sectionsData } = await supabase
          .from('site_sections')
          .select('*')
          .eq('site_id', siteData.id)
          .order('section_order');
        
        setSections(sectionsData || []);
      } else {
        // Create default site
        const defaultSite = {
          wedding_id: weddingId,
          site_url: generateDefaultUrl(),
          site_title: brideName && groomName ? `${brideName} & ${groomName}` : 'Nosso Casamento',
          published: false,
          theme_color: '#D4A574'
        };

        const { data: newSite } = await supabase
          .from('wedding_sites')
          .insert(defaultSite)
          .select()
          .single();

        if (newSite) {
          setSite(newSite);
          
          // Create default welcome section
          const { data: welcomeSection } = await supabase
            .from('site_sections')
            .insert({
              site_id: newSite.id,
              title: 'Bem-vindos ao nosso casamento',
              content: 'Estamos muito felizes em compartilhar este momento especial com vocês!',
              section_order: 0,
              section_type: 'content'
            })
            .select()
            .single();

          if (welcomeSection) {
            setSections([welcomeSection]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading site data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do site.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSiteData();
  }, [weddingId]);

  const updateSite = async (updates: Partial<WeddingSite>) => {
    if (!site) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('wedding_sites')
        .update(updates)
        .eq('id', site.id);

      if (error) throw error;

      setSite({ ...site, ...updates });
      toast({
        title: "Sucesso",
        description: "Site atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Error updating site:', error);
      toast({
        title: "Erro", 
        description: "Erro ao atualizar o site.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addSection = async () => {
    if (!site) return;

    try {
      const newSection = {
        site_id: site.id,
        title: 'Nova Seção',
        content: 'Conteúdo da seção...',
        section_order: sections.length,
        section_type: 'content'
      };

      const { data, error } = await supabase
        .from('site_sections')
        .insert(newSection)
        .select()
        .single();

      if (error) throw error;

      setSections([...sections, data]);
    } catch (error) {
      console.error('Error adding section:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar seção.",
        variant: "destructive"
      });
    }
  };

  const updateSection = async (sectionId: string, updates: Partial<SiteSection>) => {
    try {
      const { error } = await supabase
        .from('site_sections')
        .update(updates)
        .eq('id', sectionId);

      if (error) throw error;

      setSections(sections.map(s => s.id === sectionId ? { ...s, ...updates } : s));
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar seção.",
        variant: "destructive"
      });
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      const { error } = await supabase
        .from('site_sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;

      setSections(sections.filter(s => s.id !== sectionId));
      toast({
        title: "Sucesso",
        description: "Seção removida com sucesso!"
      });
    } catch (error) {
      console.error('Error deleting section:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover seção.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  const siteUrl = site?.site_url ? `${window.location.origin}/${site.site_url}` : '';

  return (
    <div className="space-y-6">
      {/* Site Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-brand" />
            Configuração do Site
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site-title">Título do Site</Label>
              <Input
                id="site-title"
                value={site?.site_title || ''}
                onChange={(e) => updateSite({ site_title: e.target.value })}
                placeholder="Ex: Maria & João"
              />
            </div>
            <div>
              <Label htmlFor="site-url">URL do Site</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                  /
                </span>
                <Input
                  id="site-url"
                  value={site?.site_url || ''}
                  onChange={(e) => updateSite({ site_url: e.target.value })}
                  placeholder="maria-e-joao"
                  className="rounded-l-none"
                />
              </div>
              {siteUrl && (
                <p className="text-sm text-muted-foreground mt-1">
                  Seu site estará em: <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="text-brand underline">{siteUrl}</a>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Site Publicado</Label>
              <p className="text-sm text-muted-foreground">
                {site?.published ? 'Seu site está público e visível para os convidados' : 'Seu site está em modo de rascunho'}
              </p>
            </div>
            <Switch
              checked={site?.published || false}
              onCheckedChange={(checked) => updateSite({ published: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Site Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Seções do Site</span>
            <Button onClick={addSection} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Seção
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sections.map((section) => (
            <Card key={section.id} className="border-l-4 border-l-brand">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className="font-medium"
                      placeholder="Título da seção"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSection(section.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <Textarea
                  value={section.content || ''}
                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                  placeholder="Conteúdo da seção..."
                  className="min-h-[100px]"
                />
                
                <div>
                  <Label htmlFor={`bg-image-${section.id}`}>URL da Imagem de Fundo (opcional)</Label>
                  <Input
                    id={`bg-image-${section.id}`}
                    value={section.background_image_url || ''}
                    onChange={(e) => updateSection(section.id, { background_image_url: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          
          {sections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma seção criada ainda.</p>
              <p className="text-sm">Clique em "Adicionar Seção" para começar.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gift List Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-brand" />
            Lista de Presentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            A lista de presentes será exibida em uma página separada acessível através do seu site.
          </p>
          <Button variant="outline" disabled>
            <Gift className="h-4 w-4 mr-2" />
            Gerenciar Lista de Presentes
            <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">Em breve</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}