export const getPromiseSettledResultData = <T>(resultsData: PromiseSettledResult<T>[]) => {
  const data: T[] = []
  resultsData.forEach((result) => {
    if (result.status === "fulfilled") {
      data.push(result.value)
    }
  })

  return data
}

export const add = (a: number, b: number) => {
  return a + b
}