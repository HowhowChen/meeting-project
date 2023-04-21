'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Meeting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Meeting.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Meeting.belongsTo(models.Platform, { foreignKey: 'platformId' })
      Meeting.belongsTo(models.Country, { foreignKey: 'countryId' })
    }
  }
  Meeting.init({
    name: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    platformId: DataTypes.INTEGER,
    countryId: DataTypes.INTEGER,
    meetingDate: DataTypes.STRING,
    acceptanceDate: DataTypes.STRING,
    organization: DataTypes.STRING,
    link: DataTypes.STRING,
    password: DataTypes.STRING,
    fileName: DataTypes.STRING,
    value: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Meeting',
    tableName: 'Meetings',
    underscored: true
  })
  return Meeting
}
