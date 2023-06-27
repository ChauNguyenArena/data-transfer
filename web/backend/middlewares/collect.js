import apiCaller from '../helpers/apiCaller'

const create = async ({ shop, accessToken, data }) => {
  return await apiCaller({
    shop,
    accessToken,
    endpoint: `collects.json`,
    method: 'POST',
    data,
  })
}

const Collect = {
  create,
}

export default Collect
