import { deductionMapper, projectMapper } from '../mappers/project-mapper.mjs'
import stampit from '@stamp/it'

export const ProjectsRepository = stampit({
  init ({ sequelize }) {
    this.models = sequelize.models
  },
  methods: {
    async getProjectsByOwnerId (ownerId) {
      const projectDAOs = await this.models.Project.findAll({ where: { ownerId } })
      return projectDAOs.map(projectDAO => projectMapper.fromPersistence(projectDAO))
    },
    async createProject (ownerId, project) {
      const projectDAOIncoming = projectMapper.toPersistence(project)
      projectDAOIncoming.ownerId = ownerId
      const projectDAOOutgoing = await this.models.Project.create(projectDAOIncoming)
      return projectMapper.fromPersistence(projectDAOOutgoing)
    },
    async createDeduction (projectId, deduction) {
      const deductionDAOIncoming = deductionMapper.toPersistence(deduction)
      deductionDAOIncoming.projectId = projectId
      const deductionDAOOutgoing = await this.models.Deduction.create(deductionDAOIncoming)
      return deductionMapper.fromPersistence(deductionDAOOutgoing)
    },
    async getProjectByOwnerIdAndProjectId (ownerId, projectId) {
      const projectDAO = await this.models.Project.findByPk(projectId, {
        where: { ownerId },
        include: ['deductions']
      })
      return projectDAO === null ? undefined : projectMapper.fromPersistence(projectDAO)
    }
  }
})
