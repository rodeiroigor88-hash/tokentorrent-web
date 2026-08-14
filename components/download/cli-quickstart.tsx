'use client'

import { useState } from 'react'

export function CliQuickstart() {
  const [copied, setCopied] = useState(false)

  const commands = `# 1. Clona el repositorio oficial
git clone https://github.com/rodeiroigor88-hash/AI-Torrent-Protocol.git
cd AI-Torrent-Protocol

# 2. Instala las dependencias
pip install -r requirements.txt

# 3. Inicia tu nodo worker en el enjambre
python -m src.worker --model gpt2`

  function copyCode() {
    navigator.clipboard.writeText(commands)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <span className="ml-2 font-mono text-xs text-muted-foreground">terminal / quickstart</span>
        </div>
        <button
          onClick={copyCode}
          type="button"
          className="rounded-lg border border-border/80 bg-background/80 px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          {copied ? '¡Copiado!' : 'Copiar comandos'}
        </button>
      </div>

      <pre className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">
        <code>
          <span className="text-muted-foreground/60"># 1. Clona el repositorio oficial</span>
          {'\n'}
          <span className="text-foreground">git clone https://github.com/rodeiroigor88-hash/AI-Torrent-Protocol.git</span>
          {'\n'}
          <span className="text-foreground">cd AI-Torrent-Protocol</span>
          {'\n\n'}
          <span className="text-muted-foreground/60"># 2. Instala las dependencias</span>
          {'\n'}
          <span className="text-foreground">pip install -r requirements.txt</span>
          {'\n\n'}
          <span className="text-muted-foreground/60"># 3. Inicia tu nodo worker en el enjambre</span>
          {'\n'}
          <span className="text-primary font-medium">python -m src.worker --model gpt2</span>
        </code>
      </pre>
    </div>
  )
}
