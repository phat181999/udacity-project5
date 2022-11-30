import { apiEndpoint } from '../config'
import { CAR } from '../types/Car'
import { CreateCarRequest } from '../types/CreateCarRequest'
import Axios from 'axios'
import { UpdateCarRequest } from '../types/UpdateCarRequest'

export async function getTodos(idToken: string): Promise<CAR[]> {
  console.log('Fetching todos')

  const response = await Axios.get(`${apiEndpoint}/cars`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Todos:', response.data)
  return response.data.items
}

export async function createTodo(
  idToken: string,
  newCar: CreateCarRequest
): Promise<CAR> {
  const response = await Axios.post(
    `${apiEndpoint}/cars`,
    JSON.stringify(newCar),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchTodo(
  idToken: string,
  carId: string,
  updatedCar: UpdateCarRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/cars/${carId}`,
    JSON.stringify(updatedCar),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteTodo(
  idToken: string,
  carId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/cars/${carId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  carId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/cars/${carId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
