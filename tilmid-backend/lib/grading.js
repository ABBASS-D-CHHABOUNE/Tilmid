class GradingEngine {
  static calculateMoyenne(subjects) {
    if (!subjects || subjects.length === 0) {
      throw new Error('No subject scores provided');
    }

    let totalWeightedScore = 0;
    let totalCoefficients = 0;

    subjects.forEach((subject) => {
      totalWeightedScore += subject.score * subject.coefficient;
      totalCoefficients += subject.coefficient;
    });

    const moyenne = parseFloat((totalWeightedScore / totalCoefficients).toFixed(2));
    const status = moyenne >= 10.0 ? 'ADMIS' : 'REFUSE';
    const isRefused = status === 'REFUSE';
    const failingSubjects = subjects.filter((s) => s.score < 10.0).map((s) => s.subjectName);
    const alertRequired = isRefused || failingSubjects.length > 0;

    return { moyenne, status, isRefused, failingSubjects, alertRequired };
  }
}

module.exports = GradingEngine;