export default function gettingTime(){
    const setTime = new Date().getHours();


    if(setTime < 12){
        return "Good Morning"
    }
    else if(setTime < 18){
        return "Good Afternoon"
    }
    else{
        return "Good Night"
    }
}