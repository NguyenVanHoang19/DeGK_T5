const express = require("express")
const app = express();
const aws = require("aws-sdk")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json({extended:false}));
app.set("view engine","ejs")
app.set("views","./views")
//config
const region = "us-east-2";
const accessKeyId = "";
const secretAccessKey = "";
app.listen(5000,(err)=>{
    if(err)
        console.log("Loi: ",err);
    else
        console.log("server runing port 5000");
});

const dynamoDB = new aws.DynamoDB.DocumentClient({
    region: region,
    accessKeyId : accessKeyId,
    secretAccessKey : secretAccessKey
})
// get danh sach Linh Kien
app.get("/",(req,res)=>{
    const paramsDanhSachLinhKien = {
        TableName : "LinhKien",
    };
    dynamoDB.scan(paramsDanhSachLinhKien,(error,data)=>{
        if(error)
            console.log(JSON.stringify(error,null,2));
        else 
            res.render("index",{
                linhKien : data.Items
            });
    });
});
// add linh kien /api/addLinhKien
app.post("/api/addLinhKien",(req,res)=>{
    const {maLinhKien,ten,donViTinh,gia,thongSoKyThuat} = req.body;
    console.log(maLinhKien);
    const linhKien = {
        maLinhKien : maLinhKien,
        ten : ten,
        donViTinh : donViTinh,
        gia : gia,
        thongSoKyThuat : thongSoKyThuat
    };
    const paramsAddLinhKien = {
        TableName : "LinhKien",
        Item: linhKien
    };
    dynamoDB.put(paramsAddLinhKien,(error,data)=>{
        if(error){
            console.log("Loi",error);
            return res.json({msg:"Lỗi khi thêm"});
        }
        else 
            res.redirect("/");
           // return res.json({msg:"Thêm thành công!!!!"});
    });
});