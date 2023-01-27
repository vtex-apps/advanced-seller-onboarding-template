export function capitalizeWord(str: string) {
    str = str.toLowerCase();
    return str[0].toUpperCase() + str.substr(1);
  }