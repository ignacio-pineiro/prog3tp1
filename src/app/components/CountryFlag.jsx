export default function CountryFlag({ countryCode }) {
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

  return <span className={`fi fi-${countryCode}`}></span>
}