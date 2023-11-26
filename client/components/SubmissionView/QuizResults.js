import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Message } from 'semantic-ui-react'

const QuizResults = () => {
  const { user, course } = useSelector(({ user, course }) => ({ user, course }))
  const answersInCourse = user.quizAnswers[course.info.name] || {}
  const parts = Object.keys(answersInCourse || {})
  const [banner, setBanner] = useState(false)

  useEffect(() => {
    const value = window.localStorage.getItem('hide-banner-miniproj')
    if (!value) {
      setBanner(true)
    }
  }, [])

  if (!parts.length) return null

  const total = parts.reduce(
    (acc, cur) => {
      const { score } = answersInCourse[cur]
      if (!score) return acc

      const wrong = score.total - score.right
      return {
        wrong: acc.wrong + wrong,
        score: acc.score + score.points,
      }
    },
    { wrong: 0, score: 0 },
  )

  const bannerCheck = () => {
    setBanner(true)
    window.localStorage.setItem('hide-banner-miniproj', true)
  }

  return (
    <>
      {true && (
        <Message positive onDismiss={bannerCheck}>
          <div>
            <h3>Vierailuluennot</h3>
            <ul>
              <li>
                ma 4.12. 12-14 Jami Kousa Unity, Mikko Tiainen Hogrefe
              </li>
              <li>
                ti 5.12. 12-14 Anniina Sallinen Oura
              </li>
              <li>ma 11.12. 12-14 Hannu Kokko Elisa</li>
              <li>ti 12.12. 12-14 Kasper Hirvikoski Unity, Ville Nordberg Trail openers</li>
            </ul>
            <p>
            Luentojen aiheet näet kurssin
                <a href="https://ohjelmistotuotanto-hy.github.io/osa0/#aikataulu">{' '}
                aikataulusta.
              </a>
            </p>
            <p>
              Luennot striimataan Unitubessa ja tallenteet tulevat Unitubeen/Youtubeen.
              Osallistumisesta paikan päällä vierailuluennoille on jaossa <strong>1
              kurssipiste</strong> (0.33 pistettä per osallistumiskerta). Ainoa tapa saada
              piste on tulla paikan päälle, ks.
              <a href="https://ohjelmistotuotanto-hy.github.io/osa0/#kurssin-arvostelu">{' '}
                arvosteluperusteet.
              </a>
            </p>
            <p>
              Jos osallistut kaikkiin vierailuluentoihin, saat myös ylimääräisen
              0.33p eli voit saada pisteitä yli kurssin maksimin (40p).
            </p>
          </div>
        </Message>
      )}
      <h3>Quiz results</h3>

      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Part</Table.HeaderCell>
            <Table.HeaderCell>Right answers</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {parts.map((partName) => {
            const { score } = answersInCourse[partName]
            if (!score) return null

            return (
              <Table.Row key={partName}>
                <Table.Cell>{partName}</Table.Cell>
                <Table.Cell>{`${score.right} / ${score.total}`}</Table.Cell>
                <Table.Cell>{score.points}</Table.Cell>
              </Table.Row>
            )
          })}
          <Table.Row>
            <Table.Cell>Total</Table.Cell>
            <Table.Cell>{`Missed: ${total.wrong}`}</Table.Cell>
            <Table.Cell>{`${total.score}`}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  )
}

export default QuizResults
