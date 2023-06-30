function checkInputEmpty(domList = []) {
  let status = false
  domList.forEach(dom => {
    if (dom.value === '') {
      console.log(dom + " value is empty");
      status = true
    }
  })
  return status
}


export { checkInputEmpty }