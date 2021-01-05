export const ProjectsService = ({ projectsRepository }) => ({
  async getByOwnerId (ownerId) {
    return await projectsRepository.getByOwnerId(ownerId)
  },
  async createProject (ownerId, project) {
    return await projectsRepository.createProject(ownerId, project)
  }
})
