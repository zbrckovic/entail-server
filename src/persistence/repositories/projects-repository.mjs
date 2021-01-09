import {
  deductionMapper,
  projectMapper,
  projectSummaryMapper
} from '../mappers/project-mapper.mjs'

export const ProjectsRepository = ({ sequelize }) => {
  const { Project, Deduction } = sequelize.models

  return {
    async getProjectsByOwnerId (ownerId) {
      const projectDAOs = await Project.findAll({ where: { ownerId } })
      return projectDAOs.map(projectDAO => projectSummaryMapper.fromPersistence(projectDAO))
    },
    async createProject (ownerId, project) {
      const projectDAOIncoming = projectSummaryMapper.toPersistence(project)
      projectDAOIncoming.ownerId = ownerId
      const projectDAOOutgoing = await Project.create(projectDAOIncoming)
      return projectSummaryMapper.fromPersistence(projectDAOOutgoing)
    },
    async createDeduction (projectId, deduction) {
      const deductionDAOIncoming = deductionMapper.toPersistence(deduction)
      deductionDAOIncoming.projectId = projectId
      const deductionDAOOutgoing = await Deduction.create(deductionDAOIncoming)
      return deductionMapper.fromPersistence(deductionDAOOutgoing)
    },
    async getProjectByOwnerIdAndProjectId (ownerId, projectId) {
      const projectDAO = await Project.findByPk(projectId, {
        where: { ownerId },
        include: ['deductions']
      })
      return projectDAO === null ? undefined : projectMapper.fromPersistence(projectDAO)
    }
  }
}
