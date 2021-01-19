const express = require("express");
const cityRouter = express.Router();
const moment = require("moment");
const cityModel = require("../models/mongoose");
const axios = require("axios").default;

cityRouter.get("/city/:cityName", async (req, res) => {
  const { cityName } = req.params;
  const url = `http://api.openweathermap.org/data/2.5/weather?${cityName}&appid=2a3860cbf232b1d4e31f20174b149693&units=metric`;
  try {
    let response = await axios.get(url);
    response = response.data
    const dateString = moment.unix(response.dt).format("lll");
    const cityWeather = {
      name: response.name,
      temperature: response.main.temp,
      condition: response.weather[0].main,
      conditionPic: response.weather[0].icon,
      updatedAt: dateString
    };
    res.send(cityWeather);
  } catch (error) {
      console.log(error)
    res.end("error");
  }
});

cityRouter.get("/cities", (req, res) => {
  cityModel.find({}, (err, cities) => {
    res.send(cities);
  });
});

cityRouter.post("/city", async (req, res) => {
  const newCity = new cityModel(req.body);
  await newCity.save();
  res.send("done");
});

cityRouter.delete("/city/:cityName", (req, res) => {
  const { cityName } = req.params;
  cityModel.findOneAndDelete({ name: cityName }, (err, city) => {
    res.send(city);
  });
});

cityRouter.put('/city/:cityName', async (req, res) =>{
    let cityWeather
    try{
        const {cityName} = req.params
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=2a3860cbf232b1d4e31f20174b149693&units=metric`;
        let response =await  axios.get(url)
        cityWeather = {
            name: response.data.name,
            temperature: response.data.main.temp,
            condition: response.data.weather[0].main,
            conditionPic: response.data.weather[0].icon,
            updatedAt: moment().format("lll")
        }
        const updatedCity = await cityModel.findOneAndUpdate({name : cityName}, cityWeather, {new: true, useFindAndModify: false})
    }catch(error){
        console.log("something went wrong in the update " + error);
    }finally{
        res.send(cityWeather)
    }
})

module.exports = cityRouter;