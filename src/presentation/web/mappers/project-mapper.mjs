import { Deduction } from '../../../domain/project.mjs'

const projectMapperBase = {
  fromPresentation ({ name, description, isFirstOrder, propositionalRulesSet }) {
    return { name, description, isFirstOrder, propositionalRulesSet }
  },
  toPresentation ({ id, name, description, isFirstOrder, propositionalRulesSet, createdAt }) {
    return {
      id,
      name,
      description,
      isFirstOrder,
      propositionalRulesSet,
      createdAt: createdAt.format()
    }
  }
}

export const projectSummaryMapper = {
  fromPresentation (projectDTO) {
    return projectMapperBase.fromPresentation(projectDTO)
  },
  toPresentation (project) {
    return projectMapperBase.toPresentation(project)
  }
}

export const projectMapper = {
  toPresentation (project) {
    const projectDTO = projectMapperBase.toPresentation(project)
    projectDTO.deductions = project.deductions.map(
      deduction => deductionMapper.toPresentation(deduction)
    )
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
