require('dotenv').config();

const app = require('./src/app.js');
const connectDB = require('./src/config/database.js');

const PORT = process.env.PORT;

const startServer = async () => {
    try{
        await connectDB();
        app.listen(PORT,()=>{
            console.log(`Server Running at http://localhost:${PORT}`);
        });
    }
    catch(error)
    {
        console.error('Server Startup Failed');
        console.error(error.message);
        process.exit(1);
    }
}

startServer();