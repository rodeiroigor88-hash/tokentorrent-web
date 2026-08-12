/** Contenedores estilizados para los badges de App Store y Google Play (se activarán en el lanzamiento). */
export function StoreBadges() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Disponible pronto en</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div
          aria-label="App Store, disponible próximamente"
          className="flex h-14 w-44 items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 text-muted-foreground"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.79-.16 1.55-.83 2.94-.87 1.67.13 2.93.79 3.76 1.99-3.45 2.07-2.9 6.61.51 7.98-.63 1.66-1.45 3.31-2.29 3.07zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="text-left text-xs leading-tight">
            <span className="block text-[10px]">Próximamente</span>
            <span className="block font-semibold text-foreground/60">App Store</span>
          </span>
        </div>

        <div
          aria-label="Google Play, disponible próximamente"
          className="flex h-14 w-44 items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 text-muted-foreground"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3.6 1.8L13.7 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1zM14.9 13.2l2.6 2.6-11.3 6.4 8.7-9zM17.5 8.2l-2.6 2.6-8.7-9 11.3 6.4zM18.6 9.2l2.9 1.7c.9.5.9 1.7 0 2.2l-2.9 1.7-2.9-2.8 2.9-2.8z" />
          </svg>
          <span className="text-left text-xs leading-tight">
            <span className="block text-[10px]">Próximamente</span>
            <span className="block font-semibold text-foreground/60">Google Play</span>
          </span>
        </div>
      </div>
    </div>
  )
}
