export const playClickSound = () => {
    const audio = new Audio('https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3');
    audio.play().catch(error => console.error("Error ", error));
};