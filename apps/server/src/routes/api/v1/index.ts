import { Router } from 'express';
import { eventRouter } from './eventRouter';
import { authRouter } from './authRouter';
import { userRouter } from './userRouter';
const v1Router = Router();

// Routes goes here

v1Router.get('/', (req, res)=>{
    res.send("Welcome");
});

v1Router.use('/events', eventRouter);

v1Router.use('/auth', authRouter);

v1Router.use('/users', userRouter);

export { v1Router }
