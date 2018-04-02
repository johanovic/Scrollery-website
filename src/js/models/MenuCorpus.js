import MenuCombinations from './MenuCombinations.js'
import MenuColumns from './MenuColumns.js'
import MenuImages from './MenuImages.js'
import MenuArtefacts from './MenuArtefacts.js'

/**
 * A corpus is collection of all consituent objects.
 * 
 * A corpus is comprised of a number of combinations, columns, images, and artefacts.
 * 
 * @class
 */
class MenuCorpus {

  /**
   * @param {post}          an instance of Axios $post.
   * @param {user} Number   the user id for the model
   * @param {set}           the set function which the framework uses for reactivity
   */
  constructor(post, user, set) {
    this._post = post
    this._user = user
    this._set = set || ((object, key, value) => { object[key] = value })

    this.combinations = new MenuCombinations(this._post, this._user, this._set)
    this.columns = new MenuColumns(this._post, this._user, this._set)
    this.images = new MenuImages(this._post, this._user, this._set)
    this.artefacts = new MenuArtefacts(this._post, this._user, this._set)

    this.populateCombinations()
  }

  populateCombinations() {
    this.combinations.populate() 
  }

  populateColumnsOfScrollVersion(scrollVersionID, combinationID) {
    this.columns.populate({version_id: scrollVersionID, combID: combinationID})
    .then(res => {
      let columnIDArray = []
      res.forEach(column => {
        columnIDArray.push(column[this.columns.itemIDKey])
      })
      if (!this.combinations.itemAtIndex(scrollVersionID) || columnIDArray !== this.combinations.itemAtIndex(scrollVersionID).columns) {
        this.combinations.changeItemValue(scrollVersionID, 'columns', columnIDArray)
      }
    })
  }

  populateImagesOfScrollVersion(scrollVersionID, combinationID) {
    this.images.populate({combID: combinationID})
    .then(res => {
      let imageIDArray = []
      res.forEach(image => {
        imageIDArray.push(image[this.images.itemIDKey])
      })
      if (!this.combinations.itemAtIndex(scrollVersionID) || imageIDArray !== this.combinations.itemAtIndex(scrollVersionID).images) {
        this.combinations.changeItemValue(scrollVersionID, 'images', imageIDArray)
      }
    })
  }

  populateArtefactsofImage(scrollVersionID, imageID) {
    this.artefacts.populate({image_id: imageID, version_id: scrollVersionID})
    .then(res => {
      let artefactIDArray = []
      res.forEach(artefact => {
        artefactIDArray.push(artefact[this.artefacts.itemIDKey])
      })
      if (!this.images.itemAtIndex(imageID) || artefactIDArray !== this.images.itemAtIndex(imageID).artefacts) {
        this.images.changeItemValue(imageID, 'artefacts', artefactIDArray)
      }
    })
  }
}

export default MenuCorpus