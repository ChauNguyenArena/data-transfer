import apiCaller from '../helpers/apiCaller.js'

const create = async ({ shop, accessToken, data }) => {
  return await apiCaller({
    shop,
    accessToken,
    endpoint: `custom_collections.json`,
    method: 'POST',
    data,
  })
}

const find = async ({ shop, accessToken, limit, filter }) => {
  let _limit = limit ? parseInt(limit) : 20

  let endpoint = `products.json?limit=${_limit}${filter || ''}`
  if (pageInfo) {
    endpoint += `&page_info=${pageInfo}`
  } else {
    if (order) {
      endpoint += `&order=${order}`
    } else {
      endpoint += `&order=updated_at+desc`
    }
  }

  return await apiCaller({
    shop,
    accessToken,
    endpoint,
    pageInfo: true,
  })
}

const CustomCollection = {
  create,
  find,
}

export default CustomCollection
