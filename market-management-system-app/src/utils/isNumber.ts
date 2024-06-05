export function isNumber(value: any): boolean {
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(value) || value === '' || value === '-') {
      return true;
    }
    return false
}