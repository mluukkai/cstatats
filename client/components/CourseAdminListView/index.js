import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'

import StudentModal from 'Components/CourseAdminListView/StudentModal'
import TableSortLabel from 'Components/TableSortLabel'
import useLocalStorage from '../../hooks/useLocalStorage'
import useStudents from './useStudents'
import useOrderBy from './useOrderBy'

const AdminView = () => {
  const { courseName, exercises, miniproject } = useSelector(({ course }) => {
    const courseName = ((course || {}).info || {}).name
    if (!courseName) return {}
    return {
      courseName: course.info.name,
      exercises: course.info.exercises,
      miniproject: course.info.miniproject,
    }
  })

  const [split, setSplit] = useLocalStorage(`${courseName}_pagination`, 30)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(0)

  const changePagination = ({ target }) => setSplit(target.value)

  const changePage = newVal => setPage(Math.max(0, newVal))

  const changeFilter = ({ target }) => setFilter(target.value)

  const [{ orderBy, orderDirection }, { toggleOrderDirection }] = useOrderBy({
    orderBy: 'username',
    orderDirection: 'asc',
  })

  const {
    students,
    filteredStudents,
    filteredStudentsTotalCount,
    pageStart,
    pageEnd,
    refetchStudents,
  } = useStudents(courseName, {
    filter,
    pageSize: split,
    page,
    orderBy,
    orderDirection,
  })

  const hasQuiz = useMemo(() => {
    return students
      ? Boolean(
          students.find(
            student => student.quizAnswers && student.quizAnswers[courseName],
          ),
        )
      : false
  }, [students])

  const getTableSortLabelProps = column => ({
    direction: column === orderBy ? orderDirection : null,
    onClick: () => toggleOrderDirection(column),
  })

  if (!courseName) return null

  return (
    <>
      <Link to={`/courses/${courseName}/admin/suotar`}>Suotar View</Link> &nbsp;&nbsp;&nbsp;
      <Link to={`/courses/${courseName}/admin/paste`}>Paste View</Link>
      <div>
        <button type="button" onClick={() => changePage(page - 1)}>
          {' '}
          Page backward
        </button>
        <input onChange={changeFilter} placeholder="search" />
        <button type="button" onClick={() => changePage(page + 1)}>
          {' '}
          Page forward
        </button>
        <p>{`Showing ${pageStart} - ${pageEnd} of ${filteredStudentsTotalCount}`}</p>
        <label htmlFor="pageSize">
          Pagination:{' '}
          <input
            onChange={changePagination}
            value={split}
            id="pageSize"
            placeholder="pagination"
          />
        </label>
      </div>
      <Table celled striped compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan="2">
              <TableSortLabel {...getTableSortLabelProps('student_number')}>
                Number
              </TableSortLabel>
            </Table.HeaderCell>
            <Table.HeaderCell rowSpan="2">
              <TableSortLabel {...getTableSortLabelProps('name')}>
                Name
              </TableSortLabel>
            </Table.HeaderCell>
            <Table.HeaderCell rowSpan="2">
              <TableSortLabel {...getTableSortLabelProps('username')}>
                Username
              </TableSortLabel>
            </Table.HeaderCell>
            <Table.HeaderCell colSpan={`${exercises.length + 1}`}>
              Exercises
            </Table.HeaderCell>
            {hasQuiz && (
              <Table.HeaderCell colSpan={`${exercises.length + 1}`}>
                Quiz points
              </Table.HeaderCell>
            )}
            {miniproject && (
              <Table.HeaderCell rowSpan="2">Project</Table.HeaderCell>
            )}
          </Table.Row>
          <Table.Row>
            {exercises.map((week, idx) => (
              <Table.HeaderCell key={`${idx + 0}`}>{idx}</Table.HeaderCell>
            ))}
            <Table.HeaderCell>
              <TableSortLabel {...getTableSortLabelProps('total_exercises')}>
                Total
              </TableSortLabel>
            </Table.HeaderCell>
            {hasQuiz && (
              <>
                {exercises.map((week, idx) => (
                  <Table.HeaderCell key={`${idx + 0}`}>{idx}</Table.HeaderCell>
                ))}
                <Table.HeaderCell>
                  <TableSortLabel {...getTableSortLabelProps('quizTotalScore')}>
                    Total
                  </TableSortLabel>
                </Table.HeaderCell>
              </>
            )}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredStudents.map(student => {
            const {
              student_number: studentNumber,
              username,
              project,
              name,
              submissions,
              total_exercises: totalExercises,
              quizTotalScore,
              quizAnswersInCourse,
            } = student

            const projectStatus =
              (project && project.accepted && 'Hyv.') ||
              (project && project.name) ||
              'Ei'
            const projectColor =
              (projectStatus === 'Hyv.' && 'PaleGreen') ||
              (projectStatus === 'Ei' && 'LightCoral') ||
              ''
            return (
              <Table.Row key={username}>
                <Table.Cell>{studentNumber}</Table.Cell>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>
                  <StudentModal
                    student={student}
                    getStudents={refetchStudents}
                  />
                </Table.Cell>
                {exercises.map((_, idx) => {
                  const weekly = submissions.find(s => s.week === idx)
                  return (
                    <Table.Cell key={`${idx + 0}`}>
                      {weekly && weekly.exercises && weekly.exercises.length}
                    </Table.Cell>
                  )
                })}
                <Table.Cell>{totalExercises}</Table.Cell>
                {hasQuiz && (
                  <>
                    {exercises.map((_, idx) => {
                      const partly = quizAnswersInCourse[idx] || {}
                      const isLocked = partly.locked || false
                      const score = partly.score || {}
                      return (
                        <Table.Cell
                          style={{ background: isLocked ? 'PaleGreen' : '' }}
                          key={`${idx + 0}`}
                        >
                          {score.total
                            ? `${score.right}/${score.total} ${score.points}`
                            : ''}
                        </Table.Cell>
                      )
                    })}
                    <Table.Cell>{quizTotalScore.toFixed(2)}</Table.Cell>
                  </>
                )}
                {miniproject && (
                  <Table.Cell style={{ backgroundColor: projectColor }}>
                    {projectStatus.substr(0, 7)}
                  </Table.Cell>
                )}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </>
  )
}

export default AdminView
