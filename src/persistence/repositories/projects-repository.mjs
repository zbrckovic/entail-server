import { projectMapper } from '../mappers/project-mapper.mjs'

export const ProjectsRepository = ({ sequelize }) => {
  const { Project } = sequelize.models

  return {
    async getByOwnerId (ownerId) {
      const projectDAOs = await Project.findAll({ where: { ownerId } })
      return projectDAOs.map(projectDAO => projectMapper.fromPersistence(projectDAO))
    }
  }
}
