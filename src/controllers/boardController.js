/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    //Dieu huong sang tang` service
    const createBoard = await boardService.createNew(req.body)

    //Tra ket qua ve cho client
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) { next(error) }
}
const getDetail = async (req, res, next) => {
  try {
    const board = await boardService.getDetail(req.params.id)
    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const updatedBoard = await boardService.update(req.params.id, req.body)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}
export const boardController = {
  createNew,
  getDetail,
  update
}