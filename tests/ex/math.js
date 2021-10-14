const calculateTip = (total, tipPrecent = .25) => total + (total * tipPrecent)
const fahrenhitToCelcius = (temp) => (temp -32) / 1.8
const celciusToFahrenhit = (temp) => (temp * 1.8) + 32

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(a < 0 || b < 0){
                return reject('Number mush be non-negative');
            }

            resolve(a + b);
        }, 2000)
    });
}

module.exports = {
    calculateTip, 
    fahrenhitToCelcius, 
    celciusToFahrenhit,
    add
}