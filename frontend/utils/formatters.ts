export const shortenString = (str: string | number, maxLength: number = 6): string => {
  str = str.toString()
  if (str.length > maxLength) {
    return `${str.substring(0, maxLength)}`;
  }
  return str;
}

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
