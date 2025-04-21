import { Router } from 'express';
import { eventRouter } from './eventRouter';
import { authRouter } from './authRouter';
import { userRouter } from './userRouter';
import { mapRouter } from './mapRouter';
import { notificationRouter } from './notificationRouter';
import { reportRouter } from './reportRouter';
const v1Router = Router();

// Routes goes here

v1Router.get('/', (req, res)=>{
    res.send("Welcome");
});

v1Router.use('/events', eventRouter);

v1Router.use('/auth', authRouter);

v1Router.use('/users', userRouter);

v1Router.use('/notifications', notificationRouter);

v1Router.use('/reports', reportRouter);

v1Router.use('/map', mapRouter);

export { v1Router }
