'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Minute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Minute.belongsTo(models.User, { foreignKey: 'userId' })
      Minute.belongsTo(models.Meeting, { foreignKey: 'meetingId' })
    }
  }
  Minute.init({
    meetingId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    isDone: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Minute',
    tableName: 'Minutes',
    underscored: true
  })
  return Minute
}
