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

const _delete = async ({ shop, accessToken, id }) => {
  return await apiCaller({
    shop,
    accessToken,
    endpoint: `custom_collections/${id}.json`,
    method: 'DELETE',
  })
}

const find = async ({ shop, accessToken, limit, pageInfo, filter, title, handle }) => {
  let _limit = limit ? parseInt(limit) : 20

  let endpoint = `custom_collections.json?limit=${_limit}${filter || ''}`
  if (pageInfo) {
    endpoint += `&page_info=${pageInfo}`
  }
  if (title) {
    endpoint += `&title=${title}`
  }
  if (handle) {
    endpoint += `&handle=${handle}`
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
  delete: _delete,
}

export default CustomCollection
