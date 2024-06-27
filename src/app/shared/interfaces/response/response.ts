export interface SuccessGET {
  status: number,
  message: string,
  data: {}[],
  meta: { page: number, extra: { custom_fields?: [], segments?: [] } }
}

export interface SuccessGETbyId {
  status: number,
  message: string,
  data: {},
  meta: { extra: { custom_fields?: [], segments?: [], companies?: [] } }
}

export interface SuccessPOST {
  status: number,
  messagem: string,
  affectedRows: number
}

export interface SuccessPATCH {
  status: number,
  messagem: string,
  affectedRows: number
}

export interface SuccessDELETE {
  status: number,
  messagem: string,
  affectedRows: number
}

export interface ApiError {
  status: number,
  message: string
}
