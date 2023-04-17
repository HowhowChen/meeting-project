'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Platform extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Platform.hasMany('Meeting', { foreignKey: 'platformId' })
    }
  }
  Platform.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Platform',
    tableName: 'Platforms',
    underscored: true
  })
  return Platform
}
