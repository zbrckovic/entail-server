import { Deduction, Project } from '../../../domain/project.mjs'

export const projectMapper = {
  fromPresentation (projectDTO) {
    return Project(projectDTO)
  },
  toPresentation ({ createdAt, deductions, ...projectRest }) {
    return {
      ...projectRest,
      createdAt: createdAt.format(),
      deductions: deductions?.map(deduction => deductionMapper.toPresentation(deduction))
    }
  }
}

export const deductionMapper = ({
  fromPresentation (deductionDTO) {
    return Deduction(deductionDTO)
  },
  toPresentation ({ createdAt, ...deductionRest }) {
    return { ...deductionRest, createdAt: createdAt.format() }
  }
})
