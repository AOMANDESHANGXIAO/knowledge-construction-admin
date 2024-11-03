/**
 * 给一个dom元素，让页面滚动到该DOM元素的位置
 */
export default function useViewScroll(dom: HTMLElement) {
  dom?.scrollIntoView({ behavior: 'smooth' })
}
