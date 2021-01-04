import { v4 as uuid } from 'uuid'

export const Project = ({
  id = uuid(),
  name,
  description,
  isFirstOrder = true,
  propositionalRulesSet = PropositionalRulesSet.FULL
}) => ({
  id,
  name,
  description,
  isFirstOrder,
  propositionalRulesSet
})

export const PropositionalRulesSet = {
  FULL: 'FULL',
  TAUTOLOGICAL_IMPLICATION_ONLY: 'TAUTOLOGICAL_IMPLICATION_ONLY',
  SPECIFIC_ONLY: 'SPECIFIC_ONLY'
}
