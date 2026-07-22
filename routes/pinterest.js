const express = require("express");
const axios = require("axios");
const fs = require("fs");

const router = express.Router();

const CACHE = "./cache/pinterest.json";

if (!fs.existsSync(CACHE)) {
    fs.writeFileSync(CACHE, "{}");
}

function load() {
    return JSON.parse(fs.readFileSync(CACHE));
}

function save(data) {
    fs.writeFileSync(CACHE, JSON.stringify(data, null, 2));
}

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

router.get("/", async (req, res) => {

    const q = req.query.q;

    if (!q) {
        return res.json({
            status:false,
            message:"Masukkan query."
        });
    }

    try {

        const { data } = await axios.get(
            "https://api.pexels.com/v1/search",
            {
                headers:{
                    Authorization:process.env.PEXELS_API_KEY
                },
                params:{
                    query:q,
                    per_page:50
                }
            }
        );

        let result = data.photos.map(v=>({
            title:v.alt || q,
            image:v.src.large2x
        }));

        result = shuffle(result);

        const db = load();

        if(!db[q]) db[q]=[];

        result=result.filter(x=>!db[q].includes(x.image));

        if(result.length===0){

            db[q]=[];

            result=data.photos.map(v=>({
                title:v.alt||q,
                image:v.src.large2x
            }));

            result=shuffle(result);

        }

        db[q].push(...result.map(v=>v.image));

        if(db[q].length>200){

            db[q]=db[q].slice(-200);

        }

        save(db);

        res.json({
            status:true,
            author:"ZeyanBot",
            query:q,
            result:result.slice(0,10)
        });

    } catch(err){

        res.json({
            status:false,
            message:err.message
        });

    }

});

module.exports=router;
