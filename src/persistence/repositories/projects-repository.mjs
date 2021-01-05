import { projectMapper } from '../mappers/project-mapper.mjs'

export const ProjectsRepository = ({ sequelize }) => {
  const { Project } = sequelize.models

  return {
    async getByOwnerId (ownerId) {
      const projectDAOs = await Project.findAll({ where: { ownerId } })
      return projectDAOs.map(projectDAO => projectMapper.fromPersistence(projectDAO))
    },
    async createProject (ownerId, project) {
      const projectDAOIncoming = projectMapper.toPersistence(project)
      projectDAOIncoming.ownerId = ownerId
      const projectDAOOutgoing = await Project.create(projectDAOIncoming)
      return projectMapper.fromPersistence(projectDAOOutgoing)
    }
  }
}
