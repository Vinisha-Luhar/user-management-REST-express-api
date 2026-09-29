const users=[
    {
        id:1,
        name:"Mayur",
        email:"mayur@gmail.com",
    },
    {
        id:2,
        name:"Vinisha",
        email:"vinisha@gmail.com",
    }
];

const getUsers = (req,res)=>{
    res.status(200).json(users);
};

const getUserById = (req, res) => {
    const id= Number(req.params.id);
    const user = users.find(user => user.id === id);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    res.status(200).json(user);
};

const createUser = (req,res)=>{
    const {name,email} = req.body;
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email
    };
    users.push(newUser);
    res.status(201).json({
        message: "User Created Successfully",
        user: newUser
    });
};

module.exports = {
    getUsers,
    getUserById,
    createUser
}