import { Project, Deduction, ProjectWithDeductions } from '../../domain/project.mjs'
import moment from 'moment'

export const projectMapper = {
  fromPersistence ({ id, name, description, isFirstOrder, propositionalRulesSet, createdAt }) {
    return Project({
      id,
      name,
      description: description ?? undefined,
      isFirstOrder,
      propositionalRulesSet,
      createdAt: moment(createdAt)
    })
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

export const projectWithDeductionsMapper = ({
  fromPersistence (props) {
    return ProjectWithDeductions({
      ...projectMapper.fromPersistence(props),
      deductions: props.deductions.map(deduction => deductionMapper.fromPersistence(deduction))
    })
  },
  toPersistence (project) {
    return {
      ...projectMapper.toPersistence(project),
      deductions: project.deductions.map(deduction => deductionMapper.toPersistence(deduction))
    }
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
