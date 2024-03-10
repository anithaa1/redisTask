const User = require('../model/user_model');
const redisClient = require('../config/redis_config');
const { log } = require('console');
const { checkRedisConnection } = require('../lib/redis.helper');




const getAllUsers = async (req, res) => {
    let users;
    try {
        
        checkRedisConnection();
        if (redisClient.connected) {
            const cachedUsers = await redisClient.get('users');
         console.log(cachedUsers, 'Fetching users from Redis cache');
            if (cachedUsers) {
                
                res.json(JSON.parse(cachedUsers));
                return; 
            }
        }
 const users = await User.find();
        console.log(users, 'Fetching users from MongoDB');
        
        if (users.length > 0) {
            res.json(users);

            
            await redisClient.set('users', JSON.stringify(users));
        } else {
            res.json([]); 
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
};
;
 
  const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
     
      if (redisClient && redisClient.connect) { 
        
        const cachedUser = await redisClient.get(`user:${id}`);
        console.log(cachedUser,' Fetching user from Redis cache');
        if (cachedUser) {
          
          res.json(JSON.parse(cachedUser));
          return; 
        }
      }
      const user = await User.findById(id);
      console.log( user,'Fetching user from MongoDB');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      await redisClient.set(`user:${id}`, JSON.stringify(user));
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Error fetching user' });
    }
  };
  

const createUser = async (req, res) => {
    const { name, email } = req.body;
 
    try {
        const newUser = new User({ name, email });
        await newUser.save();
        
       
        if (redisClient && redisClient.status === 'ready') {
           
            await redisClient.del('users');
        }

        res.status(201).json(newUser);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
           
            return res.status(400).json({ error: 'Email address already exists' });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};
  
 
  

  
  const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
    await redisClient.del(`user:${id}`);
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error updating user' });
    }
};
  
  const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
       const dele=await redisClient.del(`user:${id}`);
       console.log(dele,'deleting user from Redis cache');
     
      await redisClient.del('users');
      res.json(deletedUser);
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Error deleting user' });
    }
  };
  
  module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };