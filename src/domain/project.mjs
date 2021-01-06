import { v4 as uuid } from 'uuid'

export const Project = ({
  id = uuid(),
  name,
  description,
  isFirstOrder = true,
  propositionalRulesSet = PropositionalRulesSet.FULL,
  createdAt
}) => ({
  id,
  name,
  description,
  isFirstOrder,
  propositionalRulesSet,
  createdAt
})

export const PropositionalRulesSet = {
  FULL: 'FULL',
  TAUTOLOGICAL_IMPLICATION_ONLY: 'TAUTOLOGICAL_IMPLICATION_ONLY',
  SPECIFIC_ONLY: 'SPECIFIC_ONLY'
}

export const ProjectWithDeductions = props => {
  const project = Project(props)
  project.deductions = props.deductions
  return project
}

export const Deduction = ({
  id = uuid(),
  name,
  description,
  steps,
  syms,
  presentations,
  theorem,
  createdAt
}) => ({
  id,
  name,
  description,
  steps,
  syms,
  presentations,
  theorem,
  createdAt
})
