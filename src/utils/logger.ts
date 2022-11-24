export const logWS = (message: string, data?: any) => {
  if (!!process.env.REACT_APP_ENABLE_SOCKET_LOGS) {
    if (!!data) {
      console.log(message, data)
    } else {
      console.log(message)
    }
  }
}
