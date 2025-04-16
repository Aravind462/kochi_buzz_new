import { DataTypes, Model } from "sequelize";
import { sequelizeConfig } from "../helpers/sequelize";
import { EventModel } from "./event.model";
import { IUser } from "@repo/types/lib/schema/user";

export class UserModel extends Model<IUser> implements IUser {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: string;
}

UserModel.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM("user", "organizer", "admin"),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  sequelize: sequelizeConfig,
  tableName: 'users',
  underscored: true,
  timestamps: false
});

export const defineUserAssociations = ()=>{
  UserModel.hasMany(EventModel, {
    foreignKey: 'organizer_id'
  });

  UserModel.belongsToMany(EventModel, {
    through: 'event_subscriptions',
    foreignKey: 'user_id'
  });
}