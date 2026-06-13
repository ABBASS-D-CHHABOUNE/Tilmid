// Moroccan Grading System
// Score: 0-20
// Threshold: 10/20

const calculateMoroccanGrade = (score) => {
  if (score >= 10) {
    return 'ADMIS' // Passed
  } else {
    return 'REFUSE' // Failed
  }
}

const calculateAverage = (grades) => {
  if (grades.length === 0) return 0

  const totalWeighted = grades.reduce((sum, grade) => {
    return sum + (grade.score * grade.coefficient)
  }, 0)

  const totalCoefficient = grades.reduce((sum, grade) => {
    return sum + grade.coefficient
  }, 0)

  return (totalWeighted / totalCoefficient).toFixed(2)
}

const getGradeStatus = (average) => {
  return average >= 10 ? 'ADMIS' : 'REFUSE'
}

module.exports = {
  calculateMoroccanGrade,
  calculateAverage,
  getGradeStatus
}