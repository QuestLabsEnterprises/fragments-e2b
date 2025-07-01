export type LogoStyle = 'canvas' | 'code'

export default function Logo({
  style = 'canvas',
  ...props
}: { style?: LogoStyle } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3h18v18H3V3z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M7 7h10v2H7V7z"
        fill="currentColor"
      />
      <path
        d="M7 11h6v2H7v-2z"
        fill="currentColor"
      />
      <path
        d="M7 15h8v2H7v-2z"
        fill="currentColor"
      />
      <circle
        cx="17"
        cy="17"
        r="1"
        fill="currentColor"
      />
    </svg>
  )
}