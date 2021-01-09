export const ProjectsService = ({ projectsRepository }) => ({
  async getProjectsByOwnerId (ownerId) {
    return await projectsRepository.getProjectsByOwnerId(ownerId)
  },
  async createProject (ownerId, project) {
    return await projectsRepository.createProject(ownerId, project)
  },
  async getProjectByOwnerIdAndProjectId (ownerId, projectId) {
    return await projectsRepository.getProjectByOwnerIdAndProjectId(ownerId, projectId)
  }
})
