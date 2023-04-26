'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Value extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Value.belongsTo(models.User, { foreignKey: 'userId' })
      Value.belongsTo(models.Meeting, { foreignKey: 'meetingId' })
    }
  }
  Value.init({
    userId: DataTypes.INTEGER,
    meetingId: DataTypes.INTEGER,
    isValue: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Value',
    tableName: 'Values',
    underscored: true
  })
  return Value
}
