function IconFrame({ children, className = '', size = 20 }) {
  return (
    <svg
      aria-hidden="true"
      className={`app-icon ${className}`.trim()}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  )
}

function AppIcon({ name, className = '', size = 20 }) {
  switch (name) {
    case 'lab':
      return (
        <IconFrame className={className} size={size}>
          <path d="M10 3v5.2l-4.2 7.1A4 4 0 0 0 9.3 21h5.4a4 4 0 0 0 3.5-5.7L14 8.2V3" />
          <path d="M8 3h8" />
          <path d="M8.6 14h6.8" />
        </IconFrame>
      )

    case 'home':
      return (
        <IconFrame className={className} size={size}>
          <path d="M4 11.5L12 5l8 6.5" />
          <path d="M6 10.5V19h12v-8.5" />
          <path d="M10 19v-5h4v5" />
        </IconFrame>
      )

    case 'user':
      return (
        <IconFrame className={className} size={size}>
          <circle cx="12" cy="8" r="4" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </IconFrame>
      )

    case 'arrow-left':
      return (
        <IconFrame className={className} size={size}>
          <path d="M19 12H5" />
          <path d="M11 6l-6 6 6 6" />
        </IconFrame>
      )

    case 'logout':
      return (
        <IconFrame className={className} size={size}>
          <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
          <path d="M14 16l4-4-4-4" />
          <path d="M18 12H9" />
        </IconFrame>
      )

    case 'message':
      return (
        <IconFrame className={className} size={size}>
          <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H11l-4 4v-4H7.5A2.5 2.5 0 0 1 5 12.5Z" />
          <path d="M8.5 8.5h7" />
          <path d="M8.5 11.5h4.5" />
        </IconFrame>
      )

    case 'close':
      return (
        <IconFrame className={className} size={size}>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </IconFrame>
      )

    case 'lock':
      return (
        <IconFrame className={className} size={size}>
          <rect x="6" y="11" width="12" height="9" rx="2.5" />
          <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" />
        </IconFrame>
      )

    case 'play':
      return (
        <IconFrame className={className} size={size}>
          <circle cx="12" cy="12" r="9" />
          <path d="M10 8.8l5 3.2-5 3.2Z" fill="currentColor" stroke="none" />
        </IconFrame>
      )

    case 'chart':
      return (
        <IconFrame className={className} size={size}>
          <path d="M4 19h16" />
          <path d="M7 15v-4" />
          <path d="M12 15V9" />
          <path d="M17 15V6" />
        </IconFrame>
      )

    case 'logic':
      return (
        <IconFrame className={className} size={size}>
          <path d="M8 14a5 5 0 1 1 8 0c-.9.8-1.5 1.8-1.7 3H9.7c-.2-1.2-.8-2.2-1.7-3Z" />
          <path d="M9.5 20h5" />
        </IconFrame>
      )

    case 'relation':
      return (
        <IconFrame className={className} size={size}>
          <path d="M7 7h11" />
          <path d="M15 4l3 3-3 3" />
          <path d="M17 17H6" />
          <path d="M9 14l-3 3 3 3" />
        </IconFrame>
      )

    case 'chain':
      return (
        <IconFrame className={className} size={size}>
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="7" r="2" />
          <circle cx="18" cy="17" r="2" />
          <path d="M8 11l8-3" />
          <path d="M8 13l8 3" />
        </IconFrame>
      )

    case 'search':
      return (
        <IconFrame className={className} size={size}>
          <circle cx="11" cy="11" r="6" />
          <path d="M20 20l-4.2-4.2" />
        </IconFrame>
      )

    case 'trophy':
      return (
        <IconFrame className={className} size={size}>
          <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
          <path d="M10 15h4" />
          <path d="M12 15v5" />
          <path d="M9 20h6" />
          <path d="M8 5H5a2 2 0 0 0 0 4h1" />
          <path d="M16 5h3a2 2 0 0 1 0 4h-1" />
        </IconFrame>
      )

    case 'shield':
      return (
        <IconFrame className={className} size={size}>
          <path d="M12 3l7 3v5c0 4.5-3.1 8.5-7 10-3.9-1.5-7-5.5-7-10V6l7-3Z" />
          <path d="M9.5 12.2l1.7 1.7 3.5-3.5" />
        </IconFrame>
      )

    case 'google':
      return (
        <IconFrame className={className} size={size}>
          <path d="M20 12h-8" />
          <path d="M12 12h4v4" />
          <path d="M18.6 9.2A8 8 0 1 0 19 14" />
        </IconFrame>
      )

    case 'apple':
      return (
        <IconFrame className={className} size={size}>
          <path d="M14.6 6.1c.5-.8.9-1.8.8-3.1-1.1.1-2.3.7-3 1.6-.6.7-1 1.8-.8 2.8 1.2.1 2.4-.5 3-.9Z" />
          <path d="M16.9 12.7c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.4.8-3.1.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.9-3.5 2.1-1.5 2.7-.4 6.7 1 8.6.7.9 1.5 1.9 2.6 1.8 1-.1 1.5-.6 2.8-.6 1.3 0 1.7.6 2.8.6 1.2 0 1.9-1 2.6-1.9.8-1.1 1.1-2.2 1.1-2.3-.1 0-2.2-.8-2.2-3.6Z" />
        </IconFrame>
      )

    case 'facebook':
      return (
        <IconFrame className={className} size={size}>
          <path d="M14.5 8H17V4.5h-2.9c-3 0-4.6 1.8-4.6 4.7V12H7v3.5h2.5V20h3.7v-4.5H16L16.4 12h-3.2V9.6c0-1 .5-1.6 1.3-1.6Z" />
        </IconFrame>
      )

    default:
      return (
        <IconFrame className={className} size={size}>
          <circle cx="12" cy="12" r="8" />
        </IconFrame>
      )
  }
}

export default AppIcon
