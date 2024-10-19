import { ApiResponse } from '@/types/response'
import { Context } from 'hono'
import { Handler } from 'hono/types'

const format =
  <T = any>(
    controller: (c: Context) => Promise<T> | T,
    successCode = 200,
  ): Handler =>
  async (c) => {
    const data = (await controller(c)) ?? null
    const response: ApiResponse = { status: 'success', data }
    return c.json(response, successCode as unknown)
  }

export default format
