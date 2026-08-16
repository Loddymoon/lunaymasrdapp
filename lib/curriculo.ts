export interface Reto {
  id: string;
  letra: string;
  palabra: string;
  fraseDemo: string;
}

/* Curriculo de fonética placeholder (vocales + consonantes frecuentes en español
   infantil) — orden pensado para practicar sonidos fáciles primero. Las voces
   humanas reales (grabaciones) son contenido que el usuario aporta más adelante;
   hasta entonces se usa el mismo demo con speechSynthesis que ya usa el onboarding. */
export const CURRICULO: Reto[] = [
  { id: 'a', letra: 'A', palabra: 'Araña', fraseDemo: 'A. Araña.' },
  { id: 'e', letra: 'E', palabra: 'Elefante', fraseDemo: 'E. Elefante.' },
  { id: 'i', letra: 'I', palabra: 'Iguana', fraseDemo: 'I. Iguana.' },
  { id: 'o', letra: 'O', palabra: 'Oso', fraseDemo: 'O. Oso.' },
  { id: 'u', letra: 'U', palabra: 'Uva', fraseDemo: 'U. Uva.' },
  { id: 'm', letra: 'M', palabra: 'Mamá', fraseDemo: 'M. Mamá.' },
  { id: 'p', letra: 'P', palabra: 'Pato', fraseDemo: 'P. Pato.' },
  { id: 'l', letra: 'L', palabra: 'Luna', fraseDemo: 'L. Luna.' },
  { id: 's', letra: 'S', palabra: 'Sol', fraseDemo: 'S. Sol.' },
  { id: 't', letra: 'T', palabra: 'Tren', fraseDemo: 'T. Tren.' },
];
