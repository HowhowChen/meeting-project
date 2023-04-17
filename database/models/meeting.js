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
      Meeting.hasMany(models.Category, { foreignKey: 'meetingId' })
      Meeting.hasMany(models.Platform, { foreignKey: 'meetingId' })
    }
  }
  Meeting.init({
    name: DataTypes.STRING,
    meetingDate: DataTypes.STRING,
    acceptanceDate: DataTypes.STRING,
    organization: DataTypes.STRING,
    link: DataTypes.STRING,
    password: DataTypes.STRING,
    value: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Meeting',
    tableName: 'Meetings',
    underscored: true
  })
  return Meeting
}
