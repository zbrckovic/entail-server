import { Project } from '../../domain/project.mjs'

export const projectMapper = {
  fromPersistence ({ id, name, description, isFirstOrder, propositionalRulesSet }) {
    return Project({
      id,
      name,
      description: description ?? undefined,
      isFirstOrder,
      propositionalRulesSet
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
