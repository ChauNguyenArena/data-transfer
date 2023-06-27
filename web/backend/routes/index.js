import productRoute from './product.js'
import storeSettingRoute from './store_setting.js'
import submitionRoute from './submition.js'
import CustomCollections from './custom_collection.js'

export default function adminRoute(app) {
  storeSettingRoute(app)
  productRoute(app)
  submitionRoute(app)
  CustomCollections(app)
}
