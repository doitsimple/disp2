rootApp.filter('slice', function() {
  return function(arr, start, end) {
    if(arr)
    return arr.slice(start, end);
  };
});
