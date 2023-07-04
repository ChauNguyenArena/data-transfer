import BackgroundJob from './background_job.js'
import BullmqActions from './bullmq_actions.js'
import CustomCollection from './custom_collection.js'
import StoreSetting from './store_setting.js'

const getParentName = (idParent, categories) => {
  return categories.filter((c) => c['term_id'] === idParent)
}

const create = async (data, backgroundJobId) => {
  try {
    const { shop, collections, _data } = data

    // console.log('collections :>> ', collections)
    let _collections = collections.map((collection) => {
      let _collection = {}
      _collection.title =
        collection.parent > 0
          ? `${getParentName(collection.parent, _data)[0].name} > ${collection.name}`
          : collection.name

      // console.log('_collection.title :>> ', _collection.title)

      if (collection.slug) _collection.handle = collection.slug

      if (collection.description) _collection.body_html = collection.description

      // if (collection.thumbnail) _collection.image = { src: collection.thumbnail }

      return _collection
    })

    let result = []

    // get storeSetting
    let storeSetting = await StoreSetting.findOne({ shop })
    const { accessToken, plusStore } = storeSetting

    await new Promise((resolve, reject) => {
      let count = 0
      let total = _collections.length
      if (!total) resolve()
      for (let i = 0; i < total; i++) {
        setTimeout(() => {
          CustomCollection.create({
            shop,
            accessToken,
            data: { custom_collection: _collections[i] },
          })
            .then((res) => {
              console.log(`[${i + 1}/${total}] success`)
              // add to result
              result.push({ id: res['custom_collection'].id })
            })
            .catch((err) => {
              console.log(`[${i + 1}/${total}] failed:`, err.message)
            })
            .then(() => {
              count++
              if (count == total) resolve()

              // update background job progress
              let progress = Math.ceil((count / total) * 100)
              let status =
                progress == 100 ? BackgroundJob.Status.COMPLETED : BackgroundJob.Status.RUNNING
              BullmqActions.updateJobProgress(backgroundJobId, { progress, status, result })
            })
        }, i * 500)
      }
    })
  } catch (error) {
    console.log('BulkCustomCollection.create error :>> ', error)
    throw error
  }
}
const _delete = async (data, backgroundJobId) => {
  try {
    const { shop, collections } = data

    // get storeSetting
    let storeSetting = await StoreSetting.findOne({ shop })
    const { accessToken, plusStore } = storeSetting

    let _collections = []
    for (let collection of collections) {
      let res = await CustomCollection.find({ shop, accessToken, handle: collection.slug })
      if (res.custom_collections) {
        _collections.push(res.custom_collections[0].id)
      }
    }

    let result = []

    await new Promise((resolve, reject) => {
      let count = 0
      let total = _collections.length
      if (!total) resolve()
      for (let i = 0; i < total; i++) {
        setTimeout(() => {
          CustomCollection.delete({
            shop,
            accessToken,
            id: _collections[i],
          })
            .then((res) => {
              console.log(`[${i + 1}/${total}] success`)
              // add to result
              result.push({ id: _collections[i] })
            })
            .catch((err) => {
              console.log(`[${i + 1}/${total}] failed:`, err.message)
            })
            .then(() => {
              count++
              if (count == total) resolve()

              // update background job progress
              let progress = Math.ceil((count / total) * 100)
              let status =
                progress == 100 ? BackgroundJob.Status.COMPLETED : BackgroundJob.Status.RUNNING
              BullmqActions.updateJobProgress(backgroundJobId, { progress, status, result })
            })
        }, i * 500)
      }
    })
  } catch (error) {
    console.log('BulkDeleteCustomCollection.create error :>> ', error)
    throw error
  }
}

const BulkCustomCollection = { create, delete: _delete }

export default BulkCustomCollection
