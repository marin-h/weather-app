const path = require('path')

const express = require('express')

const hbs = require('hbs')

const app = express()

const geocode = require('./geocode')

const forecast = require('./forecast')

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPaths = path.join(__dirname, '../templates/views')
const partialsPaths = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPaths)
hbs.registerPartials(partialsPaths)

// Setup static directory to serve
app.use(
    express.static(
        publicDirectoryPath
    )
)


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Marin'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Marin'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        msg: 'My help msg',
        name: 'Marin'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    } else {
        geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({ error })
            }
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({error})
                }
                return res.send({address: req.query.address, location, forecast: forecastData})
            })
        }) 
    }
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        error: 'Sorry, the help article you were looking for does not exists.',
        name: 'Marin'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Weather App',
        error: 'Sorry, the page you were looking for does not exists.',
        name: 'Marin'
    })
})

// app.com
// app.com/help
// app.com/about

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})