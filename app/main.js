const weather = new Weather() 
const renderer = new Render()

const handleSearch  = async function(){
    const city = $("#city").val()
    let cities = await weather.getCityData(city)
    cities = weather.getCityDataArr()
    renderer.renderData(cities)
}

const loadPage = async function(){
    await weather.getDataFromDB()
    navigator.geolocation.getCurrentPosition(async position => {
        await weather.getCityData(position.coords)
        renderer.renderData(weather.getCityDataArr())
    }, async error => {
        await renderer.renderData(weather.getCityDataArr())
    })
}

$("#cities").on("click", ".material-icons", async function(){
    const name = $(this).closest(".card-image").find(".name").text()
    const iconType = $(this).text()
    if(iconType === "add_circle"){
        await weather.saveCity(name)
    }else{
        await weather.removeCity(name)
    }
    renderer.renderData(weather.getCityDataArr())
})

$("#cities").on("click", ".card-content a", async function() {
    const name = $(this).closest(".city").find(".card-image").find(".name").text()
    await weather.changeCity(name)
    renderer.renderData(weather.getCityDataArr())
})

loadPage()