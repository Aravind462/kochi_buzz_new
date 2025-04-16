'use strict';

import { sequelizeConfig } from '../helpers/sequelize';
import { Model, DataTypes } from 'sequelize';
import { UserModel } from './user.model';
import { EventModel } from './event.model';

export class NotificationModel extends Model {
  public id!: number;
  public event_id!: number;
  public user_id!: number;
  public type!: string;
  public is_read!: boolean;
}

NotificationModel.init({
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
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize: sequelizeConfig,
  tableName: 'notifications',
  underscored: true,
  timestamps: false
});