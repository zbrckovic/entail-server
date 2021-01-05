import { Project } from '../../../domain/project.mjs'

export const projectMapper = {
  toPresentation: project => {
    const { id, name, description, isFirstOrder, propositionalRulesSet } = project
    return { id, name, description, isFirstOrder, propositionalRulesSet }
  },
  fromPresentation: project => {
    const { name, description, isFirstOrder, propositionalRulesSet } = project
    return Project({ name, description, isFirstOrder, propositionalRulesSet })
  }
}
