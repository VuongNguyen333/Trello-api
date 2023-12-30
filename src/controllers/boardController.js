/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    //Dieu huong sang tang` service
    const createBoard = await boardService.creatNew(req.body)

    //Tra ket qua ve cho client
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew
}