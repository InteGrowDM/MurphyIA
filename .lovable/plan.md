
## Plan: Optimizar Layout Mobile del HabitTrackerCard

### Problema Detectado

En la vista mobile, los 4 items de bienestar (Sueño, Estrés, Mareos, Tensión) muestran superposición visual entre:
- El botón de historial (icono de reloj)
- El texto "Toca para registrar"
- El chevron de navegación

Esto ocurre porque el grid `grid-cols-2` en mobile reduce el ancho disponible por celda, y el layout horizontal actual no se adapta correctamente.

---

### Solución Propuesta

Cambiar el layout interno de cada item para que en mobile sea **vertical (columna)** en lugar de horizontal, similar a como ya funciona en desktop.

---

### Cambios en HabitTrackerCard.tsx

**1. Modificar el layout del botón de cada item**

Cambiar de:
```tsx
className="flex md:flex-col items-center gap-3 md:gap-2 p-4 rounded-hig"
```

A layout vertical en ambos breakpoints:
```tsx
className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-hig"
```

**2. Reorganizar la estructura interna**

Layout actual (problemático en mobile):
```
┌───────────────────────────────────┐
│ [Icon] [Label+Value] [History] > │  ← Todo en línea horizontal
└───────────────────────────────────┘
```

Layout propuesto (consistente mobile/desktop):
```
┌─────────────────┐
│      [Icon]     │
│      Label      │
│  Toca/120/80    │
│   [History]     │  ← Botón debajo, integrado
└─────────────────┘
```

**3. Mover botón de historial dentro del flujo vertical**

- Remover el `ChevronRight` en mobile (no necesario en layout vertical)
- Posicionar el botón de historial debajo del texto de valor
- Hacer el botón más compacto con tamaño reducido

**4. Ajustar textos centrados**

- Cambiar `text-left md:text-center` a `text-center` siempre
- Reducir padding en mobile para mejor aprovechamiento del espacio

---

### Código Específico

```tsx
// Estructura del item actualizada
<button className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-hig ...">
  {/* Icon - siempre centrado arriba */}
  <div className="w-12 h-12 rounded-hig flex items-center justify-center shrink-0 ...">
    <Icon className="w-6 h-6" />
  </div>

  {/* Label & Value - centrado */}
  <div className="text-center w-full">
    <p className="font-medium text-hig-sm">{item.label}</p>
    <p className="text-hig-xs mt-0.5 truncate">
      {item.value || <><span className="action-text-adaptive" /> para registrar</>}
    </p>
  </div>

  {/* History button - abajo, compacto */}
  {onViewHistory && (
    <button
      onClick={(e) => { e.stopPropagation(); onViewHistory(...); }}
      className="p-1.5 rounded-full hover:bg-secondary/60 focus-ring"
      aria-label={`Ver historial de ${item.label}`}
    >
      <History className="w-3.5 h-3.5 text-muted-foreground/70" />
    </button>
  )}
</button>
```

---

### Beneficios

| Aspecto | Antes | Después |
|---------|-------|---------|
| Layout mobile | Horizontal (conflictos) | Vertical (consistente) |
| Visibilidad texto | Truncado/superpuesto | Completo y centrado |
| Botón historial | Superpuesto | Integrado debajo |
| Consistencia | Diferente mobile/desktop | Mismo en ambos |
| Touch target | Conflictos de tap | Áreas claras |

---

### Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/components/dashboard/HabitTrackerCard.tsx` | Reestructurar layout de items a vertical |

---

### Diseño Visual Final (Mobile)

```
┌─────────────────┬─────────────────┐
│       🌙        │       🧠        │
│     Sueño       │     Estrés      │
│  Toca registrar │  Toca registrar │
│      [🕐]       │      [🕐]       │
├─────────────────┼─────────────────┤
│       ✨        │       ❤️        │
│     Mareos      │     Tensión     │
│  Toca registrar │  Toca registrar │
│      [🕐]       │      [🕐]       │
└─────────────────┴─────────────────┘
```

---

### Nota Técnica

Se elimina el `ChevronRight` que solo aparecía en mobile (`md:hidden`) ya que:
1. Era redundante con el layout vertical
2. Causaba confusión visual con el botón de historial
3. El botón completo ya es clickeable para registrar
