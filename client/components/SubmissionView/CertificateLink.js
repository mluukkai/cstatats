import React from 'react'
import { Flag } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { basePath } from 'Utilities/common'

const CertificateLink = ({ courseName, credits, name, certRandom }) => {
  if (credits < 3) return null

  if (!name || !name.trim()) {
    return (
      <div>
        Fill in your name
        <Link to="/myinfo"> here </Link>
        if you want to get the course certificate
      </div>
    )
  }

  if (!certRandom) return null
  const urlFin = `${window.location.origin}${basePath}api/certificate/${courseName}/fi/${certRandom}`
  const urlEn = `${window.location.origin}${basePath}api/certificate/${courseName}/en/${certRandom}`

  return (
    <div style={{ paddingTop: 10, paddingRight: 5 }}>
      <strong>Certificate</strong>
      <a href={urlFin}><Flag name="finland" /></a>
      <a href={urlEn}><Flag name="uk" /></a>
    </div>
  )
}

export default CertificateLink
