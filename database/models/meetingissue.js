'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class MeetingIssue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      MeetingIssue.belongsTo(models.Meeting, { foreignKey: 'meetingId' })
      MeetingIssue.belongsTo(models.Issue, { foreignKey: 'issueId' })
    }
  }
  MeetingIssue.init({
    meetingId: DataTypes.INTEGER,
    issueId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MeetingIssue',
    tableName: 'MeetingIssues',
    underscored: true
  })
  return MeetingIssue
}
