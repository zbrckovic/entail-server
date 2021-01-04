export const projectMapper = {
  toPresentation: project => {
    const { id, name, description, isFirstOrder, propositionalRulesSet } = project
    return { id, name, description, isFirstOrder, propositionalRulesSet }
  }
}
