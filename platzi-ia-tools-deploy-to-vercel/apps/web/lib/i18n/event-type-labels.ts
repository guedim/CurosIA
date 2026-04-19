import type { CommunityEventTipo } from '@/types';
import type { Dictionary } from './index';

/**
 * Genera el mapa `CommunityEventTipo → label traducido` a partir del
 * diccionario actual. El `Record` completo fuerza exhaustividad: si se añade
 * un nuevo tipo al dominio y se olvida traducir, TS falla aquí.
 */
export function buildEventTypeLabels(dict: Dictionary): Record<CommunityEventTipo, string> {
  const el = dict.fans.events;
  return {
    puertas_abiertas: el.typePuertasAbiertas,
    firma_autografos: el.typeFirmaAutografos,
    clinic: el.typeClinic,
    solidario: el.typeSolidario,
    encuentro_aficion: el.typeEncuentroAficion,
  };
}
