import type { JSX } from 'solid-js'

type PageSectionProps = {
  title: string
  subtitle: string
  children: JSX.Element
}

export function PageSection(props: PageSectionProps) {
  return (
    <section class="grid gap-4">
      <header class="rounded-[1.8rem] border border-white/10 bg-white/8 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)] backdrop-blur-sm">
        <h1 class="text-2xl font-semibold tracking-tight text-(--color-fg)">{props.title}</h1>
        <p class="mt-2 text-sm leading-6 text-(--color-muted)">{props.subtitle}</p>
      </header>
      {props.children}
    </section>
  )
}
