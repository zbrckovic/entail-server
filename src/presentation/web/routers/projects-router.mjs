import { Router } from 'express'
import { projectMapper } from '../mappers/project-mapper.mjs'

export const ProjectsRouter = ({
  projectsService,
  authenticationMiddlewareFactory: authentication
}) => {
  return new Router()
    .use(authentication.isAuthenticated())
    .get(
      '/',
      async (req, res, next) => {
        const { sub } = req.token
        const projects = await projectsService.getByOwnerId(sub)
        const projectDTOs = projects.map(project => projectMapper.toPresentation(project))
        res.json({ projects: projectDTOs })
      }
    )
}
