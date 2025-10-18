export const validateHost = (input: string) => {
  const ipRegex =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/
  const domainRegex = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
  return ipRegex.test(input) || domainRegex.test(input)
}
