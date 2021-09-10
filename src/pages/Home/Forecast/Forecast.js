import Day from './Day/Day';
import { MDBCard, MDBCol, MDBContainer, MDBRow } from 'mdbreact'
import React, { useEffect, useState } from 'react'
import { toFahrenheit } from 'celsius'
import { useLocation } from "react-router-dom";
import imagesOfWeather from '../../../dist/obj/imagesOfWeather';

//css
import './forecast.css'

//fakeApi
import { currentOj, onlineLocationObj } from '../../../dist/obj/fakeApi';

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { getForecast, getCurrentWeather } from '../../../redux/weather/weather-actions';
import { addToFavorites, deleteFavoriteById } from '../../../redux/favorites/favorites-actions';
import { getLocationByGeoposition } from '../../../redux/location/location-actions';

const Forecast = (props) => {
    const dispatch = useDispatch()
    const [current, setCurrent] = useState([])
    const [heartIcon, setHeartIcon] = useState('far fa-heart')
    const [favoriteText, setFavoriteText] = useState('Add to Favorites')
    const [favoritedChanged, setFavoritedChanged] = useState(false)
    const location = useLocation();

    let favoritesState = useSelector((state) => state.favoritesReducer.favorites)
    let currentWeatherState = useSelector((state) => state.weatherReducer.currentWeather)
    let forecastState = useSelector((state) => state.weatherReducer.forecast)
    let degreeState = useSelector((state) => state.degreesReducer.degree)
    let geoPositionState = useSelector((state) => state.locationReducer.geoPosition)

    const apiCall = (city) => {
        console.log('in apiCall', city)
        // dispatch(getCurrentWeather(city))
    }

    // show location from SEARCH
    useEffect(() => {

        if (location.state == undefined) {

            console.log('inside Searched location')

            //**fake api**
            setCurrent(currentOj)

            // ** api **
            // apiCall(props.cityKey)

            // if (props.cityName == '' && props.lat != '' & props.lon != '') {
            //     console.log('inside Tel Aviv location')
            //     props.setCityName('Tel Aviv, Israel')
            //     props.setCountryId('IL')
            // }

            initialIcons()
        }

    }, [props.cityKey, props.cityName])

    // //*****set STATE from SEARCHED result******
    useEffect(() => {
        console.log('in searched result useffect state')

        // //**fake api**
        setCurrent(currentOj)

        //api
        // setCurrent(currentWeatherState)

    }, [currentWeatherState])


    //show location from FAVORITE
    useEffect(() => {
        if (location.state != undefined) {
            console.log('inside Favorite location',)
            setCurrent([location.state.cityFromFavorites])
            props.setCityKey(location.state.cityFromFavorites.cityKey)
            props.setCityName(location.state.cityFromFavorites.cityName)

            //api
            // apiCall(location.state.cityFromFavorites.cityKey)

        }


    }, [location.state])

    //set STATE from Favorited result
    useEffect(() => {
        console.log('insite favorite STATE')

        let keyOfCity;
        //set key from favorite
        if (location.state != undefined)
            keyOfCity = location.state.cityFromFavorites.cityKey
        //set key from searched
        else
            keyOfCity = props.cityKey

        favoritesState.map(f => {
            if (f.ID == keyOfCity && !favoritedChanged) {
                setHeartIcon('fas fa-heart')
                setFavoriteText('Remove from Favorites')
            }

        })
        //api
        // setCurrent(currentWeatherState)
        localStorage.setItem('favoritesStorage', JSON.stringify(favoritesState));


    }, [favoritesState, props.cityName])


    //show location from BROWSER Geolocation
    useEffect(() => {

        if (location.state == undefined) {

            console.log('inside Online location')

            //fake api
            props.setCityKey(onlineLocationObj.Key)
            props.setCityName(`${onlineLocationObj.LocalizedName}, ${onlineLocationObj.Country.LocalizedName}`)
            props.setCountryId(onlineLocationObj.Country.ID)

            //api
            // dispatch(getLocationByGeoposition(props.lat, props.lon))

        }

    }, [props.lat, props.lon])

    //*****set STATE from  Geolocation******
    useEffect(() => {
        // if (location.state == undefined) {
        console.log('in Geolocation useffect state')
        // props.setCityKey(geoPositionState.Key)
        // props.setCityName(geoPositionState.LocalizedName)
        // setCurrent(geoPositionState)
        // }
    }, [geoPositionState])


    const initialIcons = () => {
        setFavoriteText('Add to Favorites')
        setHeartIcon('far fa-heart')
    }

    const addOrDeleteFavorite = () => {
        setFavoritedChanged(true)
        if (favoriteText.includes('Add'))
            addFavorite()
        else
            deleteFavorite()
    }

    const deleteFavorite = () => {
        dispatch(deleteFavoriteById(props.cityKey)).then(() => {
            console.log('in delete')
            setHeartIcon('far fa-heart')
            setFavoriteText('Add to Favorites')

        })
    }

    const addFavorite = () => {
        let favorite = {
            CountryId: props.countryId,
            ID: props.cityKey,
            Name: props.cityName,
            Current: document.getElementById('currentWeather').innerText,
            Degrees: document.getElementById('degrees').innerText
        }
        dispatch(addToFavorites(favorite)).then(() => {
            // alert('add to favorites')
            setHeartIcon('fas fa-heart')
            setFavoriteText('Remove from Favorites')
        })
    }
    return (
        <>
            <MDBCard className='CardOfWeather col-sm-12 customCard' style={{ padding: '0' }}>
                {
                    current.length > 0 &&
                    current.map((c, index) => {
                        let nameOfCity = ''
                        c.cityName != undefined ? nameOfCity = c.cityName : nameOfCity = props.cityName

                        // console.log('props.countryId', c.CountryId)
                        return <React.Fragment key={index}>
                            <MDBRow>

                                <MDBCol sm='12'>
                                    <h3 className='customHeadline text-center marginAuto'> Today</h3>
                                </MDBCol>

                                <hr style={{ width: '100%' }} />

                                <MDBCol sm='12' lg='4' className='text-center marginAuto'>

                                    {
                                        nameOfCity.split(',').map((n, i) => {
                                            return i == 0 ?
                                                <h2 key={`city${i}`} className='cityHeadline'> {n}</h2>
                                                : <h3 key={`country${i}`}
                                                    className='fontVarianteSmallCaps customHeadline countryHeadline'>
                                                    {n}
                                                </h3>
                                        })
                                    }

                                    <img className='m0' src={`https://www.countryflags.io/${c.CountryId != undefined ? c.CountryId : props.countryId}/shiny/64.png`}>
                                    </img>

                                    <p style={{ fontSize: 'x-large' }}>
                                        {
                                            degreeState == 'Celsius' ?
                                                <span><span id='degrees' className='degressOfToday'>{c.Temperature.Metric.Value}</span>
                                                    <sup className='degressOfTodaySup'>°</sup>
                                                </span>
                                                : <span> <span id='degrees' className='degressOfToday'>{toFahrenheit(c.Temperature.Metric.Value)}</span>
                                                    <sup className='degressOfTodaySup'>℉</sup>
                                                </span>
                                        }
                                    </p>
                                </MDBCol>

                                <MDBCol sm='12' lg='4' className='text-center marginAuto'>
                                    {
                                        imagesOfWeather.map((image, indexOfImg) => {
                                            if (c.WeatherText.includes(`${image.type}`))
                                            // if (c.WeatherText == image.type)
                                            {
                                                return <img
                                                    className='imageOfWeather'
                                                    key={indexOfImg}
                                                    src={image.src}
                                                    alt={image.alt} height="200"
                                                    style={{ maxWidth: '100%' }
                                                    } />
                                            }

                                        })
                                    }

                                    {/* {
                                    c.WeatherText.includes('Sunny') ?
                                        <i className="fas fa-sun fa-4x"></i>
                                        : c.WeatherText.includes('cloud') ?
                                            c.WeatherText.includes('shower') ?
                                                <i className="fas fa-cloud-moon-rain fa-4x"></i>
                                                : <i className="fas fa-cloud-sun fa-4x"></i>
                                            : c.WeatherText.includes('Clowdy') ?
                                                <i className=" fas fa-cloud-sun fa-4x"></i>
                                                : ''

                                } */}
                                    <h3 id='currentWeather' className='font-italic'>{c.WeatherText}</h3>
                                </MDBCol>

                                <MDBCol sm='12' lg='4' className='text-center marginAuto'>

                                    <p style={{ cursor: 'pointer' }}
                                        onClick={() => addOrDeleteFavorite()}
                                    ><i className={`${heartIcon} fa-2x`}></i>
                                        <br />{favoriteText}</p>
                                </MDBCol>

                            </MDBRow>
                        </React.Fragment>
                    })

                }
            </MDBCard>
            <MDBRow>
                <Day cityKey={props.cityKey} />
            </MDBRow>
        </>
    )
}
export default Forecast