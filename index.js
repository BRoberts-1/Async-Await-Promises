const fs = require('fs');
const superagent = require('superagent');

// Below is using Node file system module to read from our dog.txt file and then uses a callback function to log it. Then we use a package from npm called 'superagent' that helps with making API calls, like Axios. We use callback function .end() that gives us our reponse and if error returns and then logs the error message to console. Then we use another function from fs module to write a file to our project folder called 'dog-img.txt', we receive our res.body.message and then another callback to handle error or log it to console. So it is three nested callback i.e. CALLBACK HELL.

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         if (err) return console.log(err.message);
//         console.log('Random dog image saved to file!');
//       });
//     });
// });

// The below example we use Promises with .then() and in this way can prevent nested callback functions. The beginning is called a 'pending promise' and then when it gets the data it is called a 'resolved promise'. A 'resolved promise' can either be 'fulfilled' or 'rejected' depending if it was successful or if there was an error. For an error we will use th .catch() method. The .catch() method is only called if there was an error, and we have access to the error object to log it to console. We can therefore take the error message and seperate it because .then() is only called if promise is successfull, so we are seperating a fulfilled promise vs an unfulfilled promise i.e. an error and can deal with logic seperately with callback.

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         if (err) return console.log(err.message);
//         console.log('Random dog image saved to file!');
//       });
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// Now, we will promisify the readFile and writeFile functions by making it so they return promises instead of us passing callback functions into them i.e. the functions. So this means: NO CALLBACK.

// Creating a readFilePro which is readFile "Promise" using the Promise constructor. We pass in a file.  It takes in executor function which is called immediately and takes in two args, that are actually functions: resolve and reject. If promise fulfilled successfully the 'resolve' function handles the data and becomes available for the .then() method. If an error occurs, it will use the 'reject' function and this error becomes available for the .catch() method. So we call our readFilePro function and pass in our filename-see below. It returns a promise and we can use our .then() method on it. The data arg(can give this arg whatevername you want e.g. result) is what we return from the promise if it was successfull.

// const readFilePro = (file) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(file, (err, data) => {
//       if (err) reject('I could not find that file.');
//       resolve(data);
//     });
//   });
// };

// readFilePro(`${__dirname}/dog.txt`).then((data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         if (err) return console.log(err.message);
//         console.log('Random dog image saved to file!');
//       });
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// const readFilePro = (file) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(file, (err, data) => {
//       if (err) reject('I could not find that file.');
//       resolve(data);
//     });
//   });
// };

// Now, we will promisify the 'writeFile' function, like we did with the 'readFile' function:
// Remember the .get() function returns a promise. So we return superagent,for a promise, and handle it with the .then() method. For the writeFile, we don't return anything meaningfull, so we leave the parameter blank. We only need one .catch() method for any error that might occur for any step in our chain of promises and .then() handlers. But you see we are out of 'CALLBACK HELL'.

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find that file.');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write file.');
      resolve('Success!');
    });
  });
};

readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Random dog image saved to file!');
  })
  .catch((err) => {
    console.log(err.message);
  });

// Async/Await
// Instead of consuming Promises with
