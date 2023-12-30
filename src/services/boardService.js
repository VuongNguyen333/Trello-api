/* eslint-disable no-console */
/* eslint-disable no-useless-catch */
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { board } from '~/models/board'

const creatNew = async (reqBody) => {
  try {
    //Xu ly logic du lieu
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const createdBoard = await board.createNew(newBoard)
    console.log(createdBoard)
    const getNewBoard = await board.findOneById(createdBoard.insertedId)
    console.log(getNewBoard)
    //Trong service luon phai co return
    return getNewBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  creatNew
}