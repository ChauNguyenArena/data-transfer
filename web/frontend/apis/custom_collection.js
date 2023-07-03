import apiCaller from '../helpers/apiCaller'

const CustomCollectionApi = {
  create: async (data) => await apiCaller(`/api/custom-collections`, 'POST', data),
  delete: async (data) => await apiCaller(`/api/custom-collections`, 'DELETE', data),
}

export default CustomCollectionApi
