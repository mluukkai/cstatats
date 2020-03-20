import React from 'react'
import { Flag } from 'semantic-ui-react'
import { Link, useRouteMatch } from 'react-router-dom'
import { basePath } from 'Utilities/common'

const langFlags = {
  fi: <Flag name="finland" />,
  en: <Flag name="uk" />,
}

const CertificateLink = ({ name, certRandom, langs }) => {
  const match = useRouteMatch()

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

  const courseName = match.params.course

  return (
    <div style={{ paddingTop: 10, paddingRight: 5 }}>
      <strong>Certificate</strong>
      {langs.map((lang) => {
        const url = `${window.location.origin}${basePath}api/certificate/${courseName}/${lang}/${certRandom}`
        return <a key={lang} style={{ margin: '0.3em' }} href={url}>{langFlags[lang]}</a>
      })}
    </div>
  )
}

export default CertificateLink
