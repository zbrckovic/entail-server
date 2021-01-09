import { Deduction, Project, ProjectSummary } from '../../domain/project.mjs'
import moment from 'moment'

const projectMapperBase = {
  fromPersistence ({ id, name, description, isFirstOrder, propositionalRulesSet, createdAt }) {
    return {
      id,
      name,
      description: description ?? undefined,
      isFirstOrder,
      propositionalRulesSet,
      createdAt: moment(createdAt)
    }
  },
  toPersistence ({ id, name, description, isFirstOrder, propositionalRulesSet }) {
    return {
      id: id ?? null,
      name,
      description: description ?? null,
      isFirstOrder,
      propositionalRulesSet
    }
  }
}

export const projectSummaryMapper = ({
  fromPersistence (projectDAO) {
    return ProjectSummary(projectMapperBase.fromPersistence(projectDAO))
  },
  toPersistence (project) {
    return projectMapperBase.toPersistence(project)
  }
})

export const projectMapper = ({
  fromPersistence (projectDAO) {
    return Project({
      ...projectMapperBase.fromPersistence(projectDAO),
      deductions: projectDAO.deductions.map(
        deductionDAO => deductionMapper.fromPersistence(deductionDAO)
      )
    })
  }
})

export const deductionMapper = ({
  fromPersistence ({ id, name, description, steps, syms, presentations, theorem, createdAt }) {
    return Deduction({
      id,
      name,
      description: description ?? undefined,
      steps,
      syms,
      presentations,
      theorem,
      createdAt: moment(createdAt)
    })
  },
  toPersistence ({ id, name, description, steps, syms, presentations, theorem }) {
    return {
      id: id ?? null,
      name,
      description: description ?? null,
      steps,
      syms,
      presentations,
      theorem
    }
  }
})
