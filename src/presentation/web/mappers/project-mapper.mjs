import { Deduction, Project, ProjectWithDeductions } from '../../../domain/project.mjs'
import { v4 as uuid } from 'uuid'

export const projectMapper = {
  toPresentation (project) {
    const { id, name, description, isFirstOrder, propositionalRulesSet, createdAt } = project
    return {
      id,
      name,
      description,
      isFirstOrder,
      propositionalRulesSet,
      createdAt: createdAt.format()
    }
  },
  fromPresentation (project) {
    const { name, description, isFirstOrder, propositionalRulesSet } = project
    return Project({ name, description, isFirstOrder, propositionalRulesSet })
  }
}

export const projectWithDeductionsMapper = {
  toPresentation ({ deductions, ...projectProps }) {
    const projectDTO = projectMapper.toPresentation(projectProps)
    projectDTO.deductions = deductions.map(deduction => deductionMapper.toPresentation(deduction))
    return projectDTO
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
  },
  fromPresentation ({ id, name, description, steps, syms, presentations, theorem }) {
    return Deduction({ id, name, description, steps, syms, presentations, theorem })
  }
}
