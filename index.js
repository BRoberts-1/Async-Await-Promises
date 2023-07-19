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

// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePro('dog-img.txt', res.body.message);
//   })
//   .then(() => {
//     console.log('Random dog image saved to file!');
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// Async/Await

// Instead of consuming Promises with the .then() method which still uses callback functions. Usually, when we write code, we'll be consuming promises all the time, but not reducing them, so async/await makes this much easier.

// We need to create an async function:
// Inside an async function we can always have more than one await expression, we use await and then the Promise(save it into a variable, here 'data'). The await stops code from running until the Promise is resolve. The value of the await expression is the resolved value of the Promise. The point is to make our code 'look like' synchronous code while being asynchronous. The code below is the same as line 103 above. We get our data, store it into a variable, and log it to console.
// We then add the rest of the promises after an 'await', log to console, the writeFilePro doesn't need variable because it doesn't return anything. We just need to log message it was successfully saved to file. We then call our async function after this code block.
// To handle errors, we will use a standard JavaScript feature called 'Try/Catch.' We wrap all of our code in a 'Try' block, it will try to execute our code, and if there is an error, we will after this put a 'Catch' block. If there is an error, it will immediately exit the 'Try' block and go to the 'Catch" block and give us access to the error that occcured, which we can then handle with our code.
// Also, know async/await is just syntatic sugar for Promises.
// const getDogPic = async () => {
//   try {
//     const data = await readFilePro(`${__dirname}/dog.txt`);
//     console.log(`Breed: ${data}}`);

//     const res = await superagent.get(
//       `https://dog.ceo/api/breed/${data}/images/random`
//     );
//     console.log(res.body.message);

//     await writeFilePro('dog-img.txt', res.body.message);
//     console.log('Random dog image saved to file!');
//   } catch (err) {
//     console.log(err);
//   }
// };
// getDogPic();

// Returning values from Async functions. Learning how async functions actually work.

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro('dog-img.txt', res.body.message);
    console.log('Random dog image saved to file!');
  } catch (err) {
    console.log(err);

    throw err;
  }
  return '2: READY!!!';
};
console.log('1: Will get dog pics!');
// const x = getDogPic();
// console.log(x);
// console.log('3: Done getting dog pics!');

// getDogPic()
//   .then((x) => {
//     console.log(x);
//     console.log('3: Done getting dog pics!');
//   })
//   .catch((err) => {
//     console.log('ERROR ');
//   });

// Above: instead of logging x to console we get a 'Promise {  <pending>} because promises are returned immediately and automatically. It says pending because it has not yet finished executing and so JS just moves on to the next console.log() and then finishes. To actually get the returned value of the string '2: READY!!!', then we have to deal with it as a promise and use either .then() method or async/await. We use the .then() method on the getDogPic() value and put console logs inside the callback function.
// Now it works as expected and returns our value.
// But to deal with an error is a little more tricky because it will continue just giving us the value of the above string. So we will use a built-in JS function called 'throw' in case there is an error. We will put a .catch() function on it to log the error. Throwing the error marks the entire 'catch' block as an error and it will be caught by the 'catch' to process it.

// But now we are mixing Promises with Async/Await, so to implement this logic with async/await we will use an IIFE(Immediately Invoked Function Expression)
// When using Async/Await use the Try/Catch pattern.
// It is always necessary to write the (err) after the 'catch' keyword.
// Important to identify what is our Promise(here it is the function 'getDogPic' so we use await keyword here and store it in a variable 'x' and then log to console.)
// This is an async function calling an async function.
// Just remember an async function returns a 'promise' and that promise only returns a value once the 'promise' is fulfilled i.e. resolved.
(async () => {
  try {
    console.log('1: Will get dog pics!');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics!');
  } catch (err) {
    console.log('ERROR ');
  }
})();
