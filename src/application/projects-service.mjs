export const ProjectsService = ({ projectsRepository }) => ({
  async getProjectsByOwnerId (ownerId) {
    return await projectsRepository.getProjectsByOwnerId(ownerId)
  },
  async createProject (ownerId, project) {
    return await projectsRepository.createProject(ownerId, project)
  },
  async getProjectWithDeductionsById (ownerId, projectId) {
    return await projectsRepository.getProjectWithDeductionsById(ownerId, projectId)
  }
})
