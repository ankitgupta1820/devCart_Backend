import express from "express";
import connectDB from "./config/connectDB.js";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(
	cors({
	  origin: [process.env.FRONTEND_URL],
	  
	  methods: ["GET", "PUT", "DELETE", "POST"],
	  credentials: true,
	})
  );
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/config/paypal", (req, res) => {
	res.send(process.env.PAYPAL_CLIENT_ID);
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if(process.env.NODE_ENV=="production"){
    app.use(express.static('frontend/build'))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
    })
} else {
	app.get("/", (req, res) => {
		res.send("API is running....");
	});
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode at port ${PORT}`.yellow.bold
	);
});
