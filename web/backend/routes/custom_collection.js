import Controller from './../controllers/custom_collection.js'

export default function productRoute(app) {
  app.post('/api/custom-collections', Controller.createCustomCollections)
}
