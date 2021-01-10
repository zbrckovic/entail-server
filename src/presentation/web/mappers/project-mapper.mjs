export const projectSummaryMapper = {
  toPresentation (projectSummary) {
    return {
      ...projectSummary,
      createdAt: projectSummary.createdAt.format()
    }
  }
}

export const projectMapper = {
  toPresentation (project) {
    return {
      ...project,
      deductions: project.deductions.map(deduction => deductionMapper.toPresentation(deduction))
    }
  }
}

export const deductionMapper = {
  toPresentation ({ id, name, description, steps, syms, presentations, theorem, createdAt }) {
    return {
      id,
      name,
      description,
      steps,
      syms,
      presentations,
      theorem,
      createdAt: createdAt.format()
    }
  }
}
