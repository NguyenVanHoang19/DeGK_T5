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
// delete linh kien
app.post("/deleteLinhKien",(req,res)=>{
    const maLinhKien = req.body.maLinhKien;
    const paramsDeleteLinhKien= {
        TableName : "LinhKien",
        Key : {
            "maLinhKien" : maLinhKien,
        },
    };
    dynamoDB.delete(paramsDeleteLinhKien,(error,data)=>{
        if(error)
            console.log(error)
        else  
            res.redirect("/");
    });
});

// render form update
app.post("/updateForm",(req,res)=>{
    const {maLinhKien,ten,donViTinh,gia,thongSoKyThuat} = req.body;
    console.log(maLinhKien)
    const linhKien = {
        maLinhKien : maLinhKien,
        ten : ten,
        donViTinh : donViTinh,
        gia : gia,
        thongSoKyThuat : thongSoKyThuat
    };
    res.render("formUpdate",{
        linhKien : linhKien
    });
});

// update Linh Kien
app.post("/updateLinhKien",(req,res)=>{
    const {maLinhKien,ten,donViTinh,gia,thongSoKyThuat} = req.body;
    const paramsUpdateLinhKien = {
        TableName : "LinhKien",
        Key : {
            "maLinhKien" : maLinhKien
        },
        UpdateExpression: "set ten = :ten , donViTinh = :dvt , gia = :gia , thongSoKyThuat = :thongSoKyThuat",
        ExpressionAttributeValues:{
            ":ten": ten,
            ":dvt": donViTinh,
            ":gia": gia,
            ":thongSoKyThuat": thongSoKyThuat
        },
        ReturnValues: "UPDATED_NEW",
    };
    dynamoDB.update(paramsUpdateLinhKien,(error,data)=>{
        if(error)
            console.log(error);
        else
            res.redirect("/");
    });
});

/// tim kiem ten linh kien theo ten
app.post("/timKiemLinhKienTheoTen",(req,res)=>{
    const ten = req.body.ten;
    console.log(ten);
    const paramsTimKiemTheoTen = {
        TableName : "LinhKien",
        FilterExpression: "contains(ten, :t)",
        ExpressionAttributeValues:{
            ":t" : ten
        },
    };
    dynamoDB.scan(paramsTimKiemTheoTen,(error,data)=>{
        if(error)
            console.log(error);
        else 
            res.render("index",{
                linhKien: data.Items
            });
    });
});

// tim kiem tuyet doi
app.post("/timKiemTuyetDoiTheoTen",(req,res)=>{
    const ten = req.body.ten;
    const paramsTimKiemTheoTenTuyetDoi = {
        TableName : "LinhKien",
        FilterExpression: "ten = :t",
        ExpressionAttributeValues:{
            ":t":ten
        },
    };
    dynamoDB.scan(paramsTimKiemTheoTenTuyetDoi,(error,data)=>{
        if(error)
            console.log(error);
        else 
            res.render("index",{
                linhKien : data.Items
            });
    });
})