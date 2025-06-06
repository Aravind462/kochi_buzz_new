'use strict';

import { Model, DataTypes } from 'sequelize';
import { sequelizeConfig } from '../helpers/sequelize';
import { UserModel } from './user.model';
import { IEvent } from '@repo/types/lib/schema/event';

export class EventModel extends Model<IEvent> implements IEvent {
  public id!: number;
  public title!: string;
  public description!: string;
  public from_date!: Date;
  public from_time!: string;
  public to_date!: Date;
  public to_time!: string;
  public venue!: string;
  public longitude!: number;
  public latitude!: number;
  public category!: string;
  public price!: number;
  public organizer_id!: number;
  public status!: string;
}

EventModel.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  from_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  from_time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  to_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  to_time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  venue: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  organizer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
    allowNull: false,
    defaultValue: 'Pending'
  }
}, {
  sequelize: sequelizeConfig,
  tableName: 'events',
  underscored: true,
  timestamps: false
});

export const defineEventAssociations = ()=>{
  EventModel.belongsTo(UserModel, {
    foreignKey: 'organizer_id'
  });

  EventModel.belongsToMany(UserModel, {
    through: 'event_subscriptions',
    foreignKey: 'event_id'
  });
}