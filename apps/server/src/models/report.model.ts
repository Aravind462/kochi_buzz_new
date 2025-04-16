'use strict';

import { sequelizeConfig } from '../helpers/sequelize';
import { Model, DataTypes } from 'sequelize';
import { UserModel } from './user.model';
import { EventModel } from './event.model';

export class ReportModel extends Model {}

ReportModel.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'id'
    }
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EventModel,
      key: 'id'
    }
  },
  report: {
    type: DataTypes.TEXT
  }
}, {
  sequelize: sequelizeConfig,
  tableName: 'reports',
  underscored: true,
  timestamps: false
});