const validateLink = (href?: string) => {
  if (!href) return true

  return href.trim() ? true : 'Renseignez un lien ou retirez-le.'
}
export {validateLink}
