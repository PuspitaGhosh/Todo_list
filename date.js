// module.exports is javascript object so we can add keys and values as many as we want.
module.exports.getDate=getDate;
function getDate()
{
  var today = new Date();
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  var day = today.toLocaleDateString("en-US", options);
  return day;
}
module.exports.getDay=getDay;

function getDay()
{
  var today = new Date();
  const options = {
    weekday: 'long',
  };
  var day = today.toLocaleDateString("en-US", options);
  return day;
}
