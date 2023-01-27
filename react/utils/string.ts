export function getFormattedValue(value: any) {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  if (!isNaN(value) && value !== "") {

    value = value < 0 ? Math.abs(value) : value
    return parseInt(value, 10)
  }

  return value
}

export function capitalizeWord(str: string) {
  str = str.toLowerCase();
  return str[0].toUpperCase() + str.substr(1);
}
