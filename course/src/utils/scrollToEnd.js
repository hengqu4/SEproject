const scrollToEnd = (ele) => {
  return ele.scrollHeight - (ele.scrollTop + ele.offsetHeight) < 1
}

export default scrollToEnd
