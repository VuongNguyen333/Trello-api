import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/board'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/column'
import { cardModel } from '~/models/card'

const createNew = async (reqBody) => {
  try {
    //Xu ly logic du lieu
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const createdBoard = await boardModel.createNew(newBoard)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    //Trong service luon phai co return
    return getNewBoard
  } catch (error) { throw error }
}
const getDetail = async (boardId) => {
  try {
    const board = await boardModel.getDetail(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    //Tạo ra cái mới để xử lý (khác địa chỉ)
    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })
    delete resBoard.cards
    return resBoard
  } catch (error) { throw error }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) { throw error }
}

const moveCardToDiffColumn = async (reqBody) => {
  try {
    // B1: cap nhat activeCardOrderIds
    await columnModel.update(reqBody.prevColumnId, { cardOrderIds: reqBody.prevCardOrderIds, updatedAt: Date.now() })
    // B2: cap nhat overCardOrderIds
    await columnModel.update(reqBody.nextColumnId, { cardOrderIds: reqBody.nextCardOrderIds, updatedAt: Date.now() })
    // B3: cap nhat lai columnId cua activeCard
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })
    return { updatedResult: 'Successfully' }
  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  getDetail,
  update,
  moveCardToDiffColumn
}