import { courseConfig } from 'Utilities/common'

const { courseNames } = courseConfig.fsReactNative

const isReactNativeCourse = (courseName) => courseNames.includes(courseName)

export default isReactNativeCourse
