type Login = {
  username: string
  password: string
}
type SignIn = Login & {
  fistName: string
  lastName: string
}