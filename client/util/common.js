/**
 * Insert common items here
 */
import toscalogoColor from 'Assets/toscalogo_color.svg'
import toscalogoGrayscale from 'Assets/toscalogo_grayscale.svg'

export const images = {
  toska_color: toscalogoColor,
  toska_grayscale: toscalogoGrayscale,
}

export const colors = {

}

// Fisher-Yates Shuffle
export const shuffle = (array) => {
  let counter = array.length

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter)

    // Decrease counter by 1
    counter--

    // And swap the last element with it
    const temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }

  return array
}

export * from '@root/config/common'
