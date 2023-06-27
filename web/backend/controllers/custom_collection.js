import getCurrentSession from '../../auth/getCurrentSession.js'
import ResponseHandler from '../helpers/responseHandler.js'
import BullmqJob from '../middlewares/bullmq_job.js'

export default {
  createCustomCollections: async (req, res) => {
    console.log('\n----------------------------------------')

    try {
      const { shop, accessToken } = getCurrentSession(req, res)

      const collections = req.body

      let data = {}
      let group = `bulk_custom_collection_group_${Date.now()}`
      data = { jobs: [], group }
      for (
        let page = 1, limit = 10, totalPages = Math.ceil(collections.length / limit);
        page <= totalPages;
        page++
      ) {
        let job = await BullmqJob.create(
          'bulk_custom_collection',
          {
            shop,
            collections: collections.slice((page - 1) * limit, page * limit),
            _data: collections,
          },
          group
        )
        data.jobs.push(job)
      }

      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/custom-collections error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
