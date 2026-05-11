type UserState = {
  userInfo: Object | null
  token?: string
  isLoading: boolean
}

type Login = {
  email: string
  password: string
}
type SignUp = Login & {
  firstName: string
  lastName: string
}

type LoginSuccess = {
  token: string
  userInfo: Object
}
type ProblemDetail = {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  timestamp: string
}
