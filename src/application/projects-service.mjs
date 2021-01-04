export const ProjectsService = ({ projectsRepository }) => ({
  async getByOwnerId (ownerId) {
    return await projectsRepository.getByOwnerId(ownerId)
  }
})
