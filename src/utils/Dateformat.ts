import {format} from 'timeago.js';

interface IHelpers{
     timeago : (dateTime : Date | string) => string;
     unixToDate : (unixDate : number) => string;
     dateToFamily : (date : string) => string;
}

const helpers : IHelpers = {
     timeago : (timestamp : Date | string) =>{
          return format(timestamp);
     },
     unixToDate : (date) =>{
          const getDate = new Date(date * 1000).toLocaleString();
          return getDate
     },
     dateToFamily: (familyDate) =>{
          const timestamp = Date.parse(familyDate);
          const date = new Date(timestamp);

          const hour = date.getHours();
          const minute = date.getMinutes();
          const second = date.getSeconds();
          const day = date.getDate();
          const month = date.getMonth() + 1;  // add 1 to get the month as a number between 1 and 12
          const year = date.getFullYear();
          const dateHour = `${hour}:${minute}:${second}`
          const dateTime = `${month}/${day}/${year}`
          return dateHour + ' ' + dateTime
     }
}


//https://codingnconcepts.com/javascript/how-to-divide-array-in-equal-parts-in-javascript/

export default helpers