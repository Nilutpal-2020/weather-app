import React, {Component} from "react";
import "./Weather.css"
import not_found_icon from "../Photos/not_found2.png";
import found_photo from "../Photos/weather_icon.png";
import cloudy from "../Photos/cloudy.png";
import snow from "../Photos/snow.png";
import rain from "../Photos/rain.png";
import fog from "../Photos/fog.png";
// import mild_clouds from "../Photos/mild_clouds.png";
import thunderstorm from "../Photos/thunderstorm.png";
import sunny from "../Photos/sunny.png";
import { paths } from "../Values";

export class Weather extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: [],
            city: "",
            temp: "",
            desc: "",
            img_src: not_found_icon,
            animation_class: "",
            res_height: "90px"
        }
    }

    changeCity = (e) => {
        this.setState({city: e.target.value})
    }

    getInfo() {
        fetch(paths.API_URL + new URLSearchParams({
                "q": this.state.city,
                "units": "metric",
                "APPID": paths.API_KEY
            }))
            .then(res => res.json())
            .then(data => {
                if (data.cod === "404") {
                    console.log(data.cod + " Not Found!");
                    this.setState({
                        temp: "",
                        desc: "Invalid Location",
                        img_src: not_found_icon,
                        animation_class: "fadeIn",
                        res_height: "505px"});
                } else {
                    this.setState({
                        results: data,
                        city: data.name + ", " + data.sys.country,
                        temp: Math.round(data.main.temp), 
                        desc: "Feels like " + Math.round(data.main.feels_like) + "°C. " + data.weather[0].description,
                        img_src: (data.weather[0].main.toLowerCase() === "haze") ? 
                                    fog : (data.weather[0].main.toLowerCase() === "clouds") ? 
                                    cloudy : (data.weather[0].main.toLowerCase() === "clear") ?
                                    sunny : (data.weather[0].main.toLowerCase() === "thunderstorm") ?
                                    thunderstorm : (data.weather[0].main.toLowerCase() === "snow") ?
                                    snow : (data.weather[0].main.toLowerCase() === "rain") ?
                                    rain : found_photo,
                        animation_class: "fadeIn", 
                        res_height: "505px"
                    });
                }
            }, (err) => {
                console.log(err);
            })
    }

    render() {
        const {city, temp, desc, img_src, animation_class, res_height} = this.state;
        // console.log(results);
        return (
            <div>
                <div className="content" style={{height: res_height}}>
                    <div className="search">
                        <input type="text" 
                            placeholder="Enter your location"
                            onChange={this.changeCity} />
                        <button type="button"
                            className="btn btn-info"
                            onClick={() => this.getInfo()}
                            >Search</button>
                    </div>

                    <div className={"found " + animation_class}>
                        <p className="title">{city}</p>
                        <img src={img_src} className="card-img-top" alt="Location Found" />
                        {temp !== "" ? 
                                <p className="temp">{temp} &#8451;</p> 
                            : null}
                        <p className="desc">{desc}</p>
                    </div>
                </div>
            </div>
        )
    }
}