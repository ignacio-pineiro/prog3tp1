export default function CountryFlag({ countryCode, size }) {
  switch (countryCode) {
    case 'en':
      countryCode = 'gb-eng'
      break;
    case 'sx':
      countryCode = 'gb-sct'
      break;
    case 'wl':
      countryCode = 'gb-wls'
      break;
    case 'ni':
      countryCode = 'gb-nir'
      break;

    default:
      break;
  }

  if (size) {
    switch (size) {
      case 'lg':
        return <span className={`fib w-12 h-9 fi-${countryCode}`}></span>

      case 'md':
        return <span className={`fib w-8 h-6  fi-${countryCode}`}></span>

      case 'sm':
        return <span className={`fib w-4 h-3  fi-${countryCode}`}></span>

      default:
        break;
    }
  }

  return <span className={`fi fi-${countryCode}`}></span>
}