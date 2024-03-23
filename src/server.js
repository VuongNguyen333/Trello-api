/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import exitHook from 'async-exit-hook'
import { corsOptions } from '~/config/cors'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))

  //Enable req.body json data
  app.use(express.json())

  //Use APIs V1
  app.use('/v1', APIs_V1)

  //Middleware xu ly loi tap trung
  app.use(errorHandlingMiddleware)
  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Production: Hello ${env.AUTHOR}, I am running at Port:${process.env.PORT}/`)
    })
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      // eslint-disable-next-line no-console
      console.log(`Dev: Hello ${env.AUTHOR}, I am running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
    })
  }

  exitHook(() => {
    CLOSE_DB()
  })
}

CONNECT_DB()
  .then(() => console.log('Connected to MongoDb Cloud Atlas!'))
  .then(() => START_SERVER())
  .catch(error => {
    console.error(error)
    process.exit(0)
  })