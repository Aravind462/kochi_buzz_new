import { defineEventAssociations } from "./event.model";
import { defineUserAssociations } from "./user.model"

export const defineAssociation = ()=>{
    defineUserAssociations();
    defineEventAssociations();
}