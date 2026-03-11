import type { InGameRoute } from '@/shared/routes'
import type { JSX } from 'solid-js'

type IconProps = {
  class?: string
}

type TabIconRoute = InGameRoute | 'settings'

export const gameTabIcons: Record<TabIconRoute, (props: IconProps) => JSX.Element> = {
  party: PartyIcon,
  round: RoundIcon,
  results: ResultsIcon,
  history: HistoryIcon,
  settings: SettingsIcon,
}

function BaseIcon(props: IconProps & { children: JSX.Element }) {
  return (
    <svg
      aria-hidden="true"
      class={props.class}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {props.children}
    </svg>
  )
}

function PartyIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="7.25" y="7.25" width="9.5" height="9.5" rx="2.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="12" cy="4.9" r="1.9" stroke="currentColor" stroke-width="1.8" />
      <circle cx="19.1" cy="12" r="1.9" stroke="currentColor" stroke-width="1.8" />
      <circle cx="12" cy="19.1" r="1.9" stroke="currentColor" stroke-width="1.8" />
      <circle cx="4.9" cy="12" r="1.9" stroke="currentColor" stroke-width="1.8" />
    </BaseIcon>
  )
}

function RoundIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M8 4.75H14.6L18.75 8.9V17C18.75 18.24 17.74 19.25 16.5 19.25H8C6.76 19.25 5.75 18.24 5.75 17V7C5.75 5.76 6.76 4.75 8 4.75Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M14.5 4.9V8.6H18.15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12 10V14.9M9.55 12.45H14.45" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </BaseIcon>
  )
}

function ResultsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5.75 18.25V13.4C5.75 12.57 6.42 11.9 7.25 11.9H8.15C8.98 11.9 9.65 12.57 9.65 13.4V18.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M10.95 18.25V9.1C10.95 8.27 11.62 7.6 12.45 7.6H13.35C14.18 7.6 14.85 8.27 14.85 9.1V18.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16.15 18.25V5.8C16.15 4.97 16.82 4.3 17.65 4.3H18.25C19.08 4.3 19.75 4.97 19.75 5.8V18.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </BaseIcon>
  )
}

function HistoryIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7.15 8.3V4.95M7.15 4.95H10.5M7.15 4.95C5.62 6.18 4.65 8.07 4.65 10.2C4.65 13.9 7.65 16.9 11.35 16.9C14.2 16.9 16.64 15.12 17.6 12.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="12.8" cy="12.8" r="5.55" stroke="currentColor" stroke-width="1.8" />
      <path d="M12.8 10.25V12.95L14.95 14.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </BaseIcon>
  )
}

function SettingsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="2.65" stroke="currentColor" stroke-width="1.8" />
      <path d="M12 4.6V6.3M12 17.7V19.4M19.4 12H17.7M6.3 12H4.6M17.23 6.77L16.03 7.97M7.97 16.03L6.77 17.23M17.23 17.23L16.03 16.03M7.97 7.97L6.77 6.77" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </BaseIcon>
  )
}
