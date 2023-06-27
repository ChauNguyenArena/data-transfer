import BackgroundJob from './background_job.js'
import BullmqActions from './bullmq_actions.js'
import CustomCollection from './custom_collection.js'
import StoreSetting from './store_setting.js'

const create = async (data, backgroundJobId) => {
  try {
    const { shop, collections } = data

    console.log('collections :>> ', collections)
    let _collections = collections.map((collection) => {
      let _collection = {}
      _collection.title = collection.name
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
        setTimeout(async () => {
          await CustomCollection.create({
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

const BulkCustomCollection = { create }

export default BulkCustomCollection
