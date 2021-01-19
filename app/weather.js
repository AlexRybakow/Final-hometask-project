class Weather{
    constructor(){
        this.cityData = []
    }
    async getDataFromDB(){
        const cities = await $.get('/cities')
        cities.forEach(async c => {
            if(!moment(c.updatedAt).isAfter(moment().subtract(3, 'hours'))){
                await this.updateCity(c.name)
            }
            c.updatedAt = moment(c.updatedAt).format("lll")
            this.cityData.push({...c, saved: true})
        })
    }
    async getCityData(city){
        let cityWeather
        if(city instanceof GeolocationCoordinates){
            const coords = `lat=${city.latitude}&lon=${city.longitude}`
            cityWeather = await $.get(`/city/${coords}`)
        }else{
            city = `q=${city}`
            cityWeather = await $.get(`/city/${city}`)
        }
        this.cityData.unshift(cityWeather)
    }
    async saveCity(city){
        const newCity = this.cityData.find(cdata => cdata.name == city)
        newCity.saved = true
           try{
            const addCity = await fetch('/city', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCity) 
            });
            } catch(error){
            console.log("the city was not added");
        }
            }
            async removeCity(city){
                const deletedCity = this.cityData.find(cdata => cdata.name == city)
                    deletedCity.saved = false
                try{
                    const deleteCity = await fetch(`/city/${city}`,{
                        method: 'DELETE',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify(deletedCity)
                    })
                    
                }catch(error){
                    console.log("the city was not deleted")
                }
            }
    getCityDataArr(){return this.cityData}
    async changeCity(city){
        try{
            const updatedCity = await fetch(`/city/${city}`, {
                method: 'PUT',
                headers: {},
                body: JSON.stringify({}) 
              });
            const index = this.cityData.findIndex(c => c.name === updatedCity.name)
            this.cityData[index]= {...updatedCity, saved: this.cityData[index].saved}
        } catch(error){
            console.log(error);
        }
    }
}
