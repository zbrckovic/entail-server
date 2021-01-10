import { Deduction, Project } from '../../domain/project.mjs'
import moment from 'moment'

export const projectMapper = {
  fromPersistence ({
    id,
    name,
    description = undefined,
    isFirstOrder,
    propositionalRulesSet,
    createdAt,
    deductions
  }) {
    return Project({
      id,
      name,
      description,
      isFirstOrder,
      propositionalRulesSet,
      createdAt: moment(createdAt),
      deductions: deductions?.map(deductionsDAO => deductionMapper.fromPersistence(deductionsDAO))
    })
  },
  toPersistence ({
    id = null,
    name,
    description = null,
    isFirstOrder,
    propositionalRulesSet,
    deductions
  }) {
    return {
      id,
      name,
      description,
      isFirstOrder,
      propositionalRulesSet,
      deductions: deductions?.map(deduction => deductionMapper.toPersistence(deduction))
    }
  }
}

export const deductionMapper = ({
  fromPersistence ({
    id,
    name,
    description = undefined,
    steps,
    syms,
    presentations,
    theorem,
    createdAt
  }) {
    return Deduction({
      id,
      name,
      description,
      steps,
      syms,
      presentations,
      theorem,
      createdAt: moment(createdAt)
    })
  },
  toPersistence ({ id, name, description = null, steps, syms, presentations, theorem }) {
    return { id, name, description, steps, syms, presentations, theorem }
  }
})
