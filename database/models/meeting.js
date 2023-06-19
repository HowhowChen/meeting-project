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
      Meeting.hasMany(models.Comment, { foreignKey: 'meetingId' })
      Meeting.hasMany(models.Value, { foreignKey: 'meetingId' })
      Meeting.hasMany(models.MeetingIssue, { foreignKey: 'meetingId' })
    }
  }
  Meeting.init({
    name: DataTypes.TEXT,
    content: DataTypes.TEXT,
    uuid: DataTypes.STRING,
    sender: DataTypes.STRING,
    receiver: DataTypes.TEXT,
    categoryId: DataTypes.INTEGER,
    platformId: DataTypes.INTEGER,
    countryId: DataTypes.INTEGER,
    meetingDate: DataTypes.STRING,
    acceptanceDate: DataTypes.STRING,
    importDate: DataTypes.STRING,
    exportDate: DataTypes.STRING,
    organization: DataTypes.STRING,
    link: DataTypes.TEXT,
    password: DataTypes.TEXT,
    fileName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Meeting',
    tableName: 'Meetings',
    underscored: true
  })
  return Meeting
}
