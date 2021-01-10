import { Router } from 'express'
import {
  projectCreateRequestMapper,
  projectMapper,
  projectSummaryMapper
} from '../mappers/project-mapper.mjs'
import { body, param } from 'express-validator'
import { PropositionalRulesSet } from '../../../domain/project.mjs'

export const ProjectsRouter = ({
  projectsService,
  validationMiddlewareFactory: validation,
  authenticationMiddlewareFactory: authentication
}) => {
  return new Router()
    .use(authentication.isAuthenticated())
    .get(
      '/',
      async (req, res) => {
        const { sub } = req.token
        const projects = await projectsService.getProjectsByOwnerId(sub)
        const projectDTOs = projects.map(
          projectSummary => projectSummaryMapper.toPresentation(projectSummary)
        )
        res.json({ projects: projectDTOs })
      }
    )
    .post(
      '/',
      validation.isValid(
        body('name').isString().isLength({ max: 256 }),
        body('description').optional().isLength({ max: 2000 }),
        body('isFirstOrder').isBoolean(),
        body('propositionalRulesSet').isIn(Object.values(PropositionalRulesSet))
      ),
      async (req, res) => {
        const { sub } = req.token
        const createRequestDTO = req.body
        const createRequest = projectCreateRequestMapper.fromPresentation(createRequestDTO)
        const project = await projectsService.createProject(sub, createRequest)
        const projectDTO = projectSummaryMapper.toPresentation(project)
        res.json(projectDTO)
      }
    )
    .get(
      '/:id',
      validation.isValid(param('id').isUUID()),
      async (req, res) => {
        const { id: projectId } = req.params
        const { sub } = req.token
        const project = await projectsService.getProjectByOwnerIdAndProjectId(sub, projectId)
        if (project === undefined) {
          res.status(404).send()
          return
        }
        const projectDTO = projectMapper.toPresentation(project)
        res.json(projectDTO)
      }
    )
}
