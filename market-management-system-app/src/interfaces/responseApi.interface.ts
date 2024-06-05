export interface IResponseFetchData<T> {
  page: number
  perPage: number
  total: number
  items: T[]
}
