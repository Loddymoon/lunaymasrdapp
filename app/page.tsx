'use client';

// Landing de HablaPronto — compuesta desde el kit de plantillas-codigo/landing/
// (copiado a components/landing/). Copy marcado trazado en docs/copy/landing.md.
// Modelo 2 (onboarding-first, 02C): el CTA lleva a /onboarding, no al checkout.

import { HelpCircle, CreditCard, ClipboardList, Volume2 } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';
import { HablaProntoLogo } from '@/components/shared/HablaProntoLogo';
import { DispositivoOwnable } from '@/components/shared/DispositivoOwnable';

const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Crear el plan gratis de mi hijo';

export default function LandingHablaPronto() {
  return (
    <div className="min-h-dvh text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* 1. HERO */}
      <Hero
        appName="HablaPronto"
        logo={<HablaProntoLogo size="small" />}
        loginHref="/login"
        h1Marked="Que tu hijo hable claro, [acento]5 minutos[/acento] al día"
        subtitleMarked="Retos diarios por la edad de tu hijo, con voces reales, sin cobros sorpresa."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={
          <span className="flex items-center justify-center gap-2">
            <DispositivoOwnable size={30} />
            Prueba gratis 7 días · cancela cuando quieras
          </span>
        }
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena familiar?"
        preguntas={[
          { icon: HelpCircle, textoMarked: '¿Te preguntas si tu hijo debería hablar más claro a esta edad?' },
          { icon: CreditCard, textoMarked: '¿Te ha pasado que una app te cobra sin avisarte?' },
          { icon: ClipboardList, textoMarked: '¿Odias llenar cuestionarios eternos antes de poder probar algo?' },
          { icon: Volume2, textoMarked: '¿Te molesta que una app de idiomas pronuncie mal las palabras?' },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          'Cada semana que pasa sin un método, la duda [b]crece[/b] en vez de resolverse.',
          'Otro video suelto en el celular no enseña — solo entretiene [acento]cinco minutos más[/acento].',
          'Mientras tanto, la ventana en la que más ayuda un estímulo diario sigue corriendo.',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Dudas si el ritmo de tu hijo es el esperado y no sabes por dónde empezar.',
          labelFuturo: 'En unos meses, si nada cambia',
          futuro: 'La misma duda — con menos tiempo de la ventana en la que más ayuda estimular.',
        }}
      />

      {/* 4. SOLUCIÓN */}
      <Solucion
        tituloMarked="El reto de hoy, listo en [acento]5 minutos[/acento]"
        mecanismo="el Método de los 5 Minutos"
        bigIdeaMarked="No necesitas ser experta en lenguaje: el Método elige el reto exacto para la edad de tu hijo y [b]tú solo lo acompañas jugando[/b]."
        pasos={[
          { titulo: 'Eliges la edad', detalle: 'Seleccionas la edad exacta de tu hijo, de 1 a 4 años.' },
          { titulo: 'Llega el reto del día', detalle: 'Un sonido o palabra nueva, con voces humanas reales.' },
          { titulo: 'Juegan juntos 5 minutos', detalle: 'Tu hijo repite, se divierte, y ves el progreso al momento.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Videos sueltos sin ningún método, y la duda de si están ayudando de verdad.',
          labelDespues: 'Después',
          despues: 'Un reto diario de 5 minutos, hecho para la edad exacta de tu hijo.',
        }}
      />

      {/* 5. LA APP POR DENTRO */}
      <AppPorDentro
        tituloMarked="Así se ve el reto de tu hijo [acento]cada día[/acento]"
        frames={[
          { src: '/carousel/frame1-bienvenida.png', label: 'Eliges la edad exacta de tu hijo', nombrePantalla: 'Bienvenida' },
          { src: '/carousel/frame2-reto.png', label: 'El reto fonético del día, con voces reales', nombrePantalla: 'Reto de hoy' },
          { src: '/carousel/frame3-celebracion.png', label: 'Cada logro se celebra al momento', nombrePantalla: 'Celebración' },
          { src: '/carousel/frame4-progreso.png', label: 'Revisas qué sonidos ya domina', nombrePantalla: 'Progreso' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 6. OFERTA — sin stack de valor: no hay bonos reales que ofrecer todavía */}
      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]menos de $0.09 al día[/acento]"
        trialDias={7}
        anual={{
          nombre: 'Anual',
          badge: 'MÁS POPULAR',
          precioMes: '$2.50',
          totalAnual: 'Se cobra $29.99/año',
          ahorro: '2 meses gratis',
          descomposicionDia: 'menos de $0.09 al día',
          ctaLabel: 'Empezar mis 7 días gratis',
          ctaHref: CTA_HREF,
          features: [
            'Un reto fonético nuevo cada día, por la edad de tu hijo',
            'Voces humanas reales, nunca robóticas',
            'Progreso visual de cada sonido que domina',
            'Aviso claro antes de cualquier cobro',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$4.99',
          ctaLabel: 'Elegir el plan mensual',
          ctaHref: CTA_HREF,
          features: [
            'Un reto fonético nuevo cada día, por la edad de tu hijo',
            'Voces humanas reales, nunca robóticas',
            'Progreso visual de cada sonido que domina',
            'Cancelas cuando quieras, sin trámites',
          ],
        }}
      />

      {/* 7. GARANTÍA — 14 días (FICHA-MERCADO §4: garantía > prueba de 7 días) */}
      <Garantia
        nombre="la Garantía HablaPronto"
        condicionMarked="Si en tus primeros 14 días HablaPronto no te sirve, escríbenos y te devolvemos todo. [b]Sin preguntas.[/b]"
        pisoLegal="Respaldada por la garantía de reembolso de Hotmart"
      />

      {/* 8. FAQ — las objeciones de FICHA-AVATAR.md, incluido el aviso clínico pedido explícitamente */}
      <Faq
        items={[
          {
            pregunta: '¿Me van a cobrar sin avisarme?',
            respuestaMarked:
              'No. Te avisamos por correo un día antes de que termine tu prueba gratis, con la fecha y el monto exactos. [b]Cancelas en un toque cuando quieras.[/b]',
          },
          {
            pregunta: '¿Las voces son robóticas?',
            respuestaMarked:
              'No: son voces humanas reales, grabadas en español neutro, para que tu hijo escuche una pronunciación clara desde el principio.',
          },
          {
            pregunta: '¿Mi hijo va a mantener la atención?',
            respuestaMarked:
              'Cada reto dura solo 5 minutos y está pensado para la edad exacta de tu hijo, así que encaja en su capacidad real de atención.',
          },
          {
            pregunta: '¿Esto reemplaza a un especialista del lenguaje?',
            respuestaMarked:
              'No. HablaPronto es apoyo para estimular el habla en casa — [b]no diagnostica ni trata ninguna condición[/b], y no reemplaza a un especialista.',
          },
          {
            pregunta: '¿Y si tengo gemelos o poco tiempo?',
            respuestaMarked:
              'Cada reto es de solo 5 minutos, así que puedes hacerlo con cada niño por separado o alternar días sin sentir que te quedas atrás.',
          },
        ]}
      />

      {/* 9. CTA FINAL */}
      <CtaFinal
        h2Marked="Ayuda a tu hijo a [acento]hablar claro[/acento]"
        futurePacingMarked="En unas semanas, ves a tu hijo repetir sonidos con más seguridad — y sabes exactamente qué está aprendiendo cada día."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Prueba gratis 7 días · Garantía de 14 días · Cancela cuando quieras"
        psMarked="PS: HablaPronto es el Método de los 5 Minutos para estimular el habla de tu hijo con voces reales, hecho para su edad exacta. Hoy entras con 7 días gratis y la Garantía HablaPronto de 14 días."
      />

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="HablaPronto"
        soporteEmail="soporte@hablapronto.com"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos y Condiciones', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
