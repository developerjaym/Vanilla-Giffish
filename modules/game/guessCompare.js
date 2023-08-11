import normalize from "./normalize.js"

  
  const compare = (guess, rightAnswer) => {
    return normalize(guess) === normalize(rightAnswer)
  }

  export default compare
  