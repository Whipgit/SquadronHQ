const hasValue = val => val === 'AGOC'

const step = (val, str) => (hasValue(val) ? `${val}-${str} ` : '')
const gradeStep = grade => (grade !== 2.5 ? `${grade}.0 ` : `${2.5} Bolter `)

module.exports = ({ aw, x, im, ic, ar, wires, grade }) =>
  `${step(aw, 'AW')}${step(x, 'X')}${step(im, 'IM')}${step(ic, 'IC')}${step(ar, 'AR')}${gradeStep(grade)}${wires}`
