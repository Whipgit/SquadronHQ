const hasValue = val => (val === undefined ? false : val !== 'ACOG')

const step = (val, str) => (hasValue(val) ? `${val}-${str} ` : '')
const gradeStep = grade => (grade !== 2.5 ? `${grade}.0 ` : `${2.5} Bolter `)

module.exports = ({ aw, x, im, ic, ar, wires, grade }) => {
  return `${step(aw, 'AW')}${step(x, 'X')}${step(im, 'IM')}${step(ic, 'IC')}${step(ar, 'AR')}${gradeStep(
    grade
  )}${wires}`
}
