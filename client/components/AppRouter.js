import React from 'react'
import { Route } from 'react-router-dom'
import CourseRouter from 'Components/CourseRouter'
import CoursesListView from 'Components/CoursesListView'
import AdminView from 'Components/AdminView'

const AppRouter = () => (
  <>
    <Route exact path="/" component={CoursesListView} />
    <Route path="/luukkainen" exact component={AdminView} />
    <Route path="/courses/:course" component={CourseRouter} />
  </>
)


export default AppRouter
