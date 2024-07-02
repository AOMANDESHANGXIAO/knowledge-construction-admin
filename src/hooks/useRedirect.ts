export function useRedirect() {
  const initDirect = () => {
    const userInfo = localStorage.getItem('st-admin-user')

    if (userInfo) {
      return '/home'
    } else {
      return '/login'
    }
  }

  return {
    initDirect,
  }
}
