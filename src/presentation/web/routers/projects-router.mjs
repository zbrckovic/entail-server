import { Router } from 'express'
import { projectMapper } from '../mappers/project-mapper.mjs'
import { body } from 'express-validator'
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
        const projects = await projectsService.getByOwnerId(sub)
        const projectDTOs = projects.map(project => projectMapper.toPresentation(project))
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
        console.log(sub)
        const projectDTOIncoming = req.body
        const projectIncoming = projectMapper.fromPresentation(projectDTOIncoming)
        const projectOutgoing = await projectsService.createProject(sub, projectIncoming)
        const projectDTOOutgoing = projectMapper.toPresentation(projectOutgoing)
        res.json(projectDTOOutgoing)
      }
    )
}
