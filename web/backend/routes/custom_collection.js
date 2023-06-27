import Controller from './../controllers/custom_collection.js'

export default function customCollectionRoute(app) {
  app.post('/api/custom-collections', Controller.createCustomCollections)
}
