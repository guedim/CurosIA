/**
 * Re-export del cliente Drizzle con tipado del schema.
 * Las páginas del App Router deben importar desde aquí, no desde @platzi-fc/db directamente,
 * para centralizar el punto de acceso y poder añadir logging/tracing si hace falta.
 */
export { getDb } from '@platzi-fc/db';
export * as schema from '@platzi-fc/db';
