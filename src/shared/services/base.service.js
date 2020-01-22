import axios from 'axios'

class BaseService {
  static instance = null

  static getInstance () {
    if (BaseService.instance == null) {
      BaseService.instance = new BaseService()
    }
    return BaseService.instance
  }

  constructor () {
    this.client = this.getClient()
  }

  getClient () {
    const client = axios.create({
      baseURL: '',
      timeout: 60000
    })

    return client
  }

  get (url) {
    return this.client.get(url)
  }
}
export default () => {
  return BaseService.getInstance()
}
