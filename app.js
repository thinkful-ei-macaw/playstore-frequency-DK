const debug = require('debug');
const playstore = require('./playstore.js');
const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  const { genres, sort } = req.query;
  const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']
  const validSort = ['Rating', 'App']

  let filteredResults = [...playstore]
  
  if (genres && !validGenres.includes(genres)) {
    return res
      .status(400)
      .send('Parameter `genres` must be valid')
  }
  if (genres) {
    filteredResults = filteredResults.filter(a => a.Genres.includes(genres));
  }

  if (sort && !validSort.includes(sort)) {
    return res
      .status(400)
      .send('Sort must be either Rating or App')
  }

  if (sort) {
    filteredResults.sort((a, b) => {
      return a[sort] < b[sort] ? -1: a[sort] > b[sort] ? 1 : 0;
    });
  }

  res.json(filteredResults)
});

app.get('/frequency', (req, res) => {
  const { s } = req.query;

  if (!s) {
    return res
      .status(400)
      .send('Invalid request');
  }

  if (typeof(s) !== 'string') {
    return res
      .status(400)
      .send('Please submit a string')
  }

  const counts = s
    .toLowerCase()
    .split('')
    .reduce((acc, curr) => {
      if (acc[curr]) {
        acc[curr]++;
      } else {
        acc[curr] = 1;
      }
      return acc;
    }, {});

  const unique = Object.keys(counts).length;
  const average = s.length / unique;
  let highest = '';
  let highestVal = 0;

  Object.keys(counts).forEach(k => {
    if (counts[k] > highestVal) {
      highestVal = counts[k];
      highest = k;
    }
  });

  counts.unique = unique;
  counts.average = average;
  counts.highest = highest;
  res.json(counts);
});

// sort.charAt(0).toUpperCase + sort.slice(1).toLowerCase

module.exports = app;

// const express = require('express');
// const morgan = require('morgan');

// const app = express();

// app.use(morgan('dev'));

// const google = require('./google-data.js');

// app.get('/apps', (req, res) => {
//   const {sort, genres} = req.query;
//   let googleArray = [...google];

//   if(!sort) {
//     res
//         .status(400)
//         .send('You need to select sort!');
//     }

//     if(sort !== 'App' && sort !== 'Rating') {
//         res
//         .status(400)
//         .send('You must select rating or app');
//     }

//     if(sort) {
//         if(sort === 'Rating') {
//             googleArray.sort((a, b) => {
//                 return a['Rating'] > b['Rating'] ? 1 : a['Rating'] < b['Rating'] ? -1 : 0;
//             })
//         }
//         if(sort === 'App') {
//             googleArray.sort((a,b) => {
//                 return a['App'] > b['App'] ? 1 : a['App'] < b['App'] ? -1 : 0;
//             })
//         }
//     } 

    

//     if(genres) {
//         const genre = [ 'Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']

//         if(genre.includes(genres)) {
//             googleArray = googleArray.filter( item => {
//                 return item['Genres'].includes(genres); 
//         })} else {
//             res.status(400).send('Genre not included, please pick another');
//         }
//     }
  
  
  
//     res.json(googleArray);
// });