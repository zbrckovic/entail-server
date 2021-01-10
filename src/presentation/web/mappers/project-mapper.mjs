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
      createdAt: project.createdAt.format(),
      deductions: project.deductions.map(deduction => deductionMapper.toPresentation(deduction))
    }
  }
}

export const projectCreateRequestMapper = ({
  fromPresentation (createProjectRequest) { return createProjectRequest }
})

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
