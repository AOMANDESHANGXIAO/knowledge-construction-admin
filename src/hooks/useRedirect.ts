export function useRedirect() {
  const initDirect = () => {
    const userInfo = localStorage.getItem('access_token')

    if (userInfo) {
      return '/home/class'
    } else {
      return '/login'
    }
  }

  return {
    initDirect,
  }
}
