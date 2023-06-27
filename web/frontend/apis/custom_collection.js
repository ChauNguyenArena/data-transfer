import apiCaller from '../helpers/apiCaller'

const CustomCollectionApi = {
  create: async (data) => await apiCaller(`/api/custom-collections`, 'POST', data),
}

export default CustomCollectionApi
