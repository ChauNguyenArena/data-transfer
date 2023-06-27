import apiCaller from '../helpers/apiCaller'

const create = async ({ shop, accessToken, data }) => {
  //data = {"collect": {"product_id": string, "collection_id":string}}
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
