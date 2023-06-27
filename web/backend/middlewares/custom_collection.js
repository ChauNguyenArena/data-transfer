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

const find = async ({ shop, accessToken, limit, pageInfo, filter, title }) => {
  let _limit = limit ? parseInt(limit) : 20

  let endpoint = `products.json?limit=${_limit}${filter || ''}`
  if (pageInfo) {
    endpoint += `&page_info=${pageInfo}`
  }
  if (title) {
    endpoint += `&title=${title}`
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
