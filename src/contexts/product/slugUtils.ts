
import { supabase } from '@/integrations/supabase/client';

/**
 * Converte um texto para um formato de slug
 * (lowercase, sem acentos, espaços substituídos por hífens, sem caracteres especiais)
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .normalize('NFD')                   // Normaliza caracteres com acentos
    .replace(/[\u0300-\u036f]/g, '')   // Remove os acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')              // Substitui espaços por hífens
    .replace(/[^\w-]+/g, '')           // Remove caracteres que não são palavras ou hífens
    .replace(/--+/g, '-');             // Remove hífens múltiplos
};

/**
 * Gera um slug único baseado no nome do produto
 * Versão síncrona - para uso local
 */
export const generateLocalSlug = (name: string, existingProducts: { slug: string }[]): string => {
  let baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  
  // Verifica se o slug já existe e adiciona um sufixo numérico se necessário
  while (existingProducts.some(p => p.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

/**
 * Gera um slug único baseado no nome do produto
 * Versão assíncrona - para uso com a API
 */
export const generateSlug = async (name: string): Promise<string> => {
  let baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;
  
  // Verifica se o slug já existe e adiciona um sufixo numérico se necessário
  while (!isUnique) {
    const { data } = await supabase
      .from('products')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle();
    
    if (!data) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }
  
  return slug;
};
