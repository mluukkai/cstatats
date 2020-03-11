import React from 'react'
import { Route } from 'react-router-dom'
import CourseRouter from 'Components/CourseRouter'
import CoursesListView from 'Components/CoursesListView'
import AdminView from 'Components/AdminView'
import PersonalView from 'Components/PersonalView'

const AppRouter = () => (
  <>
    <Route exact path="/" component={CoursesListView} />
    <Route path="/myinfo" component={PersonalView} />
    <Route path="/luukkainen" exact component={AdminView} />
    <Route path="/courses/:course" component={CourseRouter} />
  </>
)


export default AppRouter
