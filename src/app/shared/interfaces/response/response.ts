export interface SuccessGET {
  status: number,
  message: string,
  data: {}[],
  meta: { page: number }
}

export interface SuccessGETbyId {
  status: number,
  messagem: string,
  data: {}
}

export interface ApiError {
  status: number,
  message: string
}