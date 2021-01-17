class Render{
    constructor(){
        this.source = $("#city-block").html();
        this.template = Handlebars.compile(this.source);
    }
    renderData(cities){
    const newHTML = this.template({ cities });
    $("#cities").empty();
    $("#city").val("")
    $("#cities").append(newHTML);
    }
}